# TODO

## Make the hemoglobin parts manifest downloadable, and try a 3D LEGO style

The parts manifest (the components list opening the anatomy section) should be exportable as a downloadable file — a single image users can save, in the spirit of a LEGO instruction sheet. Separately, explore a 3D LEGO-style rendering of the parts (the angled, softly-lit gaussian-surface look) as an alternative to the current flat 2D ball-and-stick figures.

Files: [interactives/essays/hemoglobin/anatomy/PartsManifest.tsx](interactives/essays/hemoglobin/anatomy/PartsManifest.tsx), [interactives/essays/hemoglobin/anatomy/PartFigures.tsx](interactives/essays/hemoglobin/anatomy/PartFigures.tsx)

## Trim the Mol\* plugin spec for the anatomy viewers

Each anatomy beat boots a Mol\* plugin from `DefaultPluginUISpec()`, which registers global structure-analysis providers (accessible surface area, etc.). With several viewers on the page this floods the console with harmless `Symbol '…accessible-surface-area…' already added` warnings and adds avoidable work to every boot. The anatomy structures are tiny and static, so build a lean spec that drops the analysis/validation behaviours and animation/measurement managers we don't use — quieter console, faster boots. Verify the "villin look" (occlusion + outline + the iron emphasis) still renders identically. Related future lever once the full essay has many viewers: an LRU that `dispose()`s the least-recently-seen viewer past a context-count threshold (the lazy-mount + pause-offscreen plumbing in [use-in-viewport.ts](hooks/use-in-viewport.ts) is already shaped for it).

Files: [interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx](interactives/essays/hemoglobin/anatomy/MoleculeViewer.tsx), [interactives/essays/hemoglobin/boot-queue.ts](interactives/essays/hemoglobin/boot-queue.ts)

## Polish the cover motifs now that they also serve as social cards

The motifs were drawn for a 160px thumb, and `scripts/og-cards.mjs` now blows the same 320×180 viewBox up to 1200×630 — 7.5× the width they were tuned at. Stroke weights, node radii and arrowhead sizes that read as hairlines in the index read heavier as a card, and the slice crop trims 6 units top and bottom that were never composed against. Worth a pass over each motif at card size: line weights, spacing, and whether the one red element still lands where the eye should go. Both sizes come from the same drawing, so any change has to hold at 160px too.

Files: [ui/site/CoverArt/index.tsx](ui/site/CoverArt/index.tsx), [pages/og-card.page.tsx](pages/og-card.page.tsx)

## Colocate the remaining pieces

`pages/blocks/c1-ffl/` is the reference shape: `index.page.mdx` for prose, `meta.ts` calling `definePiece`, `figures/index.ts` as the piece's public surface, and a row in `lib/content.ts` that imports the meta rather than restating the title. Seven pieces still live in the old `interactives/` tree — `circuit-evolution`, `erdos-renyi-graph`, `kalman-filters`, `robot-localization`, `threejs-journey`, `systems-biology` and `hemoglobin` — and `npm run check` names them on every run. Each migration is the same four moves: `git mv` the figure folder under the route, add the two index files, repoint the prose, swap the `lib/content.ts` literal for an import. `dna` is the odd one out — already colocated, but still declares `metadata` inline instead of in a `meta.ts`.

Each has its own trap. `circuit-evolution` repeats c1-ffl's: `config.ts` imports Flow nodes, so `nodeTypes` needs splitting into a `nodes.ts` before a pure `utils.ts` stops dragging React behind it. `erdos-renyi-graph` exports `useRandomGNMNetwork`, which `systems-biology/AutoregulationNetworks.tsx` reaches into — one piece importing another's figures, which the new eslint boundary rejects, so that hook needs a home in `viz/` or `hooks/` first. `kalman-filters` still imports `min`/`max` from lodash where `Math.min(...arr)` does. `threejs-journey` is the heaviest route left at 555 kB gzipped, and Sandpack in the 28-shaders and 29-shader-patterns lessons is why — worth putting behind `next/dynamic` while the files are already moving. `systems-biology` is the awkward one: five `.page.mdx` parts share a single figure folder, so the figures belong to the series (`pages/series/systems-biology/figures/`) rather than to any one part, and the series index and each part all need a `meta.ts`.

Leave hemoglobin until last. It is the largest piece and it carries the shared Mol\* infrastructure, so the real question is not where the files go but whether `molstar-engine.ts`, `molstar-chrome.ts`, `boot-queue.ts` and `Lazy3DFigure.tsx` are essay-local or belong in a `viz/molstar/` — anything a second 3D piece would reuse belongs in viz. Read [docs/hemoglobin/molstar.md](docs/hemoglobin/molstar.md) first, update `mdxPathFor` in the export rules if the path changes, and confirm the 3D actually mounts in a production build rather than only compiling — that failure is silent.

Files: [pages/blocks/c1-ffl](pages/blocks/c1-ffl), [lib/content.ts](lib/content.ts), [lib/piece.ts](lib/piece.ts), [scripts/article-export/rules.mjs](scripts/article-export/rules.mjs)

## Wire up the Next.js agent tooling

The loop this repo most lacks is runtime verification: the two failure modes `CLAUDE.md` warns about — Turbopack silently breaking `ssr:false`, and autoprefixer dropping `-webkit-backdrop-filter` — both produce a clean build and a green terminal, so nothing signals that anything is wrong until someone looks at the page. Vercel's `agent-browser` CLI closes it. Version 0.27 added React DevTools introspection on top of DOM, console and network access, so an agent can reload a route and confirm a `Lazy3DFigure` actually mounted a canvas instead of trusting the build; the `next-dev-loop` skill (`npx skills add vercel/next.js --skill next-dev-loop`) drives that loop end to end. Both work regardless of router or Next version, and `agent-browser` is at 0.33 already.

Add `next-devtools-mcp` to a `.mcp.json` at the same time — the DevTools MCP server shipped in Next 16, so it works on 16.2 today and gives the framework's own view of routes, server logs and compilation issues. The two tools worth waiting for, `get_compilation_issues` and `compile_route`, answer "does this compile" from the running dev server rather than a full `next build`, and they landed in 16.3 — which is still canary (`16.3.0-canary.97`) as of 2026-07-28, with 16.2.12 the stable release. Revisit when 16.3 ships. `npx @next/codemod@canary agents-md` writes the pointer that keeps an agent reading version-matched docs from `node_modules/next/dist/docs/` instead of its training data; on 16.3 `next dev` maintains that block itself.

Files: [package.json](package.json), [CLAUDE.md](CLAUDE.md)

## Post-publish: share the project's work-in-progress material

After the hemoglobin essay ships, share the work-in-progress material for the whole project from my notebook.
