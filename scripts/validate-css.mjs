#!/usr/bin/env node
/**
 * Strict pre-build validator for src/styles.css.
 *
 * Checks:
 *  1. Brace balance ({ vs }) — catches truncated or extra blocks.
 *  2. Parenthesis balance — catches malformed url(), oklch(), var(), etc.
 *  3. Every @layer / @keyframes / @theme / @media / @supports has an opening {.
 *  4. No stray "}" at top level after the final rule.
 *  5. Confirms src/styles.css is the ONLY top-level Tailwind/PostCSS input
 *     (i.e. only one file imports "tailwindcss").
 *
 * Exits non-zero with a clear, line-numbered error on failure.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const ENTRY = "src/styles.css";

function fail(msg) {
  console.error(`\n\x1b[31m[validate-css] ${msg}\x1b[0m\n`);
  process.exit(1);
}
function ok(msg) {
  console.log(`\x1b[32m[validate-css]\x1b[0m ${msg}`);
}

let css;
try {
  css = readFileSync(join(ROOT, ENTRY), "utf8");
} catch (e) {
  fail(`Cannot read ${ENTRY}: ${e.message}`);
}

// Strip /* ... */ comments and string literals so braces inside them don't count.
function sanitize(src) {
  let out = "";
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    const n = src[i + 1];
    if (c === "/" && n === "*") {
      const end = src.indexOf("*/", i + 2);
      if (end === -1) return { out, error: "Unterminated /* comment" };
      out += " ".repeat(end + 2 - i);
      i = end + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      out += " ";
      i++;
      while (i < src.length && src[i] !== quote) {
        if (src[i] === "\\") { out += "  "; i += 2; continue; }
        out += " ";
        i++;
      }
      out += " ";
      i++;
      continue;
    }
    out += c;
    i++;
  }
  return { out };
}

const { out: clean, error } = sanitize(css);
if (error) fail(error);

// Brace + paren balance with line tracking.
let depth = 0, parens = 0, line = 1;
const stack = [];
for (let i = 0; i < clean.length; i++) {
  const c = clean[i];
  if (c === "\n") line++;
  else if (c === "{") { depth++; stack.push(line); }
  else if (c === "}") {
    depth--;
    stack.pop();
    if (depth < 0) fail(`Unmatched closing "}" at line ${line} in ${ENTRY}`);
  }
  else if (c === "(") parens++;
  else if (c === ")") { parens--; if (parens < 0) fail(`Unmatched ")" at line ${line}`); }
}
if (depth !== 0) fail(`Unbalanced braces in ${ENTRY}: ${depth} unclosed block(s) opened at line(s) ${stack.join(", ")}`);
if (parens !== 0) fail(`Unbalanced parentheses in ${ENTRY}: net ${parens}`);

// At-rules that MUST be followed by a block.
const blockAtRules = /@(layer|keyframes|theme|media|supports|font-face|page|container)\b[^;{}]*?(\{|;)/g;
let m;
let lineStart = 0;
const lines = clean.split("\n");
while ((m = blockAtRules.exec(clean)) !== null) {
  if (m[2] === ";") {
    // count line
    const upto = clean.slice(0, m.index);
    const ln = upto.split("\n").length;
    // @layer name; (declaration form) is valid; others aren't
    if (!/^@layer\b/.test(m[0])) {
      fail(`@${m[1]} must be followed by a block "{ ... }" — saw ";" at line ${ln}`);
    }
  }
}

ok(`${ENTRY} parsed cleanly (${lines.length} lines, ${depth === 0 ? "balanced" : "UNBALANCED"} braces).`);

// Confirm styles.css is the only Tailwind input.
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "dist" || name === ".git" || name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, acc);
    else if (name.endsWith(".css")) acc.push(p);
  }
  return acc;
}
const cssFiles = walk(join(ROOT, "src"));
const tailwindInputs = cssFiles.filter((f) => /@import\s+["']tailwindcss["']/.test(readFileSync(f, "utf8")));
if (tailwindInputs.length === 0) fail(`No file imports "tailwindcss". Expected exactly one: ${ENTRY}`);
if (tailwindInputs.length > 1) {
  fail(
    `Multiple Tailwind input files detected (expected only ${ENTRY}):\n  - ` +
      tailwindInputs.map((f) => relative(ROOT, f)).join("\n  - ")
  );
}
const onlyInput = relative(ROOT, tailwindInputs[0]).replaceAll("\\", "/");
if (onlyInput !== ENTRY) fail(`Tailwind input is "${onlyInput}", expected "${ENTRY}".`);
ok(`Confirmed single Tailwind input: ${ENTRY}`);