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
const CONFIG_VALIDATOR = resolve(HERE, "..", "validate-configs.mjs");
const FIXTURES = join(HERE, "fixtures");
const CONFIG_FIXTURES = join(FIXTURES, "configs");

const cases = [
  { name: "valid.css passes",                    fixture: "valid.css",              expectExit: 0 },
  { name: "truncated braces fail",               fixture: "invalid-truncated.css",  expectExit: 1, expectMatch: /Unbalanced braces|Unmatched/ },
  { name: "stray closing brace fails",           fixture: "invalid-unmatched.css",  expectExit: 1, expectMatch: /Unmatched closing/ },
  { name: "@media without block fails",          fixture: "invalid-atrule.css",     expectExit: 1, expectMatch: /must be followed by a block/ },
  { name: "unmatched parenthesis fails",         fixture: "invalid-unmatched-parens.css", expectExit: 1, expectMatch: /Unbalanced parentheses/ },
];

let failed = 0;
function fail(name, detail) {
  failed++;
  console.error(`  ✗ ${name}`);
  if (detail) console.error(`      ${detail}`);
}

console.log("validate-css.mjs:");
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
    let shapeOk = true;
    let shapeDetail = "";
    try {
      const summary = JSON.parse(readFileSync(jsonPath, "utf8"));
      summaryOk = summary.ok === (c.expectExit === 0);
      const requiredKeys = ["ok", "errors", "checks", "timestamp", "entry"];
      const missing = requiredKeys.filter((k) => !(k in summary));
      if (missing.length) { shapeOk = false; shapeDetail = `missing keys: ${missing.join(",")}`; }
      if (!Array.isArray(summary.errors)) { shapeOk = false; shapeDetail += " errors not array"; }
      if (!Array.isArray(summary.checks)) { shapeOk = false; shapeDetail += " checks not array"; }
      if (typeof summary.timestamp !== "string" || isNaN(Date.parse(summary.timestamp))) {
        shapeOk = false; shapeDetail += " timestamp invalid";
      }
      if (c.expectExit !== 0 && summary.errors.length === 0) {
        shapeOk = false; shapeDetail += " expected errors[] non-empty";
      }
    } catch {
      summaryOk = false;
      shapeOk = false;
      shapeDetail = "summary not readable JSON";
    }
    if (exitOk && matchOk && summaryOk && shapeOk) {
      console.log(`  ✓ ${c.name}`);
    } else {
      fail(c.name,
        `exit=${res.status} expected=${c.expectExit} matchOk=${matchOk} summaryOk=${summaryOk} shapeOk=${shapeOk} ${shapeDetail}\n      output: ${combined.trim().slice(0, 400)}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// ---------- validate-configs.mjs ----------
const configCases = [
  {
    name: "valid tailwind.config.mjs passes",
    files: { "tailwind.config.mjs": "valid-tailwind.config.mjs" },
    expectExit: 0,
  },
  {
    name: "invalid tailwind.config.mjs fails with line info",
    files: { "tailwind.config.mjs": "invalid-tailwind.config.mjs" },
    expectExit: 1,
    expectMatch: /failed to parse/,
  },
  {
    name: "valid postcss.config.json passes",
    files: { "postcss.config.json": "valid-postcss.config.json" },
    expectExit: 0,
  },
  {
    name: "invalid postcss.config.json fails",
    files: { "postcss.config.json": "invalid-postcss.config.json" },
    expectExit: 1,
    expectMatch: /failed to parse/,
  },
  {
    name: "no config files → OK (zero-config)",
    files: {},
    expectExit: 0,
  },
];

console.log("\nvalidate-configs.mjs:");
for (const c of configCases) {
  const dir = mkdtempSync(join(tmpdir(), "validate-configs-"));
  try {
    for (const [dest, src] of Object.entries(c.files)) {
      copyFileSync(join(CONFIG_FIXTURES, src), join(dir, dest));
    }
    const res = spawnSync(process.execPath, [CONFIG_VALIDATOR, "--quiet"], {
      cwd: dir,
      encoding: "utf8",
    });
    const combined = (res.stdout || "") + (res.stderr || "");
    const exitOk = res.status === c.expectExit;
    const matchOk = !c.expectMatch || c.expectMatch.test(combined);
    if (exitOk && matchOk) {
      console.log(`  ✓ ${c.name}`);
    } else {
      fail(c.name, `exit=${res.status} expected=${c.expectExit} matchOk=${matchOk}\n      output: ${combined.trim().slice(0, 400)}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (failed) {
  console.error(`\n${failed} test(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${cases.length + configCases.length} tests passed.`);