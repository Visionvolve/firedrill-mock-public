// Phase 20 (D-13): post-receive worker entry point that submits
// the validation results JSON (produced by run-validation.ts) to the
// microsite firedrill validation endpoint.
//
// Invocation patterns:
//   1. Pipe:    `npm run validate:run | npm run validate:post`
//   2. File:    `node --experimental-strip-types scripts/post-results.ts --input results.json`
//   3. Inline:  the post-receive hook on the VPS (Plan 20-08) wraps both scripts.
//
// Required env vars (process refuses to POST without them):
//   MICROSITE_URL       — e.g. https://workshop-staging.visionvolve.com
//   COHORT_ID           — UUID of the firedrill cohort
//   PARTICIPANT_ID      — UUID of the participant whose push triggered this
//   RUN_ID              — UUID of the active firedrill_runs row
//   VALIDATION_TOKEN    — bearer token (matches FIREDRILL_VALIDATION_TOKEN on microsite)
// Optional:
//   TRIGGERED_BY        — 'push' | 'manual' | 'reset'  (default: 'push')
//
// Exit codes:
//   0 — POST returned 2xx
//   1 — anything else (network error, non-2xx, missing env, malformed input)

import { readFileSync } from "node:fs";

interface ValidationResult {
  passed: boolean;
  output: string;
  duration_ms: number;
}

interface ResultsPayload {
  run_id: string;
  participant_id: string;
  triggered_by: "push" | "manual" | "reset";
  duration_ms: number;
  results: Record<string, ValidationResult>;
}

function getInputPath(argv: string[]): string | null {
  const i = argv.indexOf("--input");
  if (i >= 0 && argv[i + 1]) return argv[i + 1];
  return null;
}

async function readStdin(): Promise<string> {
  // Node 22 supports `for await` on stdin out of the box.
  let buf = "";
  for await (const chunk of process.stdin) {
    buf += typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf-8");
  }
  return buf;
}

async function loadResults(argv: string[]): Promise<Record<string, ValidationResult>> {
  const inputPath = getInputPath(argv);
  let raw: string;
  if (inputPath) {
    raw = readFileSync(inputPath, "utf-8");
  } else if (!process.stdin.isTTY) {
    raw = await readStdin();
  } else {
    throw new Error(
      "No input. Pipe run-validation output into this script, or pass --input <path>.",
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`Input is not valid JSON: ${(e as Error).message}`);
  }
  if (!parsed || typeof parsed !== "object") {
    throw new Error("Input JSON must be an object keyed by incident code.");
  }
  return parsed as Record<string, ValidationResult>;
}

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

async function main(): Promise<void> {
  const micrositeUrl = requireEnv("MICROSITE_URL").replace(/\/$/, "");
  const cohortId = requireEnv("COHORT_ID");
  const runId = requireEnv("RUN_ID");
  const participantId = requireEnv("PARTICIPANT_ID");
  const token = requireEnv("VALIDATION_TOKEN");
  const triggeredByRaw = process.env.TRIGGERED_BY ?? "push";
  if (
    triggeredByRaw !== "push" &&
    triggeredByRaw !== "manual" &&
    triggeredByRaw !== "reset"
  ) {
    throw new Error(
      `TRIGGERED_BY must be one of push|manual|reset (got: ${triggeredByRaw})`,
    );
  }
  const triggeredBy = triggeredByRaw as "push" | "manual" | "reset";

  const results = await loadResults(process.argv);

  // Aggregate duration from per-incident results so the receiver can record
  // wall-clock pressure. If individual durations are missing we fall back to 0.
  let totalDuration = 0;
  for (const r of Object.values(results)) {
    if (r && typeof r.duration_ms === "number") totalDuration += r.duration_ms;
  }

  const body: ResultsPayload = {
    run_id: runId,
    participant_id: participantId,
    triggered_by: triggeredBy,
    duration_ms: totalDuration,
    results,
  };

  const url = `${micrositeUrl}/api/cohorts/${cohortId}/firedrill/validation`;
  process.stderr.write(`[post-results] POST ${url}\n`);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  process.stderr.write(`[post-results] ${res.status} ${res.statusText}\n`);
  if (text) process.stderr.write(`[post-results] body: ${text.slice(0, 1024)}\n`);

  if (!res.ok) {
    process.exit(1);
  }
}

main().catch((err) => {
  process.stderr.write(
    `[post-results] FATAL: ${err instanceof Error ? err.message : String(err)}\n`,
  );
  process.exit(1);
});
