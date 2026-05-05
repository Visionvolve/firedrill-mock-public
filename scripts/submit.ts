#!/usr/bin/env npx tsx
// Phase 22 (D-10): participant CLI for `npm run submit`.
// Tars the working tree, POSTs as multipart, polls run status, prints colored summary.
// Node 22+ stdlib only (native fetch + FormData + node:child_process spawnSync).
//
// Resolution order for token + cohort:
//   1. env FIREDRILL_TOKEN + FIREDRILL_COHORT
//   2. ~/.firedrill/token (line 1: token starting "frd_", line 2: cohort code)
//   3. interactive prompt
//
// Tar exclusions: see .firedrillignore in the repo root (this script also hard-
// excludes the noisy directories defensively in case the file is missing).
//
// SAFETY: tar is invoked via spawnSync with an arg-array and { shell: false } —
// the participant cannot influence args, so no shell-metacharacter exposure.

import { readFileSync, existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { homedir } from "node:os";
import { createInterface } from "node:readline/promises";
import { Buffer } from "node:buffer";

// G4 fix: prevent macOS from injecting AppleDouble resource fork files
// (`._*`) into the tarball, which the server-side validator rejects with
// "non-allowed entry name". COPYFILE_DISABLE=1 stops the fork from being
// emitted in the first place; --exclude="._*" defends against any that
// might already exist on disk.
process.env.COPYFILE_DISABLE = "1";

const API = process.env.FIREDRILL_API_URL ?? "https://workshop.visionvolve.com";

interface TokenInfo {
  token: string;
  cohort: string;
}

async function readToken(): Promise<TokenInfo> {
  if (process.env.FIREDRILL_TOKEN) {
    const cohort = process.env.FIREDRILL_COHORT ?? "";
    if (!cohort) {
      throw new Error(
        "FIREDRILL_COHORT must be set when FIREDRILL_TOKEN is set",
      );
    }
    return { token: process.env.FIREDRILL_TOKEN, cohort };
  }
  const path = join(homedir(), ".firedrill", "token");
  if (existsSync(path)) {
    const lines = readFileSync(path, "utf8").trim().split("\n");
    const token = lines.find((l) => l.startsWith("frd_")) ?? "";
    const cohort =
      lines.find((l) => !l.startsWith("frd_") && l.length > 0) ?? "";
    if (token && cohort) return { token, cohort };
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const cohort = (await rl.question("Cohort code: ")).trim();
  const token = (await rl.question("Deploy token (frd_...): ")).trim();
  rl.close();
  return { token, cohort };
}

function tarWorkingTree(): Buffer {
  // SAFETY: arg-array form + shell:false. Excludes mirror .firedrillignore.
  const result = spawnSync(
    "tar",
    [
      "-czf",
      "-",
      "--exclude=node_modules",
      "--exclude=.git",
      "--exclude=.next",
      "--exclude=test-results",
      "--exclude=playwright-report",
      "--exclude=.firedrillignore",
      "--exclude=*.tar.gz",
      // G4 fix: macOS resource forks (AppleDouble) get rejected by the
      // server-side tarball validator. COPYFILE_DISABLE=1 stops the fork
      // from being emitted; this exclude defends against any that already
      // exist on disk (e.g. from a prior unzip).
      "--exclude=._*",
      ".",
    ],
    { encoding: "buffer", maxBuffer: 50 * 1024 * 1024, shell: false },
  );
  if (result.status !== 0) {
    throw new Error(`tar failed: ${result.stderr.toString()}`);
  }
  return result.stdout;
}

interface RunStatus {
  status: string;
  message?: string;
  log_url?: string;
}

async function pollRun(
  cohort: string,
  runId: string,
  token: string,
): Promise<void> {
  const url = `${API}/api/cohorts/${cohort}/firedrill/runs/${runId}`;
  // 60 polls × 2s = 2 min; covers most validation runs (median ~30s per Plan 20-08).
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = (await res.json()) as RunStatus;
        if (data.status === "passed") {
          console.log("\n\x1b[32m✓ All incidents passed!\x1b[0m");
          if (data.log_url) console.log(`Log: ${data.log_url}`);
          return;
        }
        if (data.status === "failed" || data.status === "deploy_failed") {
          console.log(
            `\n\x1b[31m✗ ${data.status}: ${data.message ?? "see log"}\x1b[0m`,
          );
          if (data.log_url) console.log(`Log: ${data.log_url}`);
          return;
        }
      }
    } catch (e) {
      console.log(`\nPoll error (will retry): ${(e as Error).message}`);
    }
    process.stdout.write(".");
    await new Promise((r) => setTimeout(r, 2000));
  }
  console.log("\nTimed out waiting for validation. Check kanban for live status.");
}

async function main(): Promise<void> {
  const { token, cohort } = await readToken();
  console.log(`Submitting to ${API}/api/cohorts/${cohort}/firedrill/deploy`);

  const tarball = tarWorkingTree();
  console.log(`Packed ${(tarball.length / 1024).toFixed(1)} KB`);

  const fd = new FormData();
  fd.append(
    "file",
    new Blob([tarball], { type: "application/gzip" }),
    "firedrill.tar.gz",
  );

  const res = await fetch(
    `${API}/api/cohorts/${cohort}/firedrill/deploy`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    },
  );

  if (!res.ok) {
    console.error(
      `\x1b[31mDeploy failed: ${res.status} ${await res.text()}\x1b[0m`,
    );
    process.exit(1);
  }
  const result = (await res.json()) as {
    run_id: string;
    validation_url: string;
    slot: number;
  };
  console.log(
    `Deploy accepted. Run ID: ${result.run_id} (slot p${result.slot})`,
  );
  console.log(`Polling ${API}${result.validation_url}...`);
  await pollRun(cohort, result.run_id, token);
}

main().catch((e) => {
  console.error(`\x1b[31mError: ${(e as Error).message}\x1b[0m`);
  process.exit(1);
});
