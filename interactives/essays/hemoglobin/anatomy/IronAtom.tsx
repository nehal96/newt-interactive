import { useState } from "react";
import dynamic from "next/dynamic";
import { cn } from "../../../../lib/utils";
import AnnotatedIron from "./AnnotatedIron";

// Mol* is client-only (its own WebGL engine) and heavy, so it's lazy-loaded and
// kept out of SSR / the initial bundle. The annotated SVG is plain markup and
// renders server-side fine.
const MoleculeViewer = dynamic(() => import("./MoleculeViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400">
      Loading 3D…
    </div>
  ),
});

// Iron's element color in Mol* (matches the SVG sphere base) so the two panes
// read as the same atom.
const FE_COLOR = 0xe0762e;

type Mode = "split" | "svg" | "3d";
const MODES: { key: Mode; label: string }[] = [
  { key: "split", label: "Both" },
  { key: "svg", label: "Annotated" },
  { key: "3d", label: "3D model" },
];

/**
 * First beat of the anatomy build-up: a single iron atom, shown as an annotated
 * SVG and as a Mol* 3D model. Defaults to side-by-side ("Both") so the two
 * representations can be compared; the toggle also isolates either one.
 */
export default function IronAtom() {
  const [mode, setMode] = useState<Mode>("split");
  const showSvg = mode === "split" || mode === "svg";
  const show3d = mode === "split" || mode === "3d";

  const paneWidth = (visible: boolean, otherVisible: boolean) =>
    otherVisible ? "lg:w-1/2" : "lg:w-2/3 lg:mx-auto";

  return (
    <figure className="my-8 w-full lg:my-12">
      <div className="rounded-lg bg-slate-100/60 p-6 shadow-lg backdrop-blur-3xl lg:p-8">
        {/* View toggle */}
        <div className="mb-5 flex justify-center">
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
            <div className={cn("w-full", paneWidth(showSvg, show3d))}>
              <div className="relative h-[300px] rounded-lg bg-white lg:h-[360px]">
                <AnnotatedIron />
              </div>
              <figcaption className="mt-2 text-center text-xs text-slate-400">
                Annotated diagram
              </figcaption>
            </div>
          )}
          {show3d && (
            <div className={cn("w-full", paneWidth(show3d, showSvg))}>
              <div className="relative h-[300px] overflow-hidden rounded-lg bg-white lg:h-[360px]">
                <MoleculeViewer
                  url="/structures/iron.pdb"
                  representation="spacefill"
                  uniformColor={FE_COLOR}
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
