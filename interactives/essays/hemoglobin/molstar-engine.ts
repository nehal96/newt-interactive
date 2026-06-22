import { useEffect, useRef, useState, type DependencyList } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import type { StateObjectSelector } from "molstar/lib/mol-state";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import { acquireBootSlot } from "./anatomy/boot-queue";
import { VIEWPORT_CHROME_OFF, AXES_GIZMO, onWith } from "./molstar-chrome";
// Precompiled stylesheet (light skin baked in) — no `sass` toolchain needed.
// Loaded here so the (client-only) viewers don't each re-import it.
import "molstar/build/viewer/molstar.css";

// The shared Mol* engine for the hemoglobin viewers. Every viewer used to carry
// its own copy of this boot/look/teardown machinery; it now lives here once so
// the villin look, the StrictMode-safe boot, the canvas-corner fix, and the
// off-screen idling stay identical across all of them. Only molstar imports this
// module, and the viewers that import it are themselves client-only (ssr:false
// dynamic imports), so molstar never crosses the SSR boundary.

// --- MolScript selections --------------------------------------------------

/** Every atom of one element symbol (e.g. "Fe" → the heme irons). */
export function elementExpr(symbol: string) {
  return MS.struct.generator.atomGroups({
    "atom-test": MS.core.rel.eq([MS.acp("elementSymbol"), MS.es(symbol)]),
  });
}

/** Every iron atom — the heme Fe, the star of the story. */
export const IRON_EXPR = elementExpr("Fe");

// --- The "villin look" -----------------------------------------------------

type VillinLookOpts = {
  /** Canvas background; defaults to white. */
  background?: number;
  /** Camera fog intensity; off unless set (the scene viewer uses it on zoom). */
  fog?: number;
};

