import { useId, type FC } from "react";

/* ------------------------------------------------------------------ *
 * Cover art
 *
 * Every cover is drawn from the same three primitives — node, edge,
 * field — on the same paper ground, at the same stroke weights, from
 * the same ramp. The motif changes per piece; the hand doesn't. That's
 * what makes the index cohere in a way screenshots of the live figures
 * never did: a working interactive is a tool, and tools are dense and
 * labelled. A cover needs to be an emblem.
 *
 * Two rules carry most of the weight:
 *   - No text inside the art, ever. Type sized for a full-width figure
 *     is illegible at the 160px index thumb, and any crop slices it.
 *   - Everything lives inside the safe band (x 40–280, y 30–150 of a
 *     320×180 frame), so one drawing serves both sizes uncropped.
 * ------------------------------------------------------------------ */

/** The ramp. Indigo carries structure; red is the accent — one element
 *  per cover, never more, and always on the thing worth looking at
 *  (the measurement, the mutation, the mode of the belief). */
const C = {
  paper: "#FBFAF7",
  i200: "#C7D2FE",
  i300: "#A5B4FC",
  i400: "#818CF8",
  i600: "#4F46E5",
  i700: "#4338CA",
  i800: "#3730A3",
  r300: "#FDA4AF",
  r600: "#E11D48",
  r700: "#BE123C",
  hair: "#94A3B8",
} as const;

export type Motif =
  | "network"
  | "network-layered"
  | "circuit"
  | "generations"
  | "distributions"
  | "helix"
  | "bars"
  | "wireframe";

/** Marker id handed down to whichever motifs draw arrows. Wiring is always
 *  indigo — red is reserved for a node, so it reads as a thing, not a flow. */
type Arrows = { arrow: string };

/* -- Motifs ---------------------------------------------------------
 * Arrow endpoints are precomputed along the centre-to-centre unit
 * vector and stopped at the target's radius, so every arrowhead sits on
 * the rim aimed straight at the middle of the circle.
 * ------------------------------------------------------------------ */

/** Erdős–Rényi — an unstructured field of nodes and chance edges. */
const Network = () => (
  <>
    <g stroke={C.i400} strokeWidth={1.3} opacity={0.65} fill="none">
      <path d="M72,54 L118,96" />
      <path d="M118,96 L164,58" />
      <path d="M164,58 L214,88" />
      <path d="M118,96 L152,132" />
      <path d="M152,132 L214,88" />
      <path d="M214,88 L258,120" />
      <path d="M72,54 L164,58" />
      <path d="M152,132 L96,140" />
      <path d="M96,140 L118,96" />
      <path d="M258,120 L206,142" />
      <path d="M206,142 L152,132" />
      <path d="M214,88 L246,50" />
      <path d="M246,50 L164,58" />
      <path d="M72,54 L96,140" />
    </g>
    <g strokeWidth={1.6}>
      <circle cx="72" cy="54" r="9" fill={C.i200} stroke={C.i600} />
      <circle cx="118" cy="96" r="12" fill={C.i400} stroke={C.i700} />
      <circle cx="164" cy="58" r="10" fill={C.i300} stroke={C.i700} />
      <circle cx="214" cy="88" r="13" fill={C.i600} stroke={C.i800} />
      <circle cx="152" cy="132" r="9" fill={C.i200} stroke={C.i600} />
      <circle cx="96" cy="140" r="7" fill={C.i200} stroke={C.i600} />
      <circle cx="258" cy="120" r="8" fill={C.i200} stroke={C.i600} />
      {/* The one red: a single vertex picked out of the field. */}
      <circle cx="206" cy="142" r="10" fill={C.r300} stroke={C.r600} />
      <circle cx="246" cy="50" r="7" fill={C.i200} stroke={C.i600} />
    </g>
  </>
);

/** Systems Biology — the same vocabulary, but tiered rather than random. */
const NetworkLayered = ({ arrow }: Arrows) => (
  <>
    <g
      fill="none"
      stroke={C.i700}
      strokeWidth={1.8}
      strokeLinecap="round"
      markerEnd={`url(#${arrow})`}
    >
      <path d="M99.6,60.8 L115.4,82.2" />
      <path d="M151.4,53.5 L133.6,81.5" />
      <path d="M169.1,53.2 L188.9,81.8" />
      <path d="M221.0,61.2 L207.0,81.8" />
      <path d="M134.2,108.1 L150.8,131.9" />
      <path d="M188.3,107.7 L169.7,132.3" />
    </g>
    <g strokeWidth={1.9}>
      <circle cx="90" cy="48" r="16" fill={C.i200} stroke={C.i600} />
      {/* The one red: the master input the whole tier hangs off. */}
      <circle cx="160" cy="40" r="16" fill={C.r300} stroke={C.r600} />
      <circle cx="230" cy="48" r="16" fill={C.i200} stroke={C.i600} />
      <circle cx="125" cy="95" r="16" fill={C.i400} stroke={C.i700} />
      <circle cx="198" cy="95" r="16" fill={C.i400} stroke={C.i700} />
      <circle cx="160" cy="145" r="16" fill={C.i600} stroke={C.i800} />
    </g>
  </>
);

