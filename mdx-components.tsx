import type { MDXComponents } from "mdx/types";
import {
  OrderedList,
  Paragraph,
  UnorderedList,
  H2,
  H3,
  Quote,
} from "@ui/prose";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h3: H2,
    h4: H3,
    blockquote: ({ children }) => <Quote>{children}</Quote>,
    p: ({ children }) => <Paragraph>{children}</Paragraph>,
    a: ({ children, href }) => (
      <Link
        href={href}
        className="text-ink-800 hover:text-ink-900 underline underline-offset-1 decoration-ink-700"
      >
        {children}
      </Link>
    ),
    ol: ({ children }) => <OrderedList>{children}</OrderedList>,
    ul: ({ children, ...props }) => (
      <UnorderedList {...props}>{children}</UnorderedList>
    ),
    hr: () => <hr className="my-8 md:my-12 border-ink-200" />,
    ...components,
  };
}