// The look borrowed from molstar.org's villin-md snapshot: ambient occlusion +
// black outlines over a near-white background, soft lighting. Applied once after
// boot, independent of the representation shown.
export function applyVillinLook(plugin: PluginUIContext, opts: VillinLookOpts = {}) {
  const props: Record<string, unknown> = {
    renderer: {
      backgroundColor: opts.background ?? 0xffffff,
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
    // Keep the orientation axes gizmo, bottom-left (the only chrome).
    camera: { helper: { axes: AXES_GIZMO } },
  };
  if (opts.fog != null) props.cameraFog = { name: "on", params: { intensity: opts.fog } };
  plugin.canvas3d?.setProps(props as any);
}

// --- Render-loop idling ----------------------------------------------------

// Idle or wake a plugin's render loop. `pause(true)` cancels the rAF loop;
// `animate()` restarts it (note `resume()` does NOT — it nulls its own callback
// on pause), and `requestDraw()` forces an immediate frame of the static scene.
export function setRenderActive(plugin: PluginUIContext | null, isActive: boolean) {
  const canvas = plugin?.canvas3d;
  if (!canvas) return;
  if (isActive) {
    canvas.animate();
    canvas.requestDraw();
  } else {
    canvas.pause(true);
  }
}

// --- Boot / load / canvas chrome -------------------------------------------

// A fresh child node to boot into. React 18 StrictMode re-runs mount effects
// (mount → unmount → mount) while the async boot is in flight; a dedicated node
// ensures createPluginUI's createRoot is never called twice on the same element.
function createHostNode(parent: HTMLElement): HTMLDivElement {
  const host = document.createElement("div");
  host.style.position = "absolute";
  host.style.inset = "0";
  parent.appendChild(host);
  return host;
}

// Spin up a Mol* plugin with the shared figure-like spec (no panels, no
// viewport-button chrome — see molstar-chrome).
async function bootPlugin(host: HTMLDivElement): Promise<PluginUIContext> {
  return createPluginUI({
    target: host,
    render: renderReact18,
    spec: {
      ...DefaultPluginUISpec(),
      layout: { initial: { isExpanded: false, showControls: false } },
      components: { remoteState: "none" },
      config: VIEWPORT_CHROME_OFF,
    },
  });
}

/** A loaded structure plus the handles needed to scrub or restyle it. */
export type LoadedStructure = {
  trajectory: StateObjectSelector;
  model: StateObjectSelector;
  structure: StateObjectSelector;
  /** Multi-MODEL frame count (1 for a single static structure). */
  frameCount: number;
};

// Download a vendored PDB and build trajectory → model → structure. The model
// transform's `modelIndex` is what scrubs a multi-MODEL morph (see MorphPlayer).
export async function loadStructure(
  plugin: PluginUIContext,
  url: string
): Promise<LoadedStructure> {
  const data = await plugin.builders.data.download(
    { url, isBinary: false },
    { state: { isGhost: true } }
  );
  const trajectory = await plugin.builders.structure.parseTrajectory(data, "pdb");
  const frameCount = trajectory.data?.frameCount ?? 1;
  const model = await plugin.builders.structure.createModel(trajectory);
  const structure = await plugin.builders.structure.createStructure(model);
  return { trajectory, model, structure, frameCount };
}

// Mol*'s WebGL canvas is GPU-composited and slips past the wrapper's rounded
// `overflow:hidden` (its square corners show through the rounded pane).
// `border-radius` on the canvas itself DOES clip its own drawing, so mirror the
// wrapper's computed radius onto the canvas — and strip Mol*'s own 1px layout
// border, which our borderless pane otherwise reads as a stray rounded hairline.
function roundCanvasChrome(host: HTMLElement, outerEl: HTMLElement | null) {
  if (!outerEl) return;
  const radius = getComputedStyle(outerEl).borderRadius;
  host.querySelectorAll("canvas").forEach((c) => {
    (c as HTMLCanvasElement).style.borderRadius = radius;
  });
  host.querySelectorAll(".msp-layout-standard").forEach((el) => {
    (el as HTMLElement).style.border = "none";
  });
}

// --- The viewer hook -------------------------------------------------------

/**
 * Build the viewer's representations on a freshly loaded structure. This is the
 * ONLY per-viewer logic — everything around it (boot, look, canvas chrome,
 * idling, teardown) is shared. Runs once per boot; may read live props via refs
 * for viewers that don't re-boot on every prop change.
 */
export type MolstarBuild = (
  plugin: PluginUIContext,
  loaded: LoadedStructure
) => void | Promise<void>;

type UseMolstarViewerOpts = {
  /** Vendored PDB in /public (never fetch remote — RCSB is blocked). */
  url: string;
  /** Whether the viewer is on-screen; off pauses the render loop (idle). */
  active: boolean;
  background?: number;
  fog?: number;
  /** Per-viewer representation/camera setup. See MolstarBuild. */
  build: MolstarBuild;
  /** Re-boot the engine when any of these change (url + any baked-in props). */
  deps: DependencyList;
  /** Runs on teardown before dispose — e.g. stop a playback loop. */
  onTeardown?: () => void;
};

/**
 * Owns a Mol* viewer's whole lifecycle: serialized boot, the villin look, the
 * canvas-corner fix, off-screen idling, and StrictMode-safe teardown. The
 * caller supplies a `build` to add its representations and a `deps` list that
 * controls when the engine re-boots; `ready` flips true once the first frame is
 * up. Returns the two refs to wire into the wrapper/host divs.
 */
export function useMolstarViewer({
  url,
  active,
  background,
  fog,
  build,
  deps,
  onTeardown,
}: UseMolstarViewerOpts) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const activeRef = useRef(active);
  const [ready, setReady] = useState(false);

  // Read the latest build/teardown at boot time without making them re-boot.
  const buildRef = useRef(build);
  buildRef.current = build;
  const onTeardownRef = useRef(onTeardown);
  onTeardownRef.current = onTeardown;

  useEffect(() => {
    let disposed = false;
    let releaseSlot: (() => void) | null = null;
    let host: HTMLDivElement | null = null;

    async function init() {
      if (!containerRef.current) return;

      // Serialize heavy boots so a run of viewers doesn't initialize all at once.
      releaseSlot = await acquireBootSlot();
      if (disposed || !containerRef.current) return;

      host = createHostNode(containerRef.current);
      const plugin = await bootPlugin(host);
      if (disposed) {
        plugin.dispose();
        return;
      }
      pluginRef.current = plugin;
      applyVillinLook(plugin, { background, fog });

      const loaded = await loadStructure(plugin, url);
      if (disposed) {
        plugin.dispose();
        return;
      }

      await buildRef.current(plugin, loaded);
      if (disposed) {
        plugin.dispose();
        return;
      }

      roundCanvasChrome(host, outerRef.current);
      // Honor the current visibility: if we booted just off-screen, idle the
      // loop now (the static frame is already drawn) until it scrolls in.
      setRenderActive(plugin, activeRef.current);
      setReady(true);
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
      onTeardownRef.current?.();
      releaseSlot?.();
      releaseSlot = null;
      pluginRef.current?.dispose();
      pluginRef.current = null;
      host?.remove();
      host = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  // Pause/resume the render loop as the viewer scrolls out of / into view,
  // without re-running the (expensive) boot effect above.
  useEffect(() => {
    activeRef.current = active;
    setRenderActive(pluginRef.current, active);
  }, [active]);

  return { outerRef, containerRef, pluginRef, ready };
}
