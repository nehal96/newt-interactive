// Scaffold a piece: prose, meta and figures in one folder.
//   node scripts/new-piece.mjs block my-slug "Title" "Subtitle"

import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const [kind, slug, title, subtitle] = process.argv.slice(2);

const DIR = { essay: "essays", series: "series", block: "blocks", note: "notes" };
const MOTIFS = ["network", "network-layered", "circuit", "generations", "distributions", "helix", "bars", "wireframe"];

if (!DIR[kind] || !slug) {
  console.error("usage: node scripts/new-piece.mjs <essay|series|block|note> <slug> [title] [subtitle]");
  process.exit(1);
}

const root = join("pages", DIR[kind], slug);
if (existsSync(root)) {
  console.error(`${root} already exists.`);
  process.exit(1);
}

const Title = title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const Sub = subtitle ?? "One line on what this piece shows.";
const href = `/${DIR[kind]}/${slug}`;
const today = new Date().toISOString().slice(0, 10);

mkdirSync(join(root, "figures"), { recursive: true });

writeFileSync(
  join(root, "meta.ts"),
  `import { definePiece } from "@lib/piece";

export default definePiece({
  href: "${href}",
  kind: "${kind}",
  title: "${Title}",
  subtitle: "${Sub}",
  description: "TODO — the sentence search results show.",
  keywords: "TODO, comma, separated",
  published: "${today}",
  art: "${MOTIFS[0]}",
});
`
);

writeFileSync(
  join(root, "figures", "index.ts"),
  `// The piece's public figure surface. Prose imports only from here.
export {};
`
);

writeFileSync(
  join(root, "index.page.mdx"),
  `import { MdxLayout, PostArticleSubscribe } from "@ui/article";
import { ArticleSection } from "@ui/layout";
import meta from "./meta";

export const metadata = meta;

Opening paragraph.

<PostArticleSubscribe />

export default function MDXPage({ children }) {
  return <MdxLayout metadata={metadata}>{children}</MdxLayout>;
}
`
);

console.log(`created ${root}/`);
console.log(`  index.page.mdx  meta.ts  figures/index.ts\n`);
console.log(`Next: add the row to lib/content.ts —`);
console.log(`  import ${slug.replace(/-(\w)/g, (_, c) => c.toUpperCase())} from "../${root}/meta";`);
console.log(`and pick a motif from lib/motifs.ts (${MOTIFS.join(", ")}),`);
console.log(`then run: node scripts/og-cards.mjs && npm run check`);