/** C1-FFL — two paths to the same output, one of them via a delay. */
const Circuit = ({ arrow }: Arrows) => (
  <>
    <g
      fill="none"
      stroke={C.i700}
      strokeWidth={2.2}
      strokeLinecap="round"
      markerEnd={`url(#${arrow})`}
    >
      <path d="M116,58 L192,58" />
      <path d="M107.8,75.1 L143.2,118.9" />
      <path d="M201.0,75.8 L170.0,118.2" />
    </g>
    <g strokeWidth={2}>
      {/* The one red: the input, where both arms of the loop start. */}
      <circle cx="94" cy="58" r="22" fill={C.r300} stroke={C.r600} />
      <circle cx="214" cy="58" r="22" fill={C.i400} stroke={C.i700} />
      <circle cx="157" cy="136" r="22" fill={C.i600} stroke={C.i800} />
    </g>
  </>
);

/** Circuit Evolution — one circuit, three generations, gaining edges. */
const Generations = ({ arrow }: Arrows) => (
  <>
    {/* The generation ramp is carried by the nodes; the wiring stays one
        weight and one colour so the three columns read as the same circuit.
        Nodes are r=12 rather than 15 so the third generation's cross-edge has
        room to be an arrow instead of a nub. */}
    <g
      fill="none"
      stroke={C.i700}
      strokeWidth={1.7}
      strokeLinecap="round"
      markerEnd={`url(#${arrow})`}
    >
      <path d="M85,76 L85,110" />
      <path d="M158.4,69.5 L145.6,110.6" />
      <path d="M165.6,69.5 L178.4,110.6" />
      <path d="M235.9,69.3 L221.1,110.7" />
      <path d="M244.1,69.3 L258.9,110.7" />
      <path d="M229,122 L251,122" />
    </g>
    <g strokeWidth={1.8}>
      <circle cx="85" cy="64" r="12" fill={C.i200} stroke={C.i400} />
      <circle cx="85" cy="122" r="12" fill={C.i200} stroke={C.i400} />
      <circle cx="162" cy="58" r="12" fill={C.i300} stroke={C.i600} />
      <circle cx="142" cy="122" r="12" fill={C.i300} stroke={C.i600} />
      <circle cx="182" cy="122" r="12" fill={C.i300} stroke={C.i600} />
      <circle cx="240" cy="58" r="12" fill={C.i600} stroke={C.i800} />
      <circle cx="217" cy="122" r="12" fill={C.i600} stroke={C.i800} />
      {/* The one red: the node the last generation wired something new into. */}
      <circle cx="263" cy="122" r="12" fill={C.r300} stroke={C.r600} />
    </g>
  </>
);

/** Kalman filters — a broad prior and a sharp measurement, overlapping. */
const Distributions = () => (
  <>
    <path
      d="M42,140 C94,140 94,78 120,78 C146,78 146,140 198,140 Z"
      fill={C.i400}
      fillOpacity={0.42}
      stroke={C.i600}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path
      d="M151,140 C187,140 187,52 205,52 C223,52 223,140 259,140 Z"
      fill={C.r300}
      fillOpacity={0.5}
      stroke={C.r600}
      strokeWidth={1.8}
      strokeLinejoin="round"
    />
    <path d="M40,140 L280,140" stroke={C.hair} strokeWidth={1.1} opacity={0.55} />
    <circle cx="120" cy="78" r="3.4" fill={C.i600} />
    <circle cx="205" cy="52" r="3.4" fill={C.r600} />
  </>
);

/** DNA — two strands a half-turn out of phase, rungs between them. */
const Helix = () => (
  <>
    <g stroke={C.i300} strokeWidth={1.4} opacity={0.75}>
      <path d="M59.4,63.1 L59.4,116.9" />
      <path d="M73.75,52 L73.75,128" />
      <path d="M88.1,63.1 L88.1,116.9" />
      <path d="M116.9,116.9 L116.9,63.1" />
      <path d="M131.25,128 L131.25,52" />
      <path d="M145.6,116.9 L145.6,63.1" />
      <path d="M174.4,63.1 L174.4,116.9" />
      <path d="M188.75,52 L188.75,128" />
      <path d="M203.1,63.1 L203.1,116.9" />
      <path d="M231.9,116.9 L231.9,63.1" />
      <path d="M246.25,128 L246.25,52" />
      <path d="M260.6,116.9 L260.6,63.1" />
    </g>
    <path
      d="M45,90 C59.4,39.5 88.1,39.5 102.5,90 C116.9,140.5 145.6,140.5 160,90 C174.4,39.5 203.1,39.5 217.5,90 C231.9,140.5 260.6,140.5 275,90"
      fill="none"
      stroke={C.i600}
      strokeWidth={2.6}
      strokeLinecap="round"
    />
    <path
      d="M45,90 C59.4,140.5 88.1,140.5 102.5,90 C116.9,39.5 145.6,39.5 160,90 C174.4,140.5 203.1,140.5 217.5,90 C231.9,39.5 260.6,39.5 275,90"
      fill="none"
      stroke={C.r600}
      strokeWidth={2.6}
      strokeLinecap="round"
    />
  </>
);

