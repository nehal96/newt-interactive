import { useEffect, useRef } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import { acquireBootSlot } from "./boot-queue";
// Precompiled stylesheet (light skin baked in) — no `sass` toolchain needed.
import "molstar/build/viewer/molstar.css";

// Iron's emphasis color (matches the SVG sphere + the iron beat's spacefill).
const FE_EMPHASIS_COLOR = 0xe0762e;
// MolScript: every iron atom (the heme Fe — the star of the build-up).
const IRON_EXPR = MS.struct.generator.atomGroups({
  "atom-test": MS.core.rel.eq([MS.acp("elementSymbol"), MS.es("Fe")]),
});

// MolScript: an OR over a set of author chain ids — the shared chain filter.
const chainTest = (chains: string[]) =>
  MS.core.logic.or(chains.map((c) => MS.core.rel.eq([MS.ammp("auth_asym_id"), c])));

// Atoms in `chains` — drawn as the alpha (A, C) / beta (B, D) cartoon ribbons.
const chainsExpr = (chains: string[]) =>
  MS.struct.generator.atomGroups({ "chain-test": chainTest(chains) });

// Proximal/distal His sequence numbers — alpha chains use 58 (distal) / 87
// (proximal), beta chains 63 / 92. Selecting these four across chains A–D picks
// out exactly each chain's two pocket histidines and nothing else.
const POCKET_HIS_SEQ = [58, 63, 87, 92];

// The full heme pockets of `chains` — the heme (HEM; 2HHB also holds PO4/water)
// plus the proximal & distal histidines — so the chain beats build on the
// previous beat's pockets rather than dropping the histidines.
const pocketExpr = (chains: string[]) =>
  MS.struct.generator.atomGroups({
    "chain-test": chainTest(chains),
    "residue-test": MS.core.logic.or([
      MS.core.rel.eq([MS.ammp("label_comp_id"), "HEM"]),
      MS.core.logic.and([
        MS.core.rel.eq([MS.ammp("label_comp_id"), "HIS"]),
        MS.core.logic.or(
          POCKET_HIS_SEQ.map((n) => MS.core.rel.eq([MS.ammp("auth_seq_id"), n]))
        ),
      ]),
    ]),
  });

// The heme irons of `chains` — emphasized as fat orange spheres at protein scale.
const ironInChainsExpr = (chains: string[]) =>
  MS.struct.generator.atomGroups({
    "atom-test": MS.core.rel.eq([MS.acp("elementSymbol"), MS.es("Fe")]),
    "chain-test": chainTest(chains),
  });

// A lightweight, self-contained Mol* viewer for the *anatomy* build-up: load one
// small vendored structure and show it with the shared "villin look", framed and
// static. Deliberately separate from the scene-driven MolstarViewer.tsx (which
// loads the full protein + the O₂ morph and steps through a cinematic) — each
// anatomy beat is its own block, so this stays simple and only loads what it
// needs. The villin-look helpers are duplicated here (small, ~25 lines) to keep
// this zero-risk to the working scene viewer; consolidate when we do the full
// inline refactor.

function onWith(mapped: any, overrides: Record<string, unknown>) {
  const variant = mapped.map("on");
  const defaults = PD.getDefaultValues(variant.params ?? variant);
  return { name: "on", params: { ...defaults, ...overrides } };
}

function applyVillinLook(plugin: PluginUIContext) {
  plugin.canvas3d?.setProps({
    renderer: {
      backgroundColor: 0xffffff,
      ambientIntensity: 0.4,
      interiorDarkening: 0.5,
    },
    postprocessing: {
      occlusion: onWith(PostprocessingParams.occlusion, {
        samples: 32,
        radius: 5,
        bias: 0.8,
        blurKernelSize: 15,
      }),
      outline: onWith(PostprocessingParams.outline, {
        scale: 1,
        threshold: 0.33,
        color: 0x000000,
        includeTransparent: true,
      }),
    },
  } as any);
}

type ChainGroup = { chains: string[]; color: number };

