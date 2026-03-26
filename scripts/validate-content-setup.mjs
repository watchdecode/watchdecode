import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "src", "content", "posts");
const keystaticConfigPath = path.join(root, "keystatic.config.ts");
const expectedCollectionPath = 'path: "src/content/posts/*"';

async function main() {
  const keystaticConfig = await readFile(keystaticConfigPath, "utf8");
  if (!keystaticConfig.includes(expectedCollectionPath)) {
    throw new Error(
      `Keystatic posts path must be ${expectedCollectionPath}. Update keystatic.config.ts to match file-based posts.`,
    );
  }

  const entries = await readdir(postsDir, { withFileTypes: true });
  const mdxFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".mdx"));

  if (mdxFiles.length === 0) {
    throw new Error("No blog posts found in src/content/posts/*.mdx. Add at least one published post.");
  }

  console.log(`Content validation passed: found ${mdxFiles.length} post file(s).`);
}

main().catch((error) => {
  console.error(`Content validation failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
