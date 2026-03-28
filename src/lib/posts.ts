import { createReader } from "@keystatic/core/reader";

import keystaticConfig from "../../keystatic.config";

const reader = createReader(process.cwd(), keystaticConfig);

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

async function toPost(slug: string, entry: ResolvedPostEntry): Promise<Post> {
  const rawDate = entry.date as string | Date;
  const publishedAt =
    typeof rawDate === "string" ? rawDate.slice(0, 10) : rawDate.toISOString().slice(0, 10);
  const rawTitle = entry.title as unknown as string | { name: string; slug: string };
  const title = typeof rawTitle === "string" ? rawTitle : rawTitle.name;
  const mdxSource = await resolveMdxSource(entry.content);

  return {
    slug,
    metadata: {
      title,
      description: entry.description,
      publishedAt,
      author: "WatchDecode",
      category: entry.category as Category,
      readTime: estimateReadTime(mdxSource),
      featured: entry.featured,
      affiliateLinks: (entry.affiliateLinks as AffiliateLink[] | undefined) ?? [],
      coverImage: entry.coverImage as string | undefined,
    },
    mdxSource,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  const slugs = await reader.collections.posts.list();
  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const entry = await reader.collections.posts.read(slug, { resolveLinkedFiles: true });
      if (!entry) return null;
      return await toPost(slug, entry);
    }),
  );
  return entries
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime());
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
  return (
    value === "Buying Guides" ||
    value === "Reviews" ||
    value === "Comparisons" ||
    value === "Watch Brands" ||
    value === "Budget Picks" ||
    value === "Luxury Watches" ||
    value === "Watch Care"
  );
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
  return isValidCategory(decoded) ? decoded : undefined;
}

export function parseFeaturedQueryParam(value: string | string[] | undefined): boolean {
  if (value === undefined) return false;
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first !== "string") return false;
  const v = first.toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}