type MoleculeViewerProps = {
  /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
  url: string;
  representation?: "spacefill" | "ball-and-stick" | "cartoon";
  /** If set, color uniformly with this hex; otherwise color by element. */
  uniformColor?: number;
  sizeFactor?: number;
  /**
   * Overlay the iron atom(s) as a larger orange sphere so the Fe stays the
   * visual star — keeps a ball-and-stick ring readable while matching the
   * spacefill iron of the iron beat / the SVG diagram.
   */
  emphasizeIron?: boolean;
  /**
   * Draw only these chain groups as cartoon ribbons, one uniform color each
   * (the alpha/beta chain beats). When set, this replaces the whole-structure
   * representation: chains in no group simply aren't drawn.
   */
  chainGroups?: ChainGroup[];
  /**
   * With `chainGroups`, also draw the shown chains' full heme pockets (heme +
   * proximal/distal His + emphasized Fe), matching the previous beat.
   */
  showPockets?: boolean;
  /** Chains whose pockets to draw; defaults to the ribbon (`chainGroups`) chains. */
  pocketChains?: string[];
  /**
   * Whether the viewer is on-screen. When false the render loop is paused so an
   * off-screen viewer costs nothing; the WebGL context is kept so scrolling back
   * is instant (no re-boot). Defaults to true.
   */
  active?: boolean;
  className?: string;
};

// Idle or wake a plugin's render loop. `pause(true)` cancels the rAF loop;
// `animate()` restarts it (note `resume()` does NOT — it nulls its own callback
// on pause), and a `requestDraw()` forces an immediate frame of the static scene.
function setRenderActive(plugin: PluginUIContext | null, isActive: boolean) {
  const canvas = plugin?.canvas3d;
  if (!canvas) return;
  if (isActive) {
    canvas.animate();
    canvas.requestDraw();
  } else {
    canvas.pause(true);
  }
}