/** Robot localization — a belief over position, peaked where it thinks it is. */
const Bars = () => (
  <>
    <g strokeWidth={1.3}>
      <rect x="50" y="134" width="14" height="6" rx="2" fill={C.i200} stroke={C.i600} />
      <rect x="70" y="130" width="14" height="10" rx="2" fill={C.i200} stroke={C.i600} />
      <rect x="90" y="122" width="14" height="18" rx="2" fill={C.i300} stroke={C.i600} />
      <rect x="110" y="110" width="14" height="30" rx="2" fill={C.i300} stroke={C.i700} />
      <rect x="130" y="88" width="14" height="52" rx="2" fill={C.i400} stroke={C.i700} />
      {/* The one red: the mode — where the robot thinks it actually is. */}
      <rect x="150" y="62" width="14" height="78" rx="2" fill={C.r300} stroke={C.r700} />
      <rect x="170" y="82" width="14" height="58" rx="2" fill={C.i400} stroke={C.i700} />
      <rect x="190" y="106" width="14" height="34" rx="2" fill={C.i300} stroke={C.i700} />
      <rect x="210" y="120" width="14" height="20" rx="2" fill={C.i300} stroke={C.i600} />
      <rect x="230" y="129" width="14" height="11" rx="2" fill={C.i200} stroke={C.i600} />
      <rect x="250" y="133" width="14" height="7" rx="2" fill={C.i200} stroke={C.i600} />
    </g>
    <path d="M42,140 L278,140" stroke={C.hair} strokeWidth={1.1} opacity={0.55} />
  </>
);

/** Three.js Journey — an isometric cube, the first thing you ever render. */
const Wireframe = () => (
  <>
    <g stroke="none">
      <path d="M109.8,61 L160,32 L210.2,61 L160,90 Z" fill={C.i200} fillOpacity={0.9} />
      <path d="M109.8,61 L160,90 L160,148 L109.8,119 Z" fill={C.i300} fillOpacity={0.85} />
      <path d="M160,90 L210.2,61 L210.2,119 L160,148 Z" fill={C.i400} fillOpacity={0.85} />
    </g>
    <g fill="none" stroke={C.i700} strokeWidth={2.2} strokeLinejoin="round">
      <path d="M160,32 L210.2,61 L210.2,119 L160,148 L109.8,119 L109.8,61 Z" />
      <path d="M160,90 L160,32" />
      <path d="M160,90 L210.2,119" />
      <path d="M160,90 L109.8,119" />
    </g>
    <g fill={C.i800}>
      <circle cx="160" cy="32" r="3.6" />
      <circle cx="210.2" cy="61" r="3.6" />
      <circle cx="210.2" cy="119" r="3.6" />
      <circle cx="160" cy="148" r="3.6" />
      <circle cx="109.8" cy="119" r="3.6" />
      <circle cx="109.8" cy="61" r="3.6" />
    </g>
    {/* The one red: the near corner — the origin you orbit the camera around. */}
    <circle cx="160" cy="90" r="4.2" fill={C.r600} />
  </>
);

const MOTIFS: Record<Motif, FC<Arrows>> = {
  network: Network,
  "network-layered": NetworkLayered,
  circuit: Circuit,
  generations: Generations,
  distributions: Distributions,
  helix: Helix,
  bars: Bars,
  wireframe: Wireframe,
};

/**
 * A piece's cover, drawn rather than screenshotted. Decorative — the
 * link's own text is what gets announced.
 */
const CoverArt = ({ motif, className }: { motif: Motif; className?: string }) => {
  // Marker ids have to be unique per instance; useId's colons are legal
  // in HTML but awkward inside url(#…), so strip them.
  const arrow = `ca-arrow-${useId().replace(/:/g, "")}`;
  const Shape = MOTIFS[motif];

  return (
    <svg
      viewBox="0 0 320 180"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        {/* userSpaceOnUse so the head is the same size in every motif,
            whatever the shaft's stroke weight. refX puts the tip on the
            path's end point — which each motif stops at the target's rim. */}
        <marker
          id={arrow}
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="9"
          markerHeight="9"
          markerUnits="userSpaceOnUse"
          orient="auto"
        >
          <path d="M1,1.5 L9,5 L1,8.5 Z" fill={C.i700} />
        </marker>
      </defs>
      <rect width="320" height="180" fill={C.paper} />
      <Shape arrow={arrow} />
    </svg>
  );
};

export default CoverArt;
