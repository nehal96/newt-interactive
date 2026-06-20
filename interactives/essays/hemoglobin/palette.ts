// Single source of truth for the hemoglobin essay's color language. Every
// surface reads its colors from here — the flat SVG schematics, the
// cooperativity charts, the 3D Mol* viewers, and the color-coded prose terms —
// so a given entity is the same color everywhere it appears.
//
// Chains use ONE scheme, taken from the T<->R switch figure: hue = which αβ
// half (blue = the fixed reference half, magenta = the half that rotates),
// lightness = α (lighter) vs β (deeper). The anatomy build-up introduces the
// chains in the blue/reference half; the magenta half appears only once the
// second dimer is added and in the quaternary-motion figures, where it reads as
// "the other identical copy". The flat parts-manifest icons and the 3D anatomy
// ribbons are tweaked to match this switch palette rather than carrying their
// own (older blue/green and red/blue) chain colors.
//
// `fill` is the shape color; `ink` is a darker, text-legible variant for the
// color-coded prose terms (see Term.tsx); `light`/`rim` feed the shaded atom
// spheres and shape outlines where needed.

export type Swatch = {
  fill: string;
  ink: string;
  light?: string;
  rim?: string;
};

const swatch = (
  fill: string,
  ink: string,
  light?: string,
  rim?: string
): Swatch => ({ fill, ink, light, rim });

export const HB = {
  // --- atoms / heme (CPK-ish, except carbon — see below; oxygen & iron were
  //     already shared everywhere) ---
  iron: swatch("#E0762E", "#A8531A", "#F8BC8B", "#A8531A"),
  oxygen: swatch("#E2533C", "#B23A28", "#F59781", "#B23A28"),
  nitrogen: swatch("#3F71D8", "#2A4FA6", "#8BAAF1", "#2A4FA6"),
  // carbon — teal-green, to match the 3D viewers. Mol*'s element-symbol theme
  // colors carbons by chain-id, and chain A lands on the Many-Distinct list's
  // #1B9E77, so the 3D ball-and-stick reads green. This is a softened/lightened
  // version that sits in the muted 2D palette; set `fill` to #1B9E77 for an exact
  // match to the 3D green.
  carbon: swatch("#47B894", "#176A50", "#A8E6D2", "#207E62"),
  hydrogen: swatch("#EFEEE9", "#8A897F", "#FFFFFF", "#CDCCC4"),

  // --- chains, colored by TYPE: the molecule is built component-by-component,
  //     so α and β must read as two distinct parts everywhere (3D ribbons, the
  //     2D switch, the parts manifest, the prose). Two hues from the switch
  //     palette — α = blue, β = magenta. In the switch the two αβ halves are then
  //     told apart by their motion (one half rotates), not by color. ---
  // `light` carries the soft tint used as the Goodsell chain-blob body fill (the
  // saturated `fill` stays the blob's outline + inner subunit marks).
  alpha: swatch("#3F71D8", "#2A4FA6", "#93B2EC", "#28488F"), // α chain — blue
  beta: swatch("#C04E92", "#8C2F6B", "#DCA0C9", "#8C2F6B"), // β chain — magenta

  // --- effectors (release / affinity shift) ---
  acid: swatch("#7C5CF0", "#5A3FC0"), // Bohr protons / acid
  co2: swatch("#2E9E6F", "#1C6B49"), // CO₂ / carbamate — teal, clear of the BPG yellow
  bpg: swatch("#E3B341", "#8A6A0E", "#F5E4B0", "#9A7B12"), // 2,3-BPG
  fetalHb: swatch("#D4628A", "#A53C61"), // fetal hemoglobin — lighter rose
} as const;

// The 2D T<->R switch (and the BPG doorstop that reuses it) draw FOUR chain
// colors: each chain type keeps its hue (α blue, β magenta), and the two copies
// are told apart by lightness — the mobile half (₂, the one that rotates) uses
// the deep canonical hue so it reads as the bold "active" half, and the fixed
// reference half (₁) a lighter tint. Darker rims on every blob. (The 3D ribbons,
// manifest and prose stay at the two flat type colors above.)
export const SWITCH_CHAINS = {
  alpha1: "#7099E8", // α₁ — light blue (fixed reference half)
  alpha2: HB.alpha.fill, // α₂ — deep blue (mobile half, rotates)
  alphaRim: HB.alpha.rim!,
  beta1: "#D279AE", // β₁ — light magenta (fixed reference half)
  beta2: HB.beta.fill, // β₂ — deep magenta (mobile half, rotates)
  betaRim: HB.beta.rim!,
} as const;

// Neutral chart furniture — kept deliberately desaturated so color stays
// reserved for the molecular entities above.
export const NEUTRAL = {
  curve: "#334155", // slate-700 — the saturation curve
  axis: "#cbd5e1", // slate-300
  grid: "#eef2f6",
  tick: "#94a3b8", // slate-400
  molBg: "#f8fafc",
  empty: "#cbd5e1", // empty seat ring
  hemeRing: "#ffffff",
  angleArm: "#E0A33A", // the 15° rotation arm in the T<->R figure (amber)
  angleLabel: "#B57E1F",
} as const;

// Mol* representations want 0xRRGGBB numbers; convert a palette hex string.
export const toHex = (s: string): number => parseInt(s.slice(1), 16);