export default function MoleculeViewer({
  url,
  representation = "spacefill",
  uniformColor,
  sizeFactor,
  emphasizeIron = false,
  chainGroups,
  showPockets = false,
  pocketChains,
  active = true,
  className,
}: MoleculeViewerProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  // Read inside the async boot without re-running it when visibility flips.
  const activeRef = useRef(active);

  useEffect(() => {
    let disposed = false;
    let releaseSlot: (() => void) | null = null;
    let host: HTMLDivElement | null = null;

    async function init() {
      if (!containerRef.current) return;

      // Serialize heavy boots so a run of beats doesn't initialize all at once.
      releaseSlot = await acquireBootSlot();
      if (disposed || !containerRef.current) return;

      // Boot into a fresh child node each time. React 18 StrictMode re-runs this
      // effect (mount → unmount → mount) while the async boot is in flight; a
      // dedicated node ensures createPluginUI's createRoot is never called twice
      // on the same element.
      host = document.createElement("div");
      host.style.position = "absolute";
      host.style.inset = "0";
      containerRef.current.appendChild(host);

      const plugin = await createPluginUI({
        target: host,
        render: renderReact18,
        spec: {
          ...DefaultPluginUISpec(),
          layout: { initial: { isExpanded: false, showControls: false } },
          components: { remoteState: "none" },
        },
      });
      if (disposed) {
        plugin.dispose();
        return;
      }
      pluginRef.current = plugin;
      applyVillinLook(plugin);

      const data = await plugin.builders.data.download(
        { url, isBinary: false },
        { state: { isGhost: true } }
      );
      const trajectory = await plugin.builders.structure.parseTrajectory(
        data,
        "pdb"
      );
      const model = await plugin.builders.structure.createModel(trajectory);
      const structure = await plugin.builders.structure.createStructure(model);

      if (chainGroups && chainGroups.length > 0) {
        // Chain beats: one uniformly-colored cartoon ribbon per chain group
        // (alpha A/C red, beta B/D blue). Chains in no group aren't drawn.
        for (const group of chainGroups) {
          const comp =
            await plugin.builders.structure.tryCreateComponentFromExpression(
              structure,
              chainsExpr(group.chains),
              `chains-${group.chains.join("")}`
            );
          if (comp) {
            await plugin.builders.structure.representation.addRepresentation(
              comp,
              {
                type: "cartoon",
                color: "uniform",
                colorParams: { value: group.color },
              } as any
            );
          }
        }

        // Carry the pockets into the chain beats: each shown chain's heme +
        // proximal/distal His as element-colored ball-and-stick, its Fe
        // emphasized — the same pocket and Fe size as the previous beat, now
        // wrapped by the ribbons.
        if (showPockets) {
          // Pockets can span more chains than the ribbons (the alpha beat shows
          // all four pockets but only the alpha ribbons).
          const pocketSet =
            pocketChains ?? chainGroups.flatMap((g) => g.chains);
          const pockets =
            await plugin.builders.structure.tryCreateComponentFromExpression(
              structure,
              pocketExpr(pocketSet),
              "chain-pockets"
            );
          if (pockets) {
            await plugin.builders.structure.representation.addRepresentation(
              pockets,
              { type: "ball-and-stick", color: "element-symbol" } as any
            );
          }
          const iron =
            await plugin.builders.structure.tryCreateComponentFromExpression(
              structure,
              ironInChainsExpr(pocketSet),
              "chain-iron"
            );
          if (iron) {
            await plugin.builders.structure.representation.addRepresentation(
              iron,
              {
                type: "spacefill",
                color: "uniform",
                colorParams: { value: FE_EMPHASIS_COLOR },
                // Same Fe size as the build-up pockets (not a fat protein-scale
                // sphere) so the iron reads identically across beats.
                typeParams: { sizeFactor: 0.25 },
              } as any
            );
          }
        }
      } else {
        const props: Record<string, unknown> = {
          type: representation,
          color: uniformColor != null ? "uniform" : "element-symbol",
        };
        if (uniformColor != null) props.colorParams = { value: uniformColor };
        if (sizeFactor != null) props.typeParams = { sizeFactor };
        await plugin.builders.structure.representation.addRepresentation(
          structure,
          props as any
        );

        // Emphasize the iron: a fatter orange sphere on top of the base rep.
        if (emphasizeIron) {
          const iron =
            await plugin.builders.structure.tryCreateComponentFromExpression(
              structure,
              IRON_EXPR,
              "anatomy-iron"
            );
          if (iron) {
            // Size to ~2× the ring atoms (covalent-radius scale). Ball-and-stick
            // balls are vdW × 0.15 (C ≈ 0.255 Å); a spacefill sphere is Fe_vdW
            // (2.05) × sizeFactor, so 0.25 → ≈0.51 Å ≈ 2× the ring balls.
            await plugin.builders.structure.representation.addRepresentation(
              iron,
              {
                type: "spacefill",
                color: "uniform",
                colorParams: { value: FE_EMPHASIS_COLOR },
                typeParams: { sizeFactor: 0.25 },
              } as any
            );
          }
        }
      }

      if (disposed) {
        plugin.dispose();
        return;
      }
      plugin.managers.camera.reset(undefined, 0);
      // Mol*'s WebGL canvas is GPU-composited and slips past the wrapper's
      // rounded `overflow:hidden` (its square corners show through the rounded
      // pane). `border-radius` on the canvas itself DOES clip its own drawing,
      // so mirror the wrapper's computed radius onto the canvas.
      if (host && outerRef.current) {
        const radius = getComputedStyle(outerRef.current).borderRadius;
        host.querySelectorAll("canvas").forEach((c) => {
          c.style.borderRadius = radius;
        });
        // Strip Mol*'s own 1px layout border (.msp-layout-standard, from
        // molstar.css) — our pane is borderless, but overflow-clipping leaves
        // it reading as a stray rounded hairline.
        host.querySelectorAll(".msp-layout-standard").forEach((el) => {
          (el as HTMLElement).style.border = "none";
        });
      }
      // Honor the current visibility: if we booted just off-screen, idle the
      // loop now (the static frame is already drawn) until it scrolls in.
      setRenderActive(plugin, activeRef.current);
    }

    init()
      .catch(() => {
        // A boot torn down mid-flight (StrictMode / fast scroll) can reject as
        // its node detaches — expected, not an error worth surfacing.
      })
      .finally(() => {
        releaseSlot?.();
        releaseSlot = null;
      });

    return () => {
      disposed = true;
      releaseSlot?.();
      releaseSlot = null;
      pluginRef.current?.dispose();
      pluginRef.current = null;
      host?.remove();
      host = null;
    };
  }, [
    url,
    representation,
    uniformColor,
    sizeFactor,
    emphasizeIron,
    chainGroups,
    showPockets,
    pocketChains,
  ]);

  // Pause/resume the render loop as the viewer scrolls out of / into view,
  // without re-running the (expensive) boot effect above.
  useEffect(() => {
    activeRef.current = active;
    setRenderActive(pluginRef.current, active);
  }, [active]);

  return (
    <div
      ref={outerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // Clip Mol*'s (non-composited) viewport chrome to the rounded corners;
        // the WebGL canvas itself is rounded directly after boot (see init).
        overflow: "hidden",
      }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
