import Link from "next/link";

import { ArticleCard } from "@/src/components/article-card";
import { getAllPosts, getCategories, getFeaturedPosts } from "@/src/lib/posts";

export default async function Home() {
  const allPosts = await getAllPosts();
  const latestPosts = allPosts.slice(0, 4);
  const featuredPosts = await getFeaturedPosts();
  const featuredDisplay = featuredPosts.slice(0, 4);
  const categories = await getCategories();

  return (
    <div className="pb-16">
      <section className="container-shell pt-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-zinc-600">WatchDecode</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
            Decoding watches for everyday buyers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-700">
            Honest reviews and practical buying guides to help you choose the right watch without hype, jargon, or
            regret.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              Explore Articles
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-zinc-200 px-5 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300"
            >
              About WatchDecode
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell mt-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="section-title">Latest Posts</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latestPosts.map((post, index) => (
            <ArticleCard key={post.slug} post={post} index={index} />
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Link
            href="/blog"
            className="rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
          >
            View All Posts
          </Link>
        </div>
      </section>

      {featuredPosts.length > 0 ? (
        <section className="container-shell mt-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="section-title">Featured Posts</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredDisplay.map((post, index) => (
              <ArticleCard key={post.slug} post={post} index={index} />
            ))}
          </div>
          {featuredPosts.length > 4 ? (
            <div className="mt-10 flex justify-center">
              <Link
                href="/blog?featured=true"
                className="rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-medium text-zinc-900 transition hover:border-zinc-300 hover:bg-zinc-50"
              >
                View All Featured
              </Link>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="container-shell mt-20">
        <h2 className="section-title">Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/blog?category=${encodeURIComponent(category.name)}`}
              className="rounded-xl border border-zinc-200 bg-zinc-100/60 p-5 transition hover:border-zinc-300 hover:bg-white"
            >
              <p className="text-base font-medium text-zinc-900">{category.name}</p>
              <p className="mt-1 text-sm text-zinc-600">{category.count} articles</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
