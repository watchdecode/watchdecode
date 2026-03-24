import { getAllPosts } from "@/src/lib/posts";

export async function GET() {
  const baseUrl = "https://watchdecode.com";
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = `${baseUrl}/blog/${post.slug}`;
      return `
  <item>
    <title><![CDATA[${post.metadata.title}]]></title>
    <description><![CDATA[${post.metadata.description}]]></description>
    <link>${url}</link>
    <guid>${url}</guid>
    <pubDate>${new Date(post.metadata.publishedAt).toUTCString()}</pubDate>
    <category>${post.metadata.category}</category>
    <author>hello@watchdecode.com (${post.metadata.author})</author>
  </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>WatchDecode</title>
  <description>Decoding watches for everyday buyers.</description>
  <link>${baseUrl}</link>
  <language>en-us</language>
  ${items}
</channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
