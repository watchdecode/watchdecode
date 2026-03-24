import type { ComponentType } from "react";

import BeginnerMechanicalGuide, {
  metadata as beginnerMechanicalGuideMetadata,
} from "@/src/content/posts/beginner-mechanical-watch-buying-guide.mdx";
import Seiko5Review, { metadata as seiko5ReviewMetadata } from "@/src/content/posts/seiko-5-sports-review.mdx";

export type Category = "Buying Guides" | "Reviews";

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
  Component: ComponentType;
};

const posts: Post[] = [
  {
    slug: "beginner-mechanical-watch-buying-guide",
    metadata: beginnerMechanicalGuideMetadata,
    Component: BeginnerMechanicalGuide,
  },
  {
    slug: "seiko-5-sports-review",
    metadata: seiko5ReviewMetadata,
    Component: Seiko5Review,
  },
];

export function getAllPosts() {
  return [...posts].sort(
    (a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
  );
}

export function getFeaturedPosts() {
  return getAllPosts().filter((post) => post.metadata.featured);
}

export function getCategories() {
  const counts = new Map<Category, number>();
  for (const post of getAllPosts()) {
    const current = counts.get(post.metadata.category) ?? 0;
    counts.set(post.metadata.category, current + 1);
  }
  return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

export function isValidCategory(value: string): value is Category {
  return value === "Buying Guides" || value === "Reviews";
}
