# TODO

## Make the hemoglobin parts manifest downloadable, and try a 3D LEGO style

The parts manifest (the components list opening the anatomy section) should be exportable as a downloadable file — a single image users can save, in the spirit of a LEGO instruction sheet. Separately, explore a 3D LEGO-style rendering of the parts (the angled, softly-lit gaussian-surface look) as an alternative to the current flat 2D ball-and-stick figures.

Files: [pages/essays/hemoglobin/figures/anatomy/PartsManifest.tsx](pages/essays/hemoglobin/figures/anatomy/PartsManifest.tsx), [pages/essays/hemoglobin/figures/anatomy/PartFigures.tsx](pages/essays/hemoglobin/figures/anatomy/PartFigures.tsx)

## Trim the Mol\* plugin spec for the anatomy viewers

Each anatomy beat boots a Mol\* plugin from `DefaultPluginUISpec()`, which registers global structure-analysis providers (accessible surface area, etc.). With several viewers on the page this floods the console with harmless `Symbol '…accessible-surface-area…' already added` warnings and adds avoidable work to every boot. The anatomy structures are tiny and static, so build a lean spec that drops the analysis/validation behaviours and animation/measurement managers we don't use — quieter console, faster boots. Verify the "villin look" (occlusion + outline + the iron emphasis) still renders identically. Related future lever once the full essay has many viewers: an LRU that `dispose()`s the least-recently-seen viewer past a context-count threshold (the lazy-mount + pause-offscreen plumbing in [use-in-viewport.ts](hooks/use-in-viewport.ts) is already shaped for it).

Files: [pages/essays/hemoglobin/figures/anatomy/MoleculeViewer.tsx](pages/essays/hemoglobin/figures/anatomy/MoleculeViewer.tsx), [pages/essays/hemoglobin/figures/boot-queue.ts](pages/essays/hemoglobin/figures/boot-queue.ts)

## Polish the cover motifs now that they also serve as social cards

The motifs were drawn for a 160px thumb, and `scripts/og-cards.mjs` now blows the same 320×180 viewBox up to 1200×630 — 7.5× the width they were tuned at. Stroke weights, node radii and arrowhead sizes that read as hairlines in the index read heavier as a card, and the slice crop trims 6 units top and bottom that were never composed against. Worth a pass over each motif at card size: line weights, spacing, and whether the one red element still lands where the eye should go. Both sizes come from the same drawing, so any change has to hold at 160px too.

Files: [ui/site/CoverArt/index.tsx](ui/site/CoverArt/index.tsx), [pages/og-card.page.tsx](pages/og-card.page.tsx)

## Wire up the Next.js agent tooling

The loop this repo most lacks is runtime verification: the two failure modes `CLAUDE.md` warns about — Turbopack silently breaking `ssr:false`, and autoprefixer dropping `-webkit-backdrop-filter` — both produce a clean build and a green terminal, so nothing signals that anything is wrong until someone looks at the page. Vercel's `agent-browser` CLI closes it. Version 0.27 added React DevTools introspection on top of DOM, console and network access, so an agent can reload a route and confirm a `Lazy3DFigure` actually mounted a canvas instead of trusting the build; the `next-dev-loop` skill (`npx skills add vercel/next.js --skill next-dev-loop`) drives that loop end to end. Both work regardless of router or Next version, and `agent-browser` is at 0.33 already.

Add `next-devtools-mcp` to a `.mcp.json` at the same time — the DevTools MCP server shipped in Next 16, so it works on 16.2 today and gives the framework's own view of routes, server logs and compilation issues. The two tools worth waiting for, `get_compilation_issues` and `compile_route`, answer "does this compile" from the running dev server rather than a full `next build`, and they landed in 16.3 — which is still canary (`16.3.0-canary.97`) as of 2026-07-28, with 16.2.12 the stable release. Revisit when 16.3 ships. `npx @next/codemod@canary agents-md` writes the pointer that keeps an agent reading version-matched docs from `node_modules/next/dist/docs/` instead of its training data; on 16.3 `next dev` maintains that block itself.

Files: [package.json](package.json), [CLAUDE.md](CLAUDE.md)

## Post-publish: share the project's work-in-progress material

After the hemoglobin essay ships, share the work-in-progress material for the whole project from my notebook.
