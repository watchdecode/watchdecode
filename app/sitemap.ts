import type { MetadataRoute } from "next";

import { getAllPosts } from "@/src/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://watchdecode.com";
  const staticRoutes = ["", "/blog", "/about", "/contact", "/privacy-policy"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
  const posts = await getAllPosts();
  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt),
  }));

  return [...staticRoutes, ...postRoutes];
}
