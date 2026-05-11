#!/usr/bin/env node
/**
 * Smoke tests for scripts/validate-css.mjs.
 *
 * Spawns the validator in a temp working directory whose `src/styles.css`
 * is one of the fixtures, then asserts the exit code and stderr message.
 *
 * Run with: node scripts/__tests__/run-tests.mjs
 */
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, copyFileSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const VALIDATOR = resolve(HERE, "..", "validate-css.mjs");
const FIXTURES = join(HERE, "fixtures");

const cases = [
  { name: "valid.css passes",                    fixture: "valid.css",              expectExit: 0 },
  { name: "truncated braces fail",               fixture: "invalid-truncated.css",  expectExit: 1, expectMatch: /Unbalanced braces|Unmatched/ },
  { name: "stray closing brace fails",           fixture: "invalid-unmatched.css",  expectExit: 1, expectMatch: /Unmatched closing/ },
  { name: "@media without block fails",          fixture: "invalid-atrule.css",     expectExit: 1, expectMatch: /must be followed by a block/ },
];

let failed = 0;
for (const c of cases) {
  const dir = mkdtempSync(join(tmpdir(), "validate-css-"));
  try {
    mkdirSync(join(dir, "src"), { recursive: true });
    copyFileSync(join(FIXTURES, c.fixture), join(dir, "src", "styles.css"));
    const jsonPath = join(dir, "summary.json");
    const res = spawnSync(process.execPath, [VALIDATOR, `--json=${jsonPath}`, "--quiet"], {
      cwd: dir,
      encoding: "utf8",
    });
    const combined = (res.stdout || "") + (res.stderr || "");
    const exitOk = res.status === c.expectExit;
    const matchOk = !c.expectMatch || c.expectMatch.test(combined);
    let summaryOk = true;
    try {
      const summary = JSON.parse(readFileSync(jsonPath, "utf8"));
      summaryOk = summary.ok === (c.expectExit === 0);
    } catch {
      summaryOk = false;
    }
    if (exitOk && matchOk && summaryOk) {
      console.log(`  ✓ ${c.name}`);
    } else {
      failed++;
      console.error(`  ✗ ${c.name}`);
      console.error(`      exit=${res.status} expected=${c.expectExit} matchOk=${matchOk} summaryOk=${summaryOk}`);
      console.error(`      output: ${combined.trim().slice(0, 400)}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (failed) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length} validate-css tests passed.`);