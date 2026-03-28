/**
 * Debug helper: compare category strings from MDX frontmatter vs a simulated URL query.
 * Run: node scripts/debug-category-filter.mjs
 * Optional: node scripts/debug-category-filter.mjs "Reviews"
 */
import { createRequire } from "module";
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const require = createRequire(import.meta.url);

// Load compiled helpers via ts would need tsx; replicate minimal logic for logging:
function normalizeCategoryLabel(input) {
  return input
    .replace(/^\uFEFF/, "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function charDump(label, s) {
  console.log(`\n--- ${label} ---`);
  console.log("String:", JSON.stringify(s));
  console.log("Length:", s.length);
  console.log("Code units:", [...s].map((ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(" "));
}

const simulatedUrlParam = process.argv[2] ?? "Reviews";

const mdxDir = join(root, "src/content/posts");
const files = readdirSync(mdxDir).filter((f) => f.endsWith(".mdx"));

console.log("Simulated URL query category param:", JSON.stringify(simulatedUrlParam));
charDump("URL param (raw)", simulatedUrlParam);
charDump("URL param (normalized)", normalizeCategoryLabel(simulatedUrlParam));

console.log("\n========== MDX frontmatter category lines ==========");
for (const f of files) {
  const raw = readFileSync(join(mdxDir, f), "utf8");
  const m = raw.match(/^category:\s*(.+)$/m);
  const line = m ? m[1].trim() : null;
  if (!line) {
    console.log(f, "NO category line");
    continue;
  }
  // YAML unquoted value — strip optional quotes
  const unquoted = line.replace(/^["']|["']$/g, "");
  charDump(`File ${f}`, unquoted);
  const match = normalizeCategoryLabel(unquoted) === normalizeCategoryLabel(simulatedUrlParam);
  console.log("normalize match vs URL:", match);
}

console.log("\n========== Keystatic reader (same as app) ==========");
const { createReader } = await import("@keystatic/core/reader");
const keystaticConfig = (await import(join(root, "keystatic.config.ts"))).default;
const reader = createReader(root, keystaticConfig);
const slugs = await reader.collections.posts.list();
for (const slug of slugs) {
  const entry = await reader.collections.posts.read(slug, { resolveLinkedFiles: true });
  if (!entry) continue;
  const c = entry.category;
  console.log(`\n${slug}:`);
  console.log("  typeof entry.category:", typeof c);
  console.log("  value:", c);
  if (c && typeof c === "object") console.log("  keys:", Object.keys(c));
  const asString = typeof c === "string" ? c : c && typeof c === "object" && "value" in c ? c.value : String(c);
  charDump("  as string for compare", asString);
  console.log(
    "  normalize match vs URL:",
    normalizeCategoryLabel(asString) === normalizeCategoryLabel(simulatedUrlParam),
  );
}
