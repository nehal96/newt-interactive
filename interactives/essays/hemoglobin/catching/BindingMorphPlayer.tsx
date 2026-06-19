import MorphPlayer from "./MorphPlayer";

// The "pull" / "lean" interactive: the baked O₂-binding morph, played by the
// generic MorphPlayer with the heme iron emphasized. All the engine (boot,
// scrub, idle, the villin look) lives in MorphPlayer; this file just pins the
// one atom the eye should track.

// The heme iron's emphasis color + size, matching the anatomy beats so the atom
// reads identically across every interactive. sizeFactor 0.25 → Fe_vdW(2.05) ×
// 0.25 ≈ 0.51 Å ≈ 2× the ring balls — close to the real Fe²⁺ ionic radius, not a
// dominating vdW sphere (the earlier 0.9 ≈ 1.85 Å dwarfed the ring).
// TODO(iron-size): the high→low-spin shrink (deoxy Fe²⁺ ~0.78 Å → oxy ~0.61 Å, a
// ~22% drop) is described in the prose but not shown — the iron is a fixed size
// here. Decide whether to animate sizeFactor across the morph so the visual
// matches the text, keeping it consistent with the anatomy beats either way.
const FE_EMPHASIS_HEX = 0xe0762e;
const FE_EMPHASIS_SIZE = 0.25;
const FE_COLOR = "#e0762e"; // same orange in CSS, for the slider accent

type BindingMorphPlayerProps = {
  /** Vendored multi-model morph PDB in /public to play and scrub. */
  url: string;
  /** When false the render loop and playback are paused (off-screen). */
  active?: boolean;
  className?: string;
};

export default function BindingMorphPlayer({
  url,
  active = true,
  className,
}: BindingMorphPlayerProps) {
  return (
    <MorphPlayer
      url={url}
      active={active}
      className={className}
      accentColor={FE_COLOR}
      emphasis={{ element: "Fe", hex: FE_EMPHASIS_HEX, sizeFactor: FE_EMPHASIS_SIZE }}
    />
  );
}
