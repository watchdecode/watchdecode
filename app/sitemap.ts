import type { MetadataRoute } from "next";

import { getAllPosts } from "@/src/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://watchdecode.com";
  const posts = await getAllPosts();

  const postRoutes = posts.map((post) => {
    const publishedAt = new Date(post.metadata.publishedAt);
    return {
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: Number.isNaN(publishedAt.getTime()) ? undefined : publishedAt,
    };
  });

  const latestPostModified =
    postRoutes.length > 0
      ? postRoutes.reduce<Date | undefined>((latest, route) => {
          if (!route.lastModified) return latest;
          if (!latest) return route.lastModified;
          return route.lastModified > latest ? route.lastModified : latest;
        }, undefined)
      : undefined;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: latestPostModified },
    { url: `${baseUrl}/blog`, lastModified: latestPostModified },
    { url: `${baseUrl}/about` },
    { url: `${baseUrl}/contact` },
    { url: `${baseUrl}/privacy-policy` },
  ];

  return [...staticRoutes, ...postRoutes];
}
