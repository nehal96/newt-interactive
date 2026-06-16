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

type MoleculeViewerProps = {
  /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
  url: string;
  representation?: "spacefill" | "ball-and-stick";
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
  active = true,
  className,
}: MoleculeViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  // Read inside the async boot without re-running it when visibility flips.
  const activeRef = useRef(active);

  useEffect(() => {
    let disposed = false;
    let releaseSlot: (() => void) | null = null;

    async function init() {
      if (!containerRef.current) return;

      // Serialize heavy boots so a run of beats doesn't initialize all at once.
      releaseSlot = await acquireBootSlot();
      if (disposed || !containerRef.current) return;

      const plugin = await createPluginUI({
        target: containerRef.current,
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

      if (disposed) {
        plugin.dispose();
        return;
      }
      plugin.managers.camera.reset(undefined, 0);
      // Honor the current visibility: if we booted just off-screen, idle the
      // loop now (the static frame is already drawn) until it scrolls in.
      setRenderActive(plugin, activeRef.current);
    }

    init().finally(() => {
      releaseSlot?.();
      releaseSlot = null;
    });

    return () => {
      disposed = true;
      releaseSlot?.();
      releaseSlot = null;
      pluginRef.current?.dispose();
      pluginRef.current = null;
    };
  }, [url, representation, uniformColor, sizeFactor, emphasizeIron]);

  // Pause/resume the render loop as the viewer scrolls out of / into view,
  // without re-running the (expensive) boot effect above.
  useEffect(() => {
    activeRef.current = active;
    setRenderActive(pluginRef.current, active);
  }, [active]);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
    </div>
  );
}
