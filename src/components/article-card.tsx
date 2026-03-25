import Link from "next/link";

import type { Post } from "@/src/lib/posts";

type ArticleCardProps = {
  post: Post;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-6 transition hover:border-zinc-300">
      <p className="text-xs uppercase tracking-wide text-zinc-600">
        <Link
          href={`/blog?category=${encodeURIComponent(post.metadata.category)}`}
          className="hover:text-zinc-900"
        >
          {post.metadata.category}
        </Link>
      </p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900">
        <Link href={`/blog/${post.slug}`} className="hover:text-amber-700">
          {post.metadata.title}
        </Link>
      </h3>
      <p className="mt-3 text-sm leading-6 text-zinc-700">{post.metadata.description}</p>
      <p className="mt-5 text-xs text-zinc-600">
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
