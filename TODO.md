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

## Wire up the Next.js agent tooling

The loop this repo most lacks is runtime verification: the two failure modes `CLAUDE.md` warns about — Turbopack silently breaking `ssr:false`, and autoprefixer dropping `-webkit-backdrop-filter` — both produce a clean build and a green terminal, so nothing signals that anything is wrong until someone looks at the page. Vercel's `agent-browser` CLI closes it. Version 0.27 added React DevTools introspection on top of DOM, console and network access, so an agent can reload a route and confirm a `Lazy3DFigure` actually mounted a canvas instead of trusting the build; the `next-dev-loop` skill (`npx skills add vercel/next.js --skill next-dev-loop`) drives that loop end to end. Both work regardless of router or Next version, and `agent-browser` is at 0.33 already.

Add `next-devtools-mcp` to a `.mcp.json` at the same time — the DevTools MCP server shipped in Next 16, so it works on 16.2 today and gives the framework's own view of routes, server logs and compilation issues. The two tools worth waiting for, `get_compilation_issues` and `compile_route`, answer "does this compile" from the running dev server rather than a full `next build`, and they landed in 16.3 — which is still canary (`16.3.0-canary.97`) as of 2026-07-28, with 16.2.12 the stable release. Revisit when 16.3 ships. `npx @next/codemod@canary agents-md` writes the pointer that keeps an agent reading version-matched docs from `node_modules/next/dist/docs/` instead of its training data; on 16.3 `next dev` maintains that block itself.

Files: [package.json](package.json), [CLAUDE.md](CLAUDE.md)

## Replace Victory — it is what keeps lodash in the tree

`victory-core` depends on `lodash`, so taking the direct dependency out of `package.json` changed nothing about what ships: the 272 kB chart chunk still carries both, and it loads on seven routes (`c1-ffl`, `circuit-evolution`, `kalman-filters`, and four systems-biology parts). Victory is the heaviest thing on the site outside the 3D stack, and the precedent for leaving it exists twice already — cooperativity's charts are hand-rolled SVG, and `interactives/systems-biology/chart.tsx` is a shared axis/scale layer. Nine figure files import it. Better done per figure than as one migration: the systems-biology graphs and the Kalman gaussians want quite different primitives, and every figure that lands takes a slice off all seven routes.

Files: [interactives/systems-biology/chart.tsx](interactives/systems-biology/chart.tsx), [interactives/essays/hemoglobin/cooperativity/chart.tsx](interactives/essays/hemoglobin/cooperativity/chart.tsx), [pages/blocks/c1-ffl/figures/Simulator.tsx](pages/blocks/c1-ffl/figures/Simulator.tsx)

## Retire TippyTooltip for the Radix tooltip already in `_app`

`tippy.js` has been frozen since 2021 — Floating UI is its successor — and `@tippyjs/react` only ever wrapped it. Meanwhile `ui/controls/Tooltip` is Radix and `_app` mounts its `TooltipProvider` on every route, so the site ships two tooltip engines and uses the older one in prose. Six files reach for `TippyTooltip`, four of them MDX. The work isn't the rename: Tippy takes arbitrary children and positions itself, Radix wants an explicit trigger/content pair, so each prose call site needs reading. `tippy.js` is also imported directly for its CSS while undeclared — it resolves only because `@tippyjs/react` depends on it, and that import goes away with the rest.

Files: [ui/controls/TippyTooltip/index.tsx](ui/controls/TippyTooltip/index.tsx), [ui/controls/Tooltip/index.tsx](ui/controls/Tooltip/index.tsx), [pages/\_app.page.js](pages/_app.page.js)

## The React 19 upgrade, and the bumps that don't need it

`@react-three/fiber` 9 peers on `react: >=19 <19.3` and `drei` 10 on `^19`, so React 18 → 19, fiber 8 → 9, drei 9 → 10 and `three` 0.170 → 0.185 are one coupled change rather than four. Verify it by loading the pages, not by reading the build — this is the `ssr:false` blast radius `CLAUDE.md` describes, where a broken lazy 3D figure still compiles clean.

Three bumps are independent of it and can land whenever: `react-icons` 4 → 5 (its peer is `react: *`), `zustand` 4 → 5 (one store), `@vercel/analytics` 1 → 2.

Two must not move alone: `tailwind-merge` 3 targets Tailwind CSS v4, so it pairs with `tailwindcss` 3 → 4 or stays where it is. That upgrade also lands on the browserslist floor, so read that part of `CLAUDE.md` before starting.

`@codesandbox/sandpack-react` is the other heavy one — chunks mentioning it account for 492 kB of the 1.8 MB `threejs-journey` route. That isn't a version problem but a question of whether a live editor earns its weight in two notes.

Files: [package.json](package.json), [interactives/essays/hemoglobin/Lazy3DFigure.tsx](interactives/essays/hemoglobin/Lazy3DFigure.tsx), [pages/blocks/c1-ffl/figures/store/store.ts](pages/blocks/c1-ffl/figures/store/store.ts)

## Post-publish: share the project's work-in-progress material

After the hemoglobin essay ships, share the work-in-progress material for the whole project from my notebook.
