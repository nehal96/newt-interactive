import { useCallback, useEffect, useRef, useState } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { DefaultPluginUISpec } from "molstar/lib/mol-plugin-ui/spec";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { ParamDefinition as PD } from "molstar/lib/mol-util/param-definition";
import { PostprocessingParams } from "molstar/lib/mol-canvas3d/passes/postprocessing";
import { MolScriptBuilder as MS } from "molstar/lib/mol-script/language/builder";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import { acquireBootSlot } from "../anatomy/boot-queue";
// Precompiled stylesheet (light skin baked in) — no `sass` toolchain needed.
import "molstar/build/viewer/molstar.css";

// Generic play/scrub player for a baked multi-MODEL morph PDB. Owns all the
// reusable machinery — serialized boot, the white "villin" look, off-screen
// idling, play/pause + a draggable progress slider — and stays agnostic about
// what the morph shows. Callers pass an `emphasis` (one atom kind to render as a
// larger tracked sphere) and an `accentColor` for the slider; that's the only
// per-figure variation. See BindingMorphPlayer (the heme/Fe morph) and
// BohrFigure (the salt-bridge morph) for the two current callers.

const BAKED_FRAMES = 31; // fallback until the trajectory reports its real count
const DEFAULT_DURATION_MS = 1800; // one forward pass (tune per figure for speed)

// The single atom each morph wants the eye to track, rendered as a larger
// uniform sphere over the element-colored ball-and-stick, picked out by element
// symbol: "Fe" = the heme iron (catching); "H" = the lone synthetic proton of
// the Bohr salt bridge (releasing — the crystal heavy atoms carry no hydrogen).
export type Emphasis = { element: string; hex: number; sizeFactor: number };

// A MolScript selection of every atom of one element. Built inside this
// client-only player so molstar never leaks into the SSR/import boundary.
function elementExpr(symbol: string) {
  return MS.struct.generator.atomGroups({
    "atom-test": MS.core.rel.eq([MS.acp("elementSymbol"), MS.es(symbol)]),
  });
}

// Build the complete "on" params for a Mapped param, then layer overrides — a
// partial object would drop nested sub-params and later crash the render pass.
function onWith(mapped: any, overrides: Record<string, unknown>) {
  const variant = mapped.map("on");
  const defaults = PD.getDefaultValues(variant.params ?? variant);
  return { name: "on", params: { ...defaults, ...overrides } };
}

// The shared "villin look": ambient occlusion + black outlines over a white
// background. Applied once after boot, independent of the representation.
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

// Idle or wake the render loop. `pause(true)` cancels the rAF loop; `animate()`
// restarts it (note `resume()` does NOT), and `requestDraw()` forces one frame.
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

// Scrub the trajectory to a frame (0-based) by updating the model transform's
// modelIndex — the same thing AnimateModelIndex does under the hood.
async function setMorphFrame(
  plugin: PluginUIContext,
  modelRef: string,
  frame: number
) {
  const state = plugin.state.data;
  const update = state.build();
  update.to(modelRef).update((old: any) => {
    old.modelIndex = frame;
  });
  await PluginCommands.State.Update(plugin, {
    state,
    tree: update,
    options: { doNotLogTiming: true },
  });
}

type PlayIcon = "play" | "pause" | "restart";

function ControlIcon({ kind }: { kind: PlayIcon }) {
  const paths: Record<PlayIcon, string> = {
    play: "M8 5v14l11-7z",
    pause: "M6 5h4v14H6zM14 5h4v14h-4z",
    restart: "M12 5V2L7 7l5 5V8a6 6 0 1 1-6 6H4a8 8 0 1 0 8-9z",
  };
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={paths[kind]} />
    </svg>
  );
}

type MorphPlayerProps = {
  /** Vendored multi-model morph PDB in /public to play and scrub. */
  url: string;
  /** When false the render loop and playback are paused (off-screen). */
  active?: boolean;
  /** The atom to emphasize as a larger tracked sphere; null draws none. */
  emphasis?: Emphasis | null;
  /** Auto-detect and dash non-covalent contacts (e.g. the salt bridge). */
  showInteractions?: boolean;
  /** Slider accent (CSS color) — usually the emphasis color. */
  accentColor?: string;
  /** One forward pass duration, ms. */
  durationMs?: number;
  className?: string;
};

/**
 * A play/scrub player for one baked morph. React owns the current frame; an
 * effect pushes it into Mol* (coalesced so overlapping commits never flood the
 * engine). Play advances frames over time; the slider scrubs both ways; once it
 * reaches the end the button becomes a restart.
 */
export default function MorphPlayer({
  url,
  active = true,
  emphasis = null,
  showInteractions = false,
  accentColor = "#e0762e",
  durationMs = DEFAULT_DURATION_MS,
  className,
}: MorphPlayerProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pluginRef = useRef<PluginUIContext | null>(null);
  const modelRefRef = useRef<string | null>(null);

  const [ready, setReady] = useState(false);
  const [frame, setFrame] = useState(0);
  const [frameCount, setFrameCount] = useState(BAKED_FRAMES);
  const [isPlaying, setIsPlaying] = useState(false);

  const frameRef = useRef(0);
  const frameCountRef = useRef(BAKED_FRAMES);
  const activeRef = useRef(active);

  // Latest values for the mount effect's closure without re-booting the engine.
  const emphasisRef = useRef(emphasis);
  const showInteractionsRef = useRef(showInteractions);
  const durationRef = useRef(durationMs);
  emphasisRef.current = emphasis;
  showInteractionsRef.current = showInteractions;
  durationRef.current = durationMs;

  // Coalesced frame push: while one State.Update is in flight, later requests
  // only update the desired frame; the loop re-commits to the latest after each
  // await, so rapid scrubbing/playback converges without flooding Mol*.
  const desiredFrameRef = useRef(0);
  const applyingRef = useRef(false);
  const applyFrame = useCallback(async () => {
    const plugin = pluginRef.current;
    const modelRef = modelRefRef.current;
    if (!plugin || !modelRef || applyingRef.current) return;
    applyingRef.current = true;
    try {
      let last = -1;
      while (desiredFrameRef.current !== last) {
        last = desiredFrameRef.current;
        await setMorphFrame(plugin, modelRef, last);
      }
    } catch {
      // A commit racing a teardown can reject; harmless.
    } finally {
      applyingRef.current = false;
    }
  }, []);

  const goToFrame = useCallback(
    (n: number) => {
      const fc = frameCountRef.current;
      const clamped = Math.max(0, Math.min(fc - 1, Math.round(n)));
      frameRef.current = clamped;
      setFrame(clamped);
      desiredFrameRef.current = clamped;
      applyFrame();
    },
    [applyFrame]
  );

  // --- playback loop (refs so the rAF closure never goes stale) ---
  const rafRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const playStartRef = useRef<{ t0: number; f0: number }>({ t0: 0, f0: 0 });
  const loopRef = useRef<(now: number) => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  stopRef.current = () => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  loopRef.current = (now: number) => {
    if (!isPlayingRef.current) return;
    const fc = frameCountRef.current;
    const msPerFrame = durationRef.current / Math.max(1, fc - 1);
    const { t0, f0 } = playStartRef.current;
    const target = f0 + Math.floor((now - t0) / msPerFrame);
    if (target >= fc - 1) {
      goToFrame(fc - 1);
      stopRef.current();
      return;
    }
    if (target !== frameRef.current) goToFrame(target);
    rafRef.current = requestAnimationFrame((t) => loopRef.current(t));
  };

  const play = useCallback(() => {
    if (!ready) return;
    const fc = frameCountRef.current;
    // Replaying from the end restarts at 0.
    const from = frameRef.current >= fc - 1 ? 0 : frameRef.current;
    if (from !== frameRef.current) goToFrame(from);
    playStartRef.current = { t0: performance.now(), f0: from };
    isPlayingRef.current = true;
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame((t) => loopRef.current(t));
  }, [ready, goToFrame]);

  const scrub = useCallback(
    (n: number) => {
      stopRef.current();
      goToFrame(n);
    },
    [goToFrame]
  );

  // Mount: boot the engine, load + style the morph, park on frame 0.
  useEffect(() => {
    let disposed = false;
    let releaseSlot: (() => void) | null = null;
    let host: HTMLDivElement | null = null;

    async function init() {
      if (!containerRef.current) return;
      releaseSlot = await acquireBootSlot();
      if (disposed || !containerRef.current) return;

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
      const fc = trajectory.data?.frameCount ?? BAKED_FRAMES;
      frameCountRef.current = fc;
      setFrameCount(fc);

      const model = await plugin.builders.structure.createModel(trajectory);
      modelRefRef.current = model.ref;
      const structure = await plugin.builders.structure.createStructure(model);

      // Element-colored ball-and-stick base (Fe orange, N blue, O red, …).
      await plugin.builders.structure.representation.addRepresentation(
        structure,
        { type: "ball-and-stick", color: "element-symbol" } as any
      );

      // Optional: auto-detected non-covalent contacts as dashes — for the Bohr
      // morph this surfaces the His⁺···Asp⁻ salt bridge as it forms. Wrapped
      // because the provider name/params can drift between Mol* builds.
      if (showInteractionsRef.current) {
        try {
          await plugin.builders.structure.representation.addRepresentation(
            structure,
            { type: "interactions" } as any
          );
        } catch {
          // No interactions rep in this build — skip, the morph still reads.
        }
      }

      // Optional: the tracked atom as a larger uniform sphere, sized to match
      // the anatomy beats so it reads identically across every interactive.
      const emph = emphasisRef.current;
      if (emph) {
        const comp =
          await plugin.builders.structure.tryCreateComponentFromExpression(
            structure,
            elementExpr(emph.element),
            `emphasis-${emph.element}`
          );
        if (comp) {
          await plugin.builders.structure.representation.addRepresentation(comp, {
            type: "spacefill",
            color: "uniform",
            colorParams: { value: emph.hex },
            typeParams: { sizeFactor: emph.sizeFactor },
          } as any);
        }
      }

      if (disposed) {
        plugin.dispose();
        return;
      }
      await setMorphFrame(plugin, model.ref, 0);
      plugin.managers.camera.reset(undefined, 0);

      // Mol*'s GPU-composited canvas slips past the wrapper's rounded
      // `overflow:hidden`; round the canvas itself and strip Mol*'s 1px border.
      if (host && outerRef.current) {
        const radius = getComputedStyle(outerRef.current).borderRadius;
        host.querySelectorAll("canvas").forEach((c) => {
          c.style.borderRadius = radius;
        });
        host.querySelectorAll(".msp-layout-standard").forEach((el) => {
          (el as HTMLElement).style.border = "none";
        });
      }

      setRenderActive(plugin, activeRef.current);
      setReady(true);
    }

    init()
      .catch(() => {
        // A boot torn down mid-flight (StrictMode / fast scroll) can reject as
        // its node detaches — expected, not worth surfacing.
      })
      .finally(() => {
        releaseSlot?.();
        releaseSlot = null;
      });

    return () => {
      disposed = true;
      stopRef.current();
      releaseSlot?.();
      releaseSlot = null;
      pluginRef.current?.dispose();
      pluginRef.current = null;
      host?.remove();
      host = null;
    };
  }, [url]);

  // Pause render loop + playback when scrolled off-screen; repaint on return.
  useEffect(() => {
    activeRef.current = active;
    setRenderActive(pluginRef.current, active);
    if (!active) stopRef.current();
  }, [active]);

  const atEnd = ready && !isPlaying && frame >= frameCount - 1;
  const icon: PlayIcon = isPlaying ? "pause" : atEnd ? "restart" : "play";
  const label = isPlaying ? "Pause" : atEnd ? "Replay" : "Play";

  return (
    <div className={className}>
      <div
        ref={outerRef}
        className="relative h-[300px] w-full overflow-hidden rounded-lg bg-white lg:h-[360px]"
      >
        <div ref={containerRef} className="absolute inset-0" />
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            Loading 3D…
          </div>
        )}
      </div>

      {/* Controls span the full width on mobile, 80% (centered) on desktop. */}
      <div className="mt-3 flex w-full items-center gap-3 lg:mx-auto lg:w-4/5">
        <button
          type="button"
          onClick={isPlaying ? () => stopRef.current() : play}
          disabled={!ready}
          aria-label={label}
          title={label}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ControlIcon kind={icon} />
        </button>
        <input
          type="range"
          min={0}
          max={frameCount - 1}
          step={1}
          value={frame}
          onChange={(e) => scrub(Number(e.target.value))}
          disabled={!ready}
          aria-label="Animation progress"
          className="h-1.5 w-full cursor-pointer disabled:cursor-not-allowed"
          style={{ accentColor }}
        />
      </div>
    </div>
  );
}
