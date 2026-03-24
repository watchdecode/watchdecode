import Link from "next/link";

import { ArticleCard } from "@/src/components/article-card";
import { getCategories, getFeaturedPosts } from "@/src/lib/posts";

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();
  const categories = await getCategories();

  return (
    <div className="pb-16">
      <section className="container-shell pt-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-zinc-400">WatchDecode</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-100 sm:text-6xl">
            Decoding watches for everyday buyers.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Honest reviews and practical buying guides to help you choose the right watch without hype, jargon, or
            regret.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/blog"
              className="rounded-full bg-zinc-100 px-5 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-300"
            >
              Explore Articles
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-zinc-700 px-5 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500"
            >
              About WatchDecode
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell mt-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="section-title">Featured Articles</h2>
          <Link href="/blog" className="text-sm text-zinc-300 hover:text-zinc-100">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredPosts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="container-shell mt-20">
        <h2 className="section-title">Categories</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {categories.map((category) => (
            <div key={category.name} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
              <p className="text-base font-medium text-zinc-100">{category.name}</p>
              <p className="mt-1 text-sm text-zinc-400">{category.count} articles</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
