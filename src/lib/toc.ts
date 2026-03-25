import { slugify } from "@/src/lib/slug";

export type TocLevel = 2 | 3;

export type TocItem = {
  id: string;
  text: string;
  level: TocLevel;
};

function stripInlineMarkdown(text: string): string {
  return text
    // Strip explicit MDX/remark IDs
    .replace(/\{#[^}]+\}\s*$/g, "")
    // Convert markdown links to their label: [label](url) -> label
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    // Remove common emphasis/inline code markers
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractTocItemsFromMdx(source: string): TocItem[] {
  const lines = source.split(/\r?\n/);
  const items: TocItem[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const match = line.match(/^\s*(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;

    const hashes = match[1] ?? "";
    const rawText = match[2] ?? "";
    const level = hashes.length === 2 ? 2 : hashes.length === 3 ? 3 : null;
    if (!level) continue;

    const text = stripInlineMarkdown(rawText);
    if (!text) continue;

    const id = slugify(text);
    if (!id || seen.has(id)) continue;
    seen.add(id);

    items.push({ id, text, level });
  }

  return items;
}

