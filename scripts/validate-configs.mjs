#!/usr/bin/env node
/**
 * Pre-build sanity check for Tailwind / PostCSS configuration.
 *
 * Tailwind v4 + @tailwindcss/vite needs no config file, but if one IS
 * present it must be parseable. Fails loudly with file path on syntax errors.
 */
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const ROOT = process.cwd();
const CANDIDATES = [
  "tailwind.config.js",
  "tailwind.config.cjs",
  "tailwind.config.mjs",
  "tailwind.config.ts",
  "postcss.config.js",
  "postcss.config.cjs",
  "postcss.config.mjs",
  "postcss.config.json",
];

const found = CANDIDATES.map((f) => resolve(ROOT, f)).filter(existsSync);

if (found.length === 0) {
  console.log("\x1b[32m[validate-configs]\x1b[0m No tailwind/postcss config files (Tailwind v4 zero-config). OK.");
  process.exit(0);
}

let failed = false;
for (const file of found) {
  try {
    if (file.endsWith(".json")) {
      JSON.parse(readFileSync(file, "utf8"));
    } else if (file.endsWith(".ts")) {
      readFileSync(file, "utf8"); // syntactic read; Vite compiles later
    } else {
      await import(pathToFileURL(file).href);
    }
    console.log(`\x1b[32m[validate-configs]\x1b[0m ${file} parsed OK.`);
  } catch (e) {
    failed = true;
    console.error(`\x1b[31m[validate-configs]\x1b[0m ${file} failed to parse: ${e.message}`);
    if (process.env.GITHUB_ACTIONS === "true") {
      console.log(`::error file=${file}::Config file failed to parse: ${e.message.replace(/\n/g, " ")}`);
    }
  }
}

process.exit(failed ? 1 : 0);