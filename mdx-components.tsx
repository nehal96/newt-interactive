import type { MDXComponents } from "mdx/types";
import {
  Lede,
  OrderedList,
  Paragraph,
  Title,
  UnorderedList,
  H2,
  H3,
} from "./components";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <Title>{children}</Title>,
    h2: ({ children }) => <Lede>{children}</Lede>,
    h3: ({ children }) => <H2>{children}</H2>,
    h4: ({ children }) => <H3>{children}</H3>,
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    a: ({ children, href }) => (
      <Link
        href={href}
        className="text-slate-800 hover:text-slate-900 underline underline-offset-1 decoration-slate-700"
      >
        {children}
      </Link>
    ),
    ol: ({ children }) => <OrderedList>{children}</OrderedList>,
    ul: ({ children }) => <UnorderedList>{children}</UnorderedList>,
    ...components,
  };
}
