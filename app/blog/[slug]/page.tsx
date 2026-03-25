import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MdxPostBody } from "@/src/components/mdx-post-body";
import { getAllPosts, getPostBySlug } from "@/src/lib/posts";
import { extractFaqItemsFromMdx } from "@/src/lib/faq";
import { extractTocItemsFromMdx } from "@/src/lib/toc";

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

  const tocItems = extractTocItemsFromMdx(post.mdxSource);
  const faqItems = extractFaqItemsFromMdx(post.mdxSource);
  const siteUrl = "https://watchdecode.com";
  const pageUrl = `${siteUrl}/blog/${post.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    headline: post.metadata.title,
    description: post.metadata.description,
    datePublished: post.metadata.publishedAt,
    dateModified: post.metadata.publishedAt,
    author: {
      "@type": "Person",
      name: post.metadata.author,
    },
    publisher: {
      "@type": "Organization",
      name: "WatchDecode",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/opengraph-image`,
      },
    },
    image: `${siteUrl}/opengraph-image?title=${encodeURIComponent(post.metadata.title)}`,
  };

  const fallbackFaqItems = [
    {
      question: "Who is this article for?",
      answer: post.metadata.description,
    },
    {
      question: `What will I learn from "${post.metadata.title}"?`,
      answer: post.metadata.description,
    },
    {
      question: "How should I use this guide when buying a watch?",
      answer: `${post.metadata.description} It focuses on practical guidance without hype.`,
    },
  ] as const;

  const faqItemsForSchema = faqItems.length > 0 ? faqItems : fallbackFaqItems;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItemsForSchema.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <article className="container-shell py-16">
      <header className="mx-auto max-w-3xl border-b border-zinc-200 pb-8">
        <p className="text-xs uppercase tracking-wider text-zinc-600">
          <Link
            href={`/blog?category=${encodeURIComponent(post.metadata.category)}`}
            className="hover:text-zinc-900"
          >
            {post.metadata.category}
          </Link>
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900">{post.metadata.title}</h1>
        <p className="mt-4 text-zinc-700">{post.metadata.description}</p>
        <p className="mt-6 text-sm text-zinc-600">
          {new Date(post.metadata.publishedAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}{" "}
          · {post.metadata.readTime} · By {post.metadata.author}
        </p>
      </header>

      {tocItems.length > 0 && (
        <nav aria-label="Table of contents" className="mx-auto mt-8 max-w-3xl">
          <div className="rounded-lg border border-zinc-200 bg-zinc-100/60 p-4">
            <p className="text-sm font-semibold text-zinc-900">On this page</p>
            <ul className="mt-3 space-y-2">
              {tocItems.map((item) => (
                <li key={item.id} className={item.level === 3 ? "ml-4" : undefined}>
                  <a
                    href={`#${item.id}`}
                    className="text-sm text-zinc-700 hover:text-zinc-900"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}

      <div className="mx-auto mt-8 max-w-3xl">
        <MdxPostBody source={post.mdxSource} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </article>
  );
}
