import { ComponentType, useState } from "react";
import dynamic from "next/dynamic";
import * as Select from "@radix-ui/react-select";
import { FiChevronDown, FiCheck } from "react-icons/fi";
import { cn } from "../../../../lib/utils";
import AnnotatedIron from "./AnnotatedIron";
import AnnotatedPyrrole from "./AnnotatedPyrrole";
import AnnotatedPorphyrin from "./AnnotatedPorphyrin";

// Mol* is client-only (its own WebGL engine) and heavy, so it's lazy-loaded and
// kept out of SSR / the initial bundle. The annotated SVGs are plain markup.
const MoleculeViewer = dynamic(() => import("./MoleculeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">
      Loading 3D…
    </div>
  ),
});

export type Beat = "iron" | "pyrrole" | "porphyrin";

type BeatConfig = {
  label: string;
  Svg: ComponentType<{ className?: string }>;
  viewer: {
    url: string;
    representation: "spacefill" | "ball-and-stick";
    uniformColor?: number;
    sizeFactor?: number;
    emphasizeIron?: boolean;
  };
};

// Iron's element color in Mol* (matches the SVG sphere) so the panes read as the
// same atom. Pyrrole uses element coloring (Fe orange, N blue, C grey).
const FE_COLOR = 0xe0762e;

const BEATS: Record<Beat, BeatConfig> = {
  iron: {
    label: "Iron atom",
    Svg: AnnotatedIron,
    viewer: {
      url: "/structures/iron.pdb",
      representation: "spacefill",
      uniformColor: FE_COLOR,
    },
  },
  pyrrole: {
    label: "Pyrrole ring",
    Svg: AnnotatedPyrrole,
    viewer: {
      url: "/structures/iron-pyrrole.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
  porphyrin: {
    label: "Porphyrin",
    Svg: AnnotatedPorphyrin,
    viewer: {
      url: "/structures/iron-porphyrin.pdb",
      representation: "ball-and-stick",
      emphasizeIron: true,
    },
  },
};

const BEAT_ORDER: Beat[] = ["iron", "pyrrole", "porphyrin"];

type Mode = "split" | "svg" | "3d";
const MODES: { key: Mode; label: string }[] = [
  { key: "split", label: "Both" },
  { key: "svg", label: "Annotated" },
  { key: "3d", label: "3D model" },
];

/**
 * The anatomy build-up block: a dropdown picks the beat (iron → pyrrole → …),
 * and a toggle shows the annotated SVG, the Mol* 3D model, or both side-by-side
 * (default). Each beat pairs a flat schematic SVG with a small vendored 3D
 * structure.
 */
type AnatomyBuildupProps = {
  /** Controlled active beat. Falls back to internal state when omitted. */
  beat?: Beat;
  onBeatChange?: (beat: Beat) => void;
};

export default function AnatomyBuildup({
  beat: controlledBeat,
  onBeatChange,
}: AnatomyBuildupProps = {}) {
  const [internalBeat, setInternalBeat] = useState<Beat>("iron");
  const beat = controlledBeat ?? internalBeat;
  const setBeat = (next: Beat) => {
    setInternalBeat(next);
    onBeatChange?.(next);
  };
  const [mode, setMode] = useState<Mode>("split");
  const showSvg = mode === "split" || mode === "svg";
  const show3d = mode === "split" || mode === "3d";

  const { Svg, viewer } = BEATS[beat];
  const paneWidth = (otherVisible: boolean) =>
    otherVisible ? "lg:w-1/2" : "lg:w-2/3 lg:mx-auto";

  return (
    <figure className="my-8 w-full lg:my-12">
      <div className="rounded-lg bg-slate-100/60 p-6 shadow-lg backdrop-blur-3xl lg:p-8">
        {/* Controls: beat dropdown (left) + view toggle (right). */}
        <div className="mb-5 flex items-center justify-between">
          <Select.Root value={beat} onValueChange={(v) => setBeat(v as Beat)}>
            <Select.Trigger className="inline-flex items-center gap-1 rounded-md border border-slate-300 px-3 py-1 text-xs text-slate-700 outline-none hover:border-slate-400 md:text-sm">
              <Select.Value />
              <Select.Icon>
                <FiChevronDown />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={4}
                className="z-50 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
              >
                <Select.Viewport className="p-1">
                  {BEAT_ORDER.map((key) => (
                    <Select.Item
                      key={key}
                      value={key}
                      className="relative flex cursor-pointer select-none items-center rounded px-6 py-1.5 text-xs text-slate-700 outline-none data-[highlighted]:bg-slate-100 md:text-sm"
                    >
                      <Select.ItemText>{BEATS[key].label}</Select.ItemText>
                      <Select.ItemIndicator className="absolute left-1.5">
                        <FiCheck className="h-3.5 w-3.5" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>

          <div className="inline-flex rounded-md bg-white/70 p-1 shadow-sm">
            {MODES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMode(m.key)}
                className={cn(
                  "rounded-[5px] px-3 py-1 text-xs transition-colors md:text-sm",
                  mode === m.key
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:justify-center">
          {showSvg && (
            <div className={cn("w-full", paneWidth(show3d))}>
              <div className="relative h-[300px] rounded-lg bg-white lg:h-[360px]">
                <Svg />
              </div>
              <figcaption className="mt-2 text-center text-xs text-slate-400">
                Annotated diagram
              </figcaption>
            </div>
          )}
          {show3d && (
            <div className={cn("w-full", paneWidth(showSvg))}>
              <div className="relative h-[300px] overflow-hidden rounded-lg bg-white lg:h-[360px]">
                <MoleculeViewer
                  key={beat}
                  url={viewer.url}
                  representation={viewer.representation}
                  uniformColor={viewer.uniformColor}
                  sizeFactor={viewer.sizeFactor}
                  emphasizeIron={viewer.emphasizeIron}
                  className="rounded-lg"
                />
              </div>
              <figcaption className="mt-2 text-center text-xs text-slate-400">
                3D model (Mol*)
              </figcaption>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}
