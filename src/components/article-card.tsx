import Link from "next/link";

import type { Post } from "@/src/lib/posts";

type ArticleCardProps = {
  post: Post;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 transition hover:border-zinc-700">
      <p className="text-xs uppercase tracking-wide text-zinc-400">{post.metadata.category}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-100">
        <Link href={`/blog/${post.slug}`} className="hover:text-amber-300">
          {post.metadata.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-zinc-300">{post.metadata.description}</p>
      <p className="mt-5 text-xs text-zinc-500">
        {new Date(post.metadata.publishedAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}{" "}
        · {post.metadata.readTime}
      </p>
    </article>
  );
}
