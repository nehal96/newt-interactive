import MorphPlayer from "./MorphPlayer";
import { HB, toHex } from "../palette";

// The "pull" / "lean" interactive: the baked O₂-binding morph, played by the
// generic MorphPlayer with the heme iron emphasized. All the engine (boot,
// scrub, idle, the villin look) lives in MorphPlayer; this file just pins the
// one atom the eye should track.

// The heme iron's emphasis color + size, matching the anatomy beats so the atom
// reads identically across every interactive. sizeFactor 0.25 → Fe_vdW(2.05) ×
// 0.25 ≈ 0.51 Å ≈ 2× the ring balls — close to the real Fe²⁺ ionic radius, not a
// dominating vdW sphere (the earlier 0.9 ≈ 1.85 Å dwarfed the ring).
//
// The high→low-spin shrink the prose describes — a large deoxy Fe²⁺ (~0.78 Å)
// contracting to ~0.61 Å as O₂ binds — is animated across the morph (frame 0 =
// deoxy, last = oxy). We pin the *bound* (oxy) sphere to the tuned 0.25 and scale
// the deoxy sphere up by the real radius ratio (0.78 / 0.61 ≈ 1.28 → 0.32), so the
// iron visibly contracts as it snaps into the ring plane — matching "the atom
// grows slightly smaller, just small enough to rise into the plane." The static
// anatomy beats keep the fixed 0.25, the bound-state size.
const FE_EMPHASIS_HEX = toHex(HB.iron.fill);
const FE_SIZE_OXY = 0.25; // low-spin, O₂ bound — the tuned anatomy-beat size
const FE_SIZE_DEOXY = 0.32; // high-spin, before O₂ — ~28% larger (0.78/0.61 Å)
const FE_COLOR = HB.iron.fill; // same orange in CSS, for the slider accent

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
      emphasis={{
        element: "Fe",
        hex: FE_EMPHASIS_HEX,
        sizeFactor: FE_SIZE_OXY,
        sizeFactorRange: [FE_SIZE_DEOXY, FE_SIZE_OXY],
      }}
    />
  );
}
