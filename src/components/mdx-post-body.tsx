import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

import { articleMdxComponents } from "@/mdx-components";

type MdxPostBodyProps = {
  source: string;
};

export function MdxPostBody({ source }: MdxPostBodyProps) {
  return (
    <MDXRemote
      source={source}
      components={articleMdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  );
}
