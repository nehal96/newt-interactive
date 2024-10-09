import type { MDXComponents } from "mdx/types";
import { Lede, Paragraph, Subheader, Title } from "./components";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <Title>{children}</Title>,
    h2: ({ children }) => <Lede>{children}</Lede>,
    h3: ({ children }) => <Subheader>{children}</Subheader>,
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    ...components,
  };
}
