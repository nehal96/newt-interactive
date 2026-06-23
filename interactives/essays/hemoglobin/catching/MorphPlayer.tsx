import { useCallback, useEffect, useRef, useState } from "react";
import type { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
import { PluginCommands } from "molstar/lib/mol-plugin/commands";
import {
  elementExpr,
  useMolstarViewer,
  type LoadedStructure,
} from "../molstar-engine";
import { HB } from "../palette";

// Generic play/scrub player for a baked multi-MODEL morph PDB. The engine
// (serialized boot, the villin look, off-screen idling, teardown) lives in
// ../molstar-engine; this file owns the morph-specific bits: the emphasis
// sphere, the play/pause + draggable progress slider, and frame scrubbing.
// Callers pass an `emphasis` (one atom kind to render as a larger tracked
// sphere) and an `accentColor` for the slider; that's the only per-figure
// variation. See BindingMorphPlayer (the heme/Fe morph) and BohrFigure (the
// salt-bridge morph) for the two current callers.

const BAKED_FRAMES = 31; // fallback until the trajectory reports its real count
const DEFAULT_DURATION_MS = 1800; // one forward pass (tune per figure for speed)

// The single atom each morph wants the eye to track, rendered as a larger
// uniform sphere over the element-colored ball-and-stick, picked out by element
// symbol: "Fe" = the heme iron (catching); "H" = the lone synthetic proton of
// the Bohr salt bridge (releasing — the crystal heavy atoms carry no hydrogen).
//
// `sizeFactorRange` (optional) animates the sphere's radius across the morph,
// interpolated linearly from frame 0 → last frame. The heme iron uses it for the
// high→low-spin shrink the prose describes (a large deoxy Fe contracting as O₂
// binds); morphs that omit it keep the fixed `sizeFactor`.
export type Emphasis = {
  element: string;
  hex: number;
  sizeFactor: number;
  sizeFactorRange?: [number, number];
};

// Scrub the trajectory to a frame (0-based) by updating the model transform's
// modelIndex — the same thing AnimateModelIndex does under the hood. Changing
// modelIndex recomputes the whole downstream chain (structure → emphasis
// component → its sphere), so when an emphasis sphere wants a per-frame radius we
// fold that sizeFactor into the *same* commit; it then rebuilds in lockstep with
// the atom's new position rather than lagging a frame behind.
async function setMorphFrame(
  plugin: PluginUIContext,
  modelRef: string,
  frame: number,
  emphUpdate?: { ref: string; sizeFactor: number } | null
) {
  const state = plugin.state.data;
  const update = state.build();
  update.to(modelRef).update((old: any) => {
    old.modelIndex = frame;
  });
  if (emphUpdate) {
    update.to(emphUpdate.ref).update((old: any) => {
      if (old?.type?.params) old.type.params.sizeFactor = emphUpdate.sizeFactor;
    });
  }
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
  accentColor = HB.iron.fill,
  durationMs = DEFAULT_DURATION_MS,
  className,
}: MorphPlayerProps) {
  const modelRefRef = useRef<string | null>(null);
  const emphRepRef = useRef<string | null>(null);

  const [frame, setFrame] = useState(0);
  const [frameCount, setFrameCount] = useState(BAKED_FRAMES);
  const [isPlaying, setIsPlaying] = useState(false);

  const frameRef = useRef(0);
  const frameCountRef = useRef(BAKED_FRAMES);

  // Latest values for the build closure without re-booting the engine.
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

  // --- playback loop (refs so the rAF closure never goes stale) ---
  const rafRef = useRef<number | null>(null);
  const isPlayingRef = useRef(false);
  const playStartRef = useRef<{ t0: number; f0: number }>({ t0: 0, f0: 0 });
  const loopRef = useRef<(now: number) => void>(() => {});
  const stopRef = useRef<() => void>(() => {});

  // Add the morph's representations on boot: an element-colored ball-and-stick
  // base, optional non-covalent contacts, and the tracked emphasis sphere; then
  // park on frame 0. Reads the latest emphasis/interactions via refs (the engine
  // only re-boots on `url`).
  const build = async (plugin: PluginUIContext, loaded: LoadedStructure) => {
    const { model, structure, frameCount: fc } = loaded;
    modelRefRef.current = model.ref;
    frameCountRef.current = fc;
    setFrameCount(fc);

    // Element-colored ball-and-stick base (Fe orange, N blue, O red, …).
    await plugin.builders.structure.representation.addRepresentation(structure, {
      type: "ball-and-stick",
      color: "element-symbol",
    } as any);

    // Optional: auto-detected non-covalent contacts as dashes — for the Bohr
    // morph this surfaces the His⁺···Asp⁻ salt bridge as it forms. Wrapped
    // because the provider name/params can drift between Mol* builds.
    if (showInteractionsRef.current) {
      try {
        await plugin.builders.structure.representation.addRepresentation(structure, {
          type: "interactions",
        } as any);
      } catch {
        // No interactions rep in this build — skip, the morph still reads.
      }
    }

    // Optional: the tracked atom as a larger uniform sphere, sized to match the
    // anatomy beats so it reads identically across every interactive.
    const emph = emphasisRef.current;
    if (emph) {
      const comp = await plugin.builders.structure.tryCreateComponentFromExpression(
        structure,
        elementExpr(emph.element),
        `emphasis-${emph.element}`
      );
      if (comp) {
        // Start at the frame-0 radius so the sphere is already correct before
        // the first scrub; a ranged emphasis (the iron) then shrinks per frame.
        const initialSize = emph.sizeFactorRange
          ? emph.sizeFactorRange[0]
          : emph.sizeFactor;
        const rep = await plugin.builders.structure.representation.addRepresentation(
          comp,
          {
            type: "spacefill",
            color: "uniform",
            colorParams: { value: emph.hex },
            typeParams: { sizeFactor: initialSize },
          } as any
        );
        emphRepRef.current = rep.ref;
      }
    }

    await setMorphFrame(plugin, model.ref, 0);
    plugin.managers.camera.reset(undefined, 0);
  };

  const { outerRef, containerRef, pluginRef, ready } = useMolstarViewer({
    url,
    active,
    build,
    deps: [url],
    // Stop any in-flight playback before the engine tears down.
    onTeardown: () => stopRef.current(),
  });

  // The emphasis sphere's radius for a given frame: a linear walk across
  // `sizeFactorRange` (frame 0 → last frame), or null when the morph keeps a
  // fixed-size sphere. Returned ready to ride along in setMorphFrame's commit.
  const emphUpdateForFrame = useCallback((frame: number) => {
    const emph = emphasisRef.current;
    const ref = emphRepRef.current;
    if (!emph || !ref || !emph.sizeFactorRange) return null;
    const fc = frameCountRef.current;
    const [a, b] = emph.sizeFactorRange;
    const t = fc <= 1 ? 0 : frame / (fc - 1);
    return { ref, sizeFactor: a + (b - a) * t };
  }, []);

  const applyFrame = useCallback(async () => {
    const plugin = pluginRef.current;
    const modelRef = modelRefRef.current;
    if (!plugin || !modelRef || applyingRef.current) return;
    applyingRef.current = true;
    try {
      let last = -1;
      while (desiredFrameRef.current !== last) {
        last = desiredFrameRef.current;
        await setMorphFrame(plugin, modelRef, last, emphUpdateForFrame(last));
      }
    } catch {
      // A commit racing a teardown can reject; harmless.
    } finally {
      applyingRef.current = false;
    }
  }, [pluginRef, emphUpdateForFrame]);

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

  // Stop playback when scrolled off-screen (the engine idles the render loop).
  useEffect(() => {
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
