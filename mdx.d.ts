declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType;
  export const metadata: {
    title: string;
    description: string;
    publishedAt: string;
    author: string;
    category:
      | "Buying Guides"
      | "Reviews"
      | "Comparisons"
      | "Watch Brands"
      | "Budget Picks"
      | "Luxury Watches"
      | "Watch Care";
    readTime: string;
    featured?: boolean;
  };

  export default MDXComponent;
}
