import type { Metadata } from "next";
import Link from "next/link";

import { ArticleCard } from "@/src/components/article-card";
import { getAllPosts, getCategories, isValidCategory } from "@/src/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Read practical watch reviews and buying guides from WatchDecode.",
  alternates: {
    canonical: "/blog",
  },
};

type BlogPageProps = {
  searchParams: Promise<{
    category?: string;
    page?: string;
  }>;
};

const PAGE_SIZE = 6;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const selectedCategory =
    params.category && isValidCategory(params.category) ? params.category : undefined;
  const currentPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const posts = await getAllPosts();
  const categories = await getCategories();
  const filteredPosts = selectedCategory
    ? posts.filter((post) => post.metadata.category === selectedCategory)
    : posts;

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedPosts = filteredPosts.slice(start, start + PAGE_SIZE);

  const pageHref = (page: number) => {
    const sp = new URLSearchParams();
    if (selectedCategory) sp.set("category", selectedCategory);
    if (page > 1) sp.set("page", String(page));
    const query = sp.toString();
    return query ? `/blog?${query}` : "/blog";
  };
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="container-shell py-16">
      <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Watch Articles</h1>
      <p className="mt-3 max-w-2xl text-zinc-700">
        Reviews and buying guides designed for people buying watches with real budgets and real-world use in mind.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/blog"
          className={`rounded-full border px-4 py-1.5 text-sm transition ${
            !selectedCategory
              ? "border-zinc-200 bg-zinc-100 text-zinc-900"
              : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
          }`}
        >
          All ({posts.length})
        </Link>
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/blog?category=${encodeURIComponent(category.name)}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              selectedCategory === category.name
                ? "border-zinc-200 bg-zinc-100 text-zinc-900"
                : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
            }`}
          >
            {category.name} ({category.count})
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {paginatedPosts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
      <div className="mt-10 flex items-center justify-between border-t border-zinc-200 pt-6">
        <p className="text-sm text-zinc-600">
          Page {safePage} of {totalPages}
        </p>
        <div className="flex items-center gap-3">
          <Link
            href={pageHref(Math.max(1, safePage - 1))}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              safePage === 1
                ? "pointer-events-none border-zinc-200 text-zinc-500"
                : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
            }`}
          >
            Previous
          </Link>
          <div className="flex items-center gap-2">
            {pageNumbers.map((pageNumber) => (
              <Link
                key={pageNumber}
                href={pageHref(pageNumber)}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  pageNumber === safePage
                    ? "border-zinc-200 bg-zinc-100 text-zinc-900"
                    : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
                }`}
              >
                {pageNumber}
              </Link>
            ))}
          </div>
          <Link
            href={pageHref(Math.min(totalPages, safePage + 1))}
            className={`rounded-md border px-3 py-1.5 text-sm ${
              safePage === totalPages
                ? "pointer-events-none border-zinc-200 text-zinc-500"
                : "border-zinc-200 text-zinc-700 hover:border-zinc-300"
            }`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
