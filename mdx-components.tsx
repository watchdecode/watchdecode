import type { MDXComponents } from "mdx/types";

import type { ReactNode } from "react";

import { slugify } from "@/src/lib/slug";

function getTextFromNode(node: unknown): string {
  if (node === null || node === undefined) return "";
  if (typeof node === "string" || typeof node === "number") return String(node);

  if (Array.isArray(node)) {
    return node.map(getTextFromNode).join("");
  }

  if (typeof node === "object" && node !== null && "props" in node) {
    const props = (node as { props?: { children?: unknown } }).props;
    return getTextFromNode(props?.children);
  }

  return "";
}

function headingId(children: ReactNode): string | undefined {
  const text = getTextFromNode(children);
  const id = slugify(text);
  return id ? id : undefined;
}

export const articleMdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      id={headingId(props.children)}
      className="mt-10 text-3xl font-semibold tracking-tight text-zinc-900 first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      id={headingId(props.children)}
      className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 id={headingId(props.children)} className="mt-6 text-xl font-semibold text-zinc-800" {...props} />
  ),
  p: (props) => <p className="mt-4 leading-8 text-zinc-700" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-700" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  a: (props) => (
    <a
      className="text-amber-700 underline decoration-zinc-300 underline-offset-4"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-2 border-zinc-300 pl-4 italic text-zinc-600" {...props} />
  ),
  code: (props) => (
    <code className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-sm text-zinc-900" {...props} />
  ),
  hr: (props) => <hr className="my-10 border-zinc-200" {...props} />,
  table: (props) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-zinc-200">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm text-zinc-700" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-zinc-100 text-zinc-800" {...props} />,
  tbody: (props) => <tbody className="divide-y divide-zinc-200" {...props} />,
  tr: (props) => <tr {...props} />,
  th: (props) => (
    <th
      className="border-b border-zinc-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
      {...props}
    />
  ),
  td: (props) => <td className="px-4 py-3 align-top text-zinc-700" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return articleMdxComponents;
}
