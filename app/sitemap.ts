import type { MetadataRoute } from "next";

import { getAllPosts } from "@/src/lib/posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://watchdecode.com";
  const staticRoutes = ["", "/blog", "/about", "/contact", "/privacy-policy"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
  const postRoutes = getAllPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.metadata.publishedAt),
  }));

  return [...staticRoutes, ...postRoutes];
}
