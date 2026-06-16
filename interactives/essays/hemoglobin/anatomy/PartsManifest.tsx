import { ReactNode } from "react";
import type { Beat } from "./beats";
import {
  ChainFigure,
  HistidineFigure,
  IronFigure,
  MethineFigure,
  OxygenFigure,
  PyrroleFigure,
} from "./PartFigures";

type Part = {
  key: string;
  name: string;
  /** Per-whole-molecule count, e.g. "×16". */
  count: string;
  figure: ReactNode;
  /** If set, clicking the part opens that build-up beat. */
  beat?: Beat;
  /** A small corner tag, e.g. "placeholder" for the chains. */
  note?: string;
};

// The lean structural set — the raw components, in assembly order (heme parts,
// then the pocket, then the chains). Counts are per whole hemoglobin molecule
// (four hemes, four pockets, four chains). Heme and porphyrin are deliberately
// absent: they're assembled *from* these parts.
const PARTS: Part[] = [
  { key: "iron", name: "iron", count: "×4", figure: <IronFigure />, beat: "iron" },
  { key: "pyrrole", name: "pyrrole", count: "×16", figure: <PyrroleFigure />, beat: "pyrrole" },
  { key: "methine", name: "methine bridge", count: "×16", figure: <MethineFigure />, beat: "porphyrin" },
  { key: "oxygen", name: "oxygen", count: "×4", figure: <OxygenFigure /> },
  { key: "proximalHis", name: "proximal histidine", count: "×4", figure: <HistidineFigure /> },
  { key: "distalHis", name: "distal histidine", count: "×4", figure: <HistidineFigure /> },
  { key: "alpha", name: "alpha chain", count: "×2", figure: <ChainFigure variant="alpha" />, note: "placeholder" },
  { key: "beta", name: "beta chain", count: "×2", figure: <ChainFigure variant="beta" />, note: "placeholder" },
];

type PartsManifestProps = {
  /** Called with the target beat when a linkable part is clicked. */
  onSelectPart?: (beat: Beat) => void;
};

/**
 * The parts manifest that opens the anatomy section: a LEGO-style list of the
 * raw components a hemoglobin molecule is built from, each as a flat
 * ball-and-stick figure with a "name + ×N" header. Parts that map to a build-up
 * beat (iron, pyrrole, methine→porphyrin) are buttons that jump into it.
 */
export default function PartsManifest({ onSelectPart }: PartsManifestProps) {
  return (
    <figure className="my-8 w-full lg:my-12">
      <div className="rounded-lg border border-slate-200 p-6 lg:p-8">
        <div className="mb-1 text-sm font-medium text-slate-700">Hemoglobin Parts</div>
        <p className="mb-5 max-w-prose text-xs leading-relaxed text-slate-500">
          The raw components a hemoglobin molecule is built from.
        </p>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PARTS.map((part) => {
            const linkable = part.beat != null && onSelectPart != null;
            const header = (
              <div className="text-left">
                <div className="text-[11px] leading-tight text-slate-400">{part.name}</div>
                <div className="text-sm font-medium text-slate-700">{part.count}</div>
              </div>
            );
            const figure = (
              <div className="relative mt-1 h-[100px] w-full">
                {part.figure}
                {part.note && (
                  <span className="absolute right-0 top-0 text-[9px] uppercase tracking-wide text-slate-300">
                    {part.note}
                  </span>
                )}
              </div>
            );

            if (linkable) {
              return (
                <button
                  key={part.key}
                  type="button"
                  onClick={() => onSelectPart!(part.beat!)}
                  className="group flex flex-col rounded-lg p-2 text-left outline-none transition-colors hover:bg-slate-100 focus-visible:bg-slate-100"
                >
                  {header}
                  {figure}
                  <span className="mt-1 text-[10px] text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    open build-up →
                  </span>
                </button>
              );
            }

            return (
              <div key={part.key} className="flex flex-col rounded-lg p-2">
                {header}
                {figure}
                {/* Spacer to keep cell heights aligned with the linkable cells. */}
                <span className="mt-1 h-[14px]" aria-hidden />
              </div>
            );
          })}
        </div>
      </div>
    </figure>
  );
}
