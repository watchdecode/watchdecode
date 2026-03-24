import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h1: (props) => (
    <h1
      className="mt-10 text-3xl font-semibold tracking-tight text-zinc-100 first:mt-0"
      {...props}
    />
  ),
  h2: (props) => (
    <h2 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-100" {...props} />
  ),
  h3: (props) => <h3 className="mt-6 text-xl font-semibold text-zinc-200" {...props} />,
  p: (props) => <p className="mt-4 leading-8 text-zinc-300" {...props} />,
  ul: (props) => <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-300" {...props} />,
  ol: (props) => <ol className="mt-4 list-decimal space-y-2 pl-5 text-zinc-300" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  a: (props) => (
    <a className="text-amber-300 underline decoration-zinc-600 underline-offset-4" {...props} />
  ),
  blockquote: (props) => (
    <blockquote className="mt-6 border-l-2 border-zinc-700 pl-4 italic text-zinc-400" {...props} />
  ),
  code: (props) => (
    <code className="rounded-md bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-100" {...props} />
  ),
  hr: (props) => <hr className="my-10 border-zinc-800" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
