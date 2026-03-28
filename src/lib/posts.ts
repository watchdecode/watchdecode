import path from "node:path";
import { existsSync } from "node:fs";

import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "../../keystatic.config";

/** Absolute repo root so Keystatic resolves `src/content/posts/*` the same locally and on Vercel. */
const repoRoot = path.join(process.cwd(), "");

const reader = createReader(repoRoot, keystaticConfig);

export type Category =
  | "Buying Guides"
  | "Reviews"
  | "Comparisons"
  | "Watch Brands"
  | "Budget Picks"
  | "Luxury Watches"
  | "Watch Care";

export const ALL_CATEGORIES: Category[] = [
  "Buying Guides",
  "Reviews",
  "Comparisons",
  "Watch Brands",
  "Budget Picks",
  "Luxury Watches",
  "Watch Care",
];

export type PostMetadata = {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: Category;
  readTime: string;
  featured?: boolean;
  affiliateLinks?: AffiliateLink[];
  coverImage?: string;
};

export type Post = {
  slug: string;
  metadata: PostMetadata;
  mdxSource: string;
};

export type AffiliateLink = {
  watchName: string;
  affiliateUrl: string;
  buttonLabel: string;
};

type ResolvedPostEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.posts.read>>>;

export function normalizePostImagePath(path: string | undefined, slug: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("/images/posts/")) return path;
  if (path.startsWith("/")) return path;

  const legacyContentPrefix = `src/content/posts/${slug}/content/`;
  if (path.startsWith(legacyContentPrefix)) {
    return `/images/posts/${slug}/${path.slice(legacyContentPrefix.length)}`;
  }

  return `/images/posts/${slug}/${path}`;
}

function estimateReadTime(source: string): string {
  const words = source.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

async function resolveMdxSource(content: string | (() => Promise<string>)): Promise<string> {
  return typeof content === "string" ? content : await content();
}

/**
 * Keystatic `fields.select` is usually a string at runtime, but some versions
 * or transforms may expose `{ value, label }`. Coerce to a plain string for comparisons.
 */
export function categoryFromKeystatic(raw: unknown): string {
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object") {
    if ("value" in raw && typeof (raw as { value: unknown }).value === "string") {
      return (raw as { value: string }).value;
    }
    if ("label" in raw && typeof (raw as { label: unknown }).label === "string") {
      return (raw as { label: string }).label;
    }
  }
  return String(raw ?? "");
}

/** Strip BOM/invisible chars and normalize spacing so URL + frontmatter always compare equal. */
export function normalizeCategoryLabel(input: string): string {
  return input
    .replace(/^\uFEFF/, "")
    .normalize("NFKC")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

/** Map a stored or query string to the canonical Category option (case/spacing/unicode-safe). */
export function resolveCanonicalCategory(input: string): Category | undefined {
  const n = normalizeCategoryLabel(input);
  for (const c of ALL_CATEGORIES) {
    if (normalizeCategoryLabel(c) === n) return c;
  }
  return undefined;
}

/** Compares Keystatic-stored category text against the selected filter (canonical). */
export function matchesCategory(postCategory: string, selected: Category): boolean {
  const a = resolveCanonicalCategory(postCategory);
  const b = resolveCanonicalCategory(selected);
  if (a !== undefined && b !== undefined) return a === b;
  return normalizeCategoryLabel(postCategory) === normalizeCategoryLabel(selected);
}

async function toPost(slug: string, entry: ResolvedPostEntry): Promise<Post> {
  const rawDate = entry.date as string | Date;
  const publishedAt =
    typeof rawDate === "string" ? rawDate.slice(0, 10) : rawDate.toISOString().slice(0, 10);
  const rawTitle = entry.title as unknown as string | { name: string; slug: string };
  const title = typeof rawTitle === "string" ? rawTitle : rawTitle.name;
  const mdxSource = await resolveMdxSource(entry.content);
  const rawCategory = categoryFromKeystatic(entry.category as unknown);
  const category = resolveCanonicalCategory(rawCategory) ?? (rawCategory as Category);

  return {
    slug,
    metadata: {
      title,
      description: entry.description,
      publishedAt,
      author: "WatchDecode",
      category,
      readTime: estimateReadTime(mdxSource),
      featured: entry.featured,
      affiliateLinks: (entry.affiliateLinks as AffiliateLink[] | undefined) ?? [],
      coverImage: entry.coverImage as string | undefined,
    },
    mdxSource,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const postsDir = path.join(repoRoot, "src", "content", "posts");
  try {
    const slugs = await reader.collections.posts.list();
    const entries = await Promise.all(
      slugs.map(async (slug) => {
        try {
          const entry = await reader.collections.posts.read(slug, { resolveLinkedFiles: true });
          if (!entry) return null;
          return await toPost(slug, entry);
        } catch (err) {
          console.error(`[watchdecode:posts] Failed to read post slug=${JSON.stringify(slug)}`, err);
          return null;
        }
      }),
    );
    const posts = entries
      .filter((post): post is Post => post !== null)
      .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime());

    console.info(
      `[watchdecode:posts] Keystatic list: ${slugs.length} slug(s), resolved: ${posts.length} post(s); repoRoot=${repoRoot}`,
    );
    if (slugs.length === 0) {
      console.warn(
        `[watchdecode:posts] No post slugs from Keystatic. postsDir exists=${existsSync(postsDir)} path=${postsDir}`,
      );
    } else if (posts.length === 0) {
      console.warn(
        `[watchdecode:posts] ${slugs.length} slug(s) listed but 0 posts resolved (read/parse failures).`,
      );
    }

    return posts;
  } catch (err) {
    console.error(
      `[watchdecode:posts] getAllPosts failed repoRoot=${repoRoot} postsDir exists=${existsSync(postsDir)}`,
      err,
    );
    throw err;
  }
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((post) => post.metadata.featured);
}

export async function getCategories() {
  const counts = new Map<Category, number>(ALL_CATEGORIES.map((c) => [c, 0]));
  for (const post of await getAllPosts()) {
    const current = counts.get(post.metadata.category) ?? 0;
    counts.set(post.metadata.category, current + 1);
  }
  return ALL_CATEGORIES.map((name) => ({
    name,
    count: counts.get(name) ?? 0,
  }));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const entry = await reader.collections.posts.read(slug, { resolveLinkedFiles: true });
  if (!entry) return null;
  return await toPost(slug, entry);
}

export function isValidCategory(value: string): value is Category {
  return resolveCanonicalCategory(value) !== undefined;
}

/** Decode query-string category values (+ for space, %20, etc.) and validate against Keystatic options. */
function decodeQueryParam(raw: string): string {
  try {
    return decodeURIComponent(raw.replace(/\+/g, " ")).trim();
  } catch {
    return raw.trim();
  }
}

/**
 * Resolves Next.js App Router searchParams (string or string[]) to a single Category.
 * Use this for `?category=` so filtering matches Keystatic frontmatter exactly.
 */
export function parseCategoryQueryParam(
  value: string | string[] | undefined,
): Category | undefined {
  if (value === undefined) return undefined;
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first !== "string" || first.length === 0) return undefined;
  const decoded = decodeQueryParam(first);
  return resolveCanonicalCategory(decoded);
}

export function parseFeaturedQueryParam(value: string | string[] | undefined): boolean {
  if (value === undefined) return false;
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first !== "string") return false;
  const v = first.toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}
