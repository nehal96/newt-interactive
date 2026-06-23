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

## Make the hemoglobin parts manifest downloadable, and try a 3D LEGO style

The parts manifest (the components list opening the anatomy section) should be exportable as a downloadable file — a single image users can save, in the spirit of a LEGO instruction sheet. Separately, explore a 3D LEGO-style rendering of the parts (the angled, softly-lit gaussian-surface look) as an alternative to the current flat 2D ball-and-stick figures.

Files: [interactives/essays/hemoglobin/anatomy/PartsManifest.tsx](interactives/essays/hemoglobin/anatomy/PartsManifest.tsx), [interactives/essays/hemoglobin/anatomy/PartFigures.tsx](interactives/essays/hemoglobin/anatomy/PartFigures.tsx)

## Trim the Mol\* plugin spec for the anatomy viewers

Each anatomy beat boots a Mol\* plugin from `DefaultPluginUISpec()`, which registers global structure-analysis providers (accessible surface area, etc.). With several viewers on the page this floods the console with harmless `Symbol '…accessible-surface-area…' already added` warnings and adds avoidable work to every boot. The anatomy structures are tiny and static, so build a lean spec that drops the analysis/validation behaviours and animation/measurement managers we don't use — quieter console, faster boots. Verify the "villin look" (occlusion + outline + the iron emphasis) still renders identically. Related future lever once the full essay has many viewers: an LRU that `dispose()`s the least-recently-seen viewer past a context-count threshold (the lazy-mount + pause-offscreen plumbing in [use-in-viewport.ts](hooks/use-in-viewport.ts) is already shaped for it).

Files: [interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx](interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx), [interactives/essays/hemoglobin/boot-queue.ts](interactives/essays/hemoglobin/boot-queue.ts)

## Post-publish: share the project's work-in-progress material

After the hemoglobin essay ships, share the work-in-progress material for the whole project from my notebook.
