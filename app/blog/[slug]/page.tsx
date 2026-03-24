import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MdxPostBody } from "@/src/components/mdx-post-body";
import { getAllPosts, getPostBySlug } from "@/src/lib/posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  return {
    title: post.metadata.title,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: "article",
      url: `/blog/${post.slug}`,
      images: [
        {
          url: `/opengraph-image?title=${encodeURIComponent(post.metadata.title)}`,
          width: 1200,
          height: 630,
          alt: post.metadata.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metadata.title,
      description: post.metadata.description,
      images: [`/twitter-image?title=${encodeURIComponent(post.metadata.title)}`],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container-shell py-16">
      <header className="mx-auto max-w-3xl border-b border-zinc-800 pb-8">
        <p className="text-xs uppercase tracking-wider text-zinc-400">{post.metadata.category}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-100">{post.metadata.title}</h1>
        <p className="mt-4 text-zinc-300">{post.metadata.description}</p>
        <p className="mt-6 text-sm text-zinc-500">
          {new Date(post.metadata.publishedAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {post.metadata.readTime} · By {post.metadata.author}
        </p>
      </header>
      <div className="mx-auto mt-8 max-w-3xl">
        <MdxPostBody source={post.mdxSource} />
      </div>
    </article>
  );
}
