# TODO

## Lift title and subtitle out of MDX into `metadata`

Today, each article duplicates its header content:

- `metadata.title` (in MDX) → drives `<title>` tag, og/twitter meta tags
- `# Heading` (in MDX body) → drives the visible `<h1>` (mapped to `<Title>`)
- `## Subheading` (in MDX body) → drives the visible `<h2>` (mapped to `<Lede>`)

There is no `metadata.subtitle`. The two h1 sources happen to roughly match but are not linked, and several articles have a duplicated `" / Newt Interactive"` suffix in `metadata.title` that gets double-appended in `MdxLayout`.

### Why lift it

- Single source of truth for visible h1 vs SEO `<title>`.
- Lets `MdxLayout` render the entire header (title, subtitle, dates) itself, removing the need for `ArticleDatesContext`.
- `Lede` goes back to being a dumb component; the context file can be deleted.

### Refactor steps

1. Normalize each `metadata.title` to drop the ` / Newt Interactive` suffix (the layout already appends it).
2. Add a new `metadata.subtitle` field to every article.
3. Delete the `# ...` and `## ...` lines from every MDX body.
4. In `components/MdxLayout/index.tsx`, render the header explicitly:
   ```tsx
   <ArticleContainer>
     {metadata.series && <SeriesTitleLink ... />}
     <Title>{metadata.title}</Title>
     <Lede>{metadata.subtitle}</Lede>
     {metadata.published && (
       <ArticleDates published={metadata.published} updated={metadata.updated} />
     )}
     {children}
   </ArticleContainer>
   ```
5. Update `pages/blocks/dna/index.tsx` (the only non-MDX article) to match the new pattern.
6. Drop `h1`/`h2` mappings from `mdx-components.tsx` (or keep them in case body content ever uses them).
7. Delete `components/ArticleDates/context.tsx` and the `useContext` in `Lede`.

### Files affected

- `components/MdxLayout/index.tsx`
- `components/Lede/index.tsx`
- `components/ArticleDates/context.tsx` (delete)
- `mdx-components.tsx`
- `pages/blocks/dna/index.tsx`
- All 11 `.mdx` article files under `pages/blocks/` and `pages/series/` and `pages/notes/`
