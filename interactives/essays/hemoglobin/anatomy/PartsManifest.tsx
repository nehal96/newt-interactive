import { ReactNode } from "react";
import { ATOM_PALETTE, type Element } from "./AtomSphere";
import {
  ChainFigure,
  HistidineFigure,
  IronFigure,
  MethineFigure,
  OxygenFigure,
  PyrroleFigure,
} from "./PartFigures";

// The atoms that appear across the part figures, in build-up order. The legend
// keys the CPK colors so a shared color reads correctly — e.g. the histidines'
// backbone carbonyl oxygen is the same red as the O₂ part because both are
// oxygen, not a clash.
const LEGEND_ELEMENTS: Element[] = ["Fe", "C", "N", "O", "H"];

function AtomLegend() {
  return (
    <div className="flex shrink-0 flex-col gap-1 lg:flex-row lg:flex-wrap lg:items-center lg:justify-end lg:gap-x-3 lg:gap-y-1">
      {LEGEND_ELEMENTS.map((el) => {
        const atom = ATOM_PALETTE[el];
        return (
          <div key={el} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: atom.base, boxShadow: `inset 0 0 0 1px ${atom.rim}` }}
              aria-hidden
            />
            <span className="text-[10px] leading-none text-slate-500">{atom.name}</span>
          </div>
        );
      })}
    </div>
  );
}

type Part = {
  key: string;
  name: string;
  /** Per-whole-molecule count, e.g. "×16". */
  count: string;
  figure: ReactNode;
};

// The lean structural set — the raw components, in assembly order (heme parts,
// then the pocket, then the chains). Counts are per whole hemoglobin molecule
// (four hemes, four pockets, four chains). Heme and porphyrin are deliberately
// absent: they're assembled *from* these parts.
const PARTS: Part[] = [
  { key: "iron", name: "iron", count: "×4", figure: <IronFigure /> },
  { key: "pyrrole", name: "pyrrole", count: "×16", figure: <PyrroleFigure /> },
  { key: "methine", name: "methine bridge", count: "×16", figure: <MethineFigure /> },
  { key: "oxygen", name: "oxygen", count: "×4", figure: <OxygenFigure /> },
  { key: "proximalHis", name: "proximal histidine", count: "×4", figure: <HistidineFigure /> },
  { key: "distalHis", name: "distal histidine", count: "×4", figure: <HistidineFigure /> },
  { key: "alpha", name: "alpha chain", count: "×2", figure: <ChainFigure variant="alpha" /> },
  { key: "beta", name: "beta chain", count: "×2", figure: <ChainFigure variant="beta" /> },
];

/**
 * The parts manifest that opens the anatomy section: a static LEGO-style list of
 * the raw components a hemoglobin molecule is built from, each a flat
 * ball-and-stick figure with a "name + ×N" header, plus a small atom-color
 * legend keying the CPK colors.
 */
export default function PartsManifest() {
  return (
    <figure className="my-8 w-full self-center lg:my-12 lg:max-w-[55rem]">
      <div className="rounded-lg border border-slate-200 p-6 lg:p-8">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="text-sm font-medium text-slate-700">Hemoglobin Parts</div>
          <AtomLegend />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PARTS.map((part) => (
            <div key={part.key} className="flex flex-col rounded-lg p-2">
              <div className="text-left">
                <div className="text-[11px] leading-tight text-slate-400">{part.name}</div>
                <div className="text-sm font-medium text-slate-700">{part.count}</div>
              </div>
              <div className="mt-1 h-[100px] w-full">{part.figure}</div>
            </div>
          ))}
        </div>
      </div>
    </figure>
  );
}
