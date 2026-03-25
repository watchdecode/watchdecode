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
};

export type Post = {
  slug: string;
  metadata: PostMetadata;
  mdxSource: string;
};

type ResolvedPostEntry = NonNullable<Awaited<ReturnType<typeof reader.collections.posts.read>>>;

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
