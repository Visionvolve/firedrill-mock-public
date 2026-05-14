
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

export interface ValidationResult {
  passed: boolean;
  output: string;
  duration_ms: number;
}

export type IncidentResults = Record<string, ValidationResult>;

interface PwTestResult {
  status: string;
  duration: number;
  error?: { message?: string; stack?: string };
  errors?: Array<{ message?: string; stack?: string }>;
}

interface PwTest {
  status: string;
  results: PwTestResult[];
  projectName?: string;
}

interface PwSpec {
  title: string;
  file: string;
  ok: boolean;
  tests: PwTest[];
}

interface PwSuite {
  title: string;
  file?: string;
  specs?: PwSpec[];
  suites?: PwSuite[];
}

interface PwReport {
  config?: unknown;
  suites: PwSuite[];
  errors?: Array<{ message?: string; stack?: string }>;
  stats?: { duration: number; expected: number; unexpected: number; skipped: number };
}

const INC_FILE_RE = /(INC-[A-Z])\.spec\.ts$/;
const MAX_OUTPUT_BYTES = 4096;

function flattenSpecs(suites: PwSuite[] | undefined): PwSpec[] {
  const out: PwSpec[] = [];
  if (!suites) return out;
  const stack = [...suites];
  while (stack.length) {
    const s = stack.pop()!;
    if (s.specs) out.push(...s.specs);
    if (s.suites) stack.push(...s.suites);
  }
  return out;
}

function stripAnsi(s: string): string {
  // Playwright's reporter embeds ANSI colour codes — strip them for the
  // text we ship to the microsite (which the participant UI may render).
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1B\[[0-9;]*[A-Za-z]/g, "");
}

function reduceToIncidentResults(report: PwReport): IncidentResults {
  const specs = flattenSpecs(report.suites);
  const byCode: Map<string, PwSpec[]> = new Map();
  for (const spec of specs) {
    const m = INC_FILE_RE.exec(spec.file);
    if (!m) continue;
    const code = m[1];
    const list = byCode.get(code) ?? [];
    list.push(spec);
    byCode.set(code, list);
  }

  const results: IncidentResults = {};
  for (const [code, specsForCode] of byCode) {
    let allPassed = true;
    let totalDuration = 0;
    const errSnippets: string[] = [];
    for (const spec of specsForCode) {
      if (!spec.ok) allPassed = false;
      for (const t of spec.tests) {
        for (const r of t.results) {
          totalDuration += r.duration ?? 0;
          if (r.status !== "passed") {
            const errs = r.errors ?? (r.error ? [r.error] : []);
            for (const e of errs) {
              const msg = stripAnsi(e.message ?? "");
              const stack = stripAnsi(e.stack ?? "");
              errSnippets.push(`[${spec.title}] ${msg}${stack ? "\n" + stack : ""}`);
            }
          }
        }
      }
    }
    let output = "";
    if (!allPassed) {
      output = errSnippets.join("\n---\n").slice(0, MAX_OUTPUT_BYTES);
    }
    results[code] = {
      passed: allPassed,
      output,
      duration_ms: Math.round(totalDuration),
    };
  }
  return results;
}

function findPlaywrightCli(cwd: string): string {
  // Prefer the local install so we use the version pinned in package.json.
  const local = join(cwd, "node_modules", "@playwright", "test", "cli.js");
  if (existsSync(local)) return local;
  // Fallback: rely on PATH-resolved playwright.
  return "playwright";
}

export interface RunOptions {
  cwd?: string;
  baseURL?: string;
  testGlob?: string;
}

export function runValidation(opts: RunOptions = {}): IncidentResults {
  const cwd = opts.cwd ?? process.cwd();
  const baseURL = opts.baseURL ?? process.env.BASE_URL ?? "http://localhost:3000";
  const testGlob = opts.testGlob ?? "tests/incidents/";
  const cli = findPlaywrightCli(cwd);

  // spawnSync with shell:false (default) — args are passed as an array, no
  // shell expansion, so this is safe even if values contained shell metas.
  //
  // Don't set CI=1: the playwright.config.ts uses `reuseExistingServer: !CI`,
  // which means a CI run would refuse to talk to an externally-managed dev
  // server. We always expect to run against an already-running container
  // (in dev: localhost:3001; in prod: the participant's docker service), so
  // we explicitly clear CI from the child env.
  const args = [cli, "test", testGlob, "--reporter=json", "--workers=1"];
  const childEnv = { ...process.env, BASE_URL: baseURL };
  delete (childEnv as Record<string, string | undefined>).CI;
  const proc = spawnSync(process.execPath, args, {
    cwd,
    env: childEnv,
    encoding: "utf-8",
    maxBuffer: 32 * 1024 * 1024,
  });

  if (proc.error) {
    throw new Error(`Playwright failed to spawn: ${proc.error.message}`);
  }

  const raw = proc.stdout || "";
  let report: PwReport;
  try {
    report = JSON.parse(raw) as PwReport;
  } catch {
    const stderr = (proc.stderr || "").slice(0, 2000);
    const stdout = raw.slice(0, 2000);
    throw new Error(
      `Playwright JSON reporter output was not valid JSON.\n` +
        `exit=${proc.status}\nstdout(head)=${stdout}\nstderr(head)=${stderr}`,
    );
  }

  return reduceToIncidentResults(report);
}

// CLI entry: when invoked directly via `node scripts/run-validation.ts`,
// run + emit one JSON line to stdout. We detect "direct invocation" by
// checking the filename of process.argv[1] — this works under both CJS and
// the `--experimental-strip-types` ESM path (where `require.main` is not
// available).
const isMain = ((): boolean => {
  const entry = process.argv[1] ?? "";
  return entry.endsWith("run-validation.ts") || entry.endsWith("run-validation.js");
})();

if (isMain) {
  try {
    const results = runValidation({ cwd: process.cwd() });
    process.stdout.write(JSON.stringify(results) + "\n");
    process.exit(0);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    process.stderr.write(`[run-validation] FATAL: ${message}\n`);
    process.exit(1);
  }
}
