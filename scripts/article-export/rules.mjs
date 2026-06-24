// The newt-interactive component vocabulary the extractor understands. This is
// the one file to edit if the shared essay components change. Everything else in
// the toolkit is generic.

export const RULES = {
  // Where an essay's source and dev route live, given its slug.
  mdxPathFor: (slug) => `pages/essays/${slug}/index.mdx`,
  routeFor: (slug) => `/essays/${slug}`,

  // Inline components whose wrapper is dropped, keeping the inner text. `Term`
  // colors a glossary term's first mention; in prose it's just the word.
  unwrapInline: ["Term"],

  // The footnote component. A <TippyTooltip variant="footnote"
  // content={<TippyTooltipContent>BODY</TippyTooltipContent>}>ANCHOR</TippyTooltip>
  // becomes ANCHOR[^n] with BODY collected at the bottom. The self-closing form
  // (no ANCHOR) attaches the marker to the preceding text.
  footnote: {
    component: "TippyTooltip",
    variantAttr: "variant",
    variantValue: "footnote",
    contentComponent: "TippyTooltipContent",
  },

  // Non-footnote tooltips just collapse to their anchor text.
  unwrapInlineTooltip: "TippyTooltip",

  // Heading components → markdown headings.
  headings: { H1: "#", H2: "##", H3: "###", H4: "####" },

  // Block components removed entirely (CTAs, layout, subscribe forms).
  dropBlock: ["PostArticleSubscribe", "PostArticleCTA"],

  // Everything else that appears as a block-level capitalized JSX element is
  // treated as a FIGURE → image placeholder. (After inline/heading/drop
  // handling, the only block components left in a newt essay are the figures.)

  // Plain HTML entities to normalize for a clean text doc.
  entities: {
    "&mdash;": "—",
    "&ndash;": "–",
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&nbsp;": " ",
    "&hellip;": "…",
  },

  // Map <sub>0-9</sub> to Unicode subscripts so plain text survives a paste.
  subscriptDigits: true,

  // A prop whose value names the figure (for the file slug), tried in order.
  figureNameProps: ["beat", "variant", "id", "name", "kind"],
};

// Unicode subscript digits, for P<sub>50</sub> → P₅₀.
export const SUBSCRIPTS = { 0: "₀", 1: "₁", 2: "₂", 3: "₃", 4: "₄", 5: "₅", 6: "₆", 7: "₇", 8: "₈", 9: "₉" };
