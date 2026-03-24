declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType;
  export const metadata: {
    title: string;
    description: string;
    publishedAt: string;
    author: string;
    category: "Buying Guides" | "Reviews";
    readTime: string;
    featured?: boolean;
  };

  export default MDXComponent;
}
