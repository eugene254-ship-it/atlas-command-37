#!/usr/bin/env node
/**
 * Pre-build sanity check for Tailwind / PostCSS configuration.
 *
 * Tailwind v4 + @tailwindcss/vite needs no config file, but if one IS
 * present it must be parseable. Fails loudly with file path on syntax errors.
 */
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve, relative } from "node:path";

const ROOT = process.cwd();
const GITHUB = process.env.GITHUB_ACTIONS === "true" || process.argv.includes("--github");
const QUIET = process.argv.includes("--quiet");

const DEFAULT_CANDIDATES = [
  "tailwind.config.js",
  "tailwind.config.cjs",
  "tailwind.config.mjs",
  "tailwind.config.ts",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.mjs",
  "postcss.config.json",
];

// Allow tests to point at an alternate set of configs.
const overrideArg = process.argv.find((a) => a.startsWith("--files="));
const candidates = overrideArg
  ? overrideArg.slice("--files=".length).split(",").map((p) => p.trim()).filter(Boolean)
  : DEFAULT_CANDIDATES;

const found = candidates.map((f) => resolve(ROOT, f)).filter(existsSync);

/**
 * Extract a (line, col) pair from a JS/JSON parse error message.
 * Handles common shapes:
 *   "...:12:7"                              (V8 stack frame)
 *   "Unexpected token } in JSON at position 42"
 *   "Unexpected token (1:23)"
 */
function extractLineCol(message, source) {
  const m1 = message.match(/(\d+):(\d+)\)?\s*$/);
  if (m1) return { line: Number(m1[1]), col: Number(m1[2]) };
  const m2 = message.match(/\((\d+):(\d+)\)/);
  if (m2) return { line: Number(m2[1]), col: Number(m2[2]) };
  const m3 = message.match(/at position (\d+)/i);
  if (m3 && source) {
    const pos = Number(m3[1]);
    const upto = source.slice(0, pos);
    const line = upto.split("\n").length;
    const col = pos - upto.lastIndexOf("\n");
    return { line, col };
  }
  return { line: null, col: null };
}

if (found.length === 0) {
  if (!QUIET) console.log("\x1b[32m[validate-configs]\x1b[0m No tailwind/postcss config files (Tailwind v4 zero-config). OK.");
  process.exit(0);
}

let failed = false;
for (const file of found) {
  const rel = relative(ROOT, file) || file;
  let source = "";
  try { source = readFileSync(file, "utf8"); } catch {}
  try {
    if (file.endsWith(".json")) {
      JSON.parse(source);
    } else if (file.endsWith(".ts")) {
      void source; // syntactic read; Vite compiles later
    } else {
      await import(pathToFileURL(file).href);
    }
    if (!QUIET) console.log(`\x1b[32m[validate-configs]\x1b[0m ${rel} parsed OK.`);
  } catch (e) {
    failed = true;
    const { line, col } = extractLineCol(String(e.message || ""), source);
    console.error(`\x1b[31m[validate-configs]\x1b[0m ${rel} failed to parse${line ? ` at line ${line}` : ""}: ${e.message}`);
    if (GITHUB) {
      const loc = line ? `,line=${line}${col ? `,col=${col}` : ""}` : "";
      console.log(`::error file=${rel}${loc}::Config file failed to parse: ${String(e.message).replace(/\n/g, " ")}`);
    }
  }
}

process.exit(failed ? 1 : 0);