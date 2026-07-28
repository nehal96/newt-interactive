import { useId, type FC } from "react";

/* A piece's cover, drawn from node, edge and field. */

const C = {
  i200: "#C7D2FE",
  i300: "#A5B4FC",
  i400: "#818CF8",
  i600: "#4F46E5",
  i700: "#4338CA",
  i800: "#3730A3",
  r300: "#FDA4AF",
  r600: "#E11D48",
  r700: "#BE123C",
} as const;

const HAIRLINE = "stroke-ink-400";

export type Motif =
  | "network"
  | "network-layered"
  | "circuit"
  | "generations"
  | "distributions"
  | "helix"
  | "bars"
  | "wireframe";

type Arrows = { arrow: string };

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
      <circle cx="206" cy="142" r="10" fill={C.r300} stroke={C.r600} />
      <circle cx="246" cy="50" r="7" fill={C.i200} stroke={C.i600} />
    </g>
  </>
);

// Arrowed paths stop at the target's radius, not its centre — move a node here
// or in any motif below and the edges into it have to be recomputed.
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
      <circle cx="160" cy="40" r="16" fill={C.r300} stroke={C.r600} />
      <circle cx="230" cy="48" r="16" fill={C.i200} stroke={C.i600} />
      <circle cx="125" cy="95" r="16" fill={C.i400} stroke={C.i700} />
      <circle cx="198" cy="95" r="16" fill={C.i400} stroke={C.i700} />
      <circle cx="160" cy="145" r="16" fill={C.i600} stroke={C.i800} />
    </g>
  </>
);

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
      <circle cx="94" cy="58" r="22" fill={C.r300} stroke={C.r600} />
      <circle cx="214" cy="58" r="22" fill={C.i400} stroke={C.i700} />
      <circle cx="157" cy="136" r="22" fill={C.i600} stroke={C.i800} />
    </g>
  </>
);

const Generations = ({ arrow }: Arrows) => (
  <>
    <g
      fill="none"
      stroke={C.i700}
      strokeWidth={1.7}
      strokeLinecap="round"
      markerEnd={`url(#${arrow})`}
    >
      <path d="M60,76 L60,110" />
      <path d="M133.4,69.5 L120.6,110.6" />
      <path d="M140.6,69.5 L153.4,110.6" />
      <path d="M232.9,69.3 L218.1,110.7" />
      <path d="M241.1,69.3 L255.9,110.7" />
      <path d="M226,122 L248,122" />
    </g>
    <g strokeWidth={1.8}>
      <circle cx="60" cy="64" r="12" fill={C.i200} stroke={C.i400} />
      <circle cx="60" cy="122" r="12" fill={C.i200} stroke={C.i400} />
      <circle cx="137" cy="58" r="12" fill={C.i300} stroke={C.i600} />
      <circle cx="117" cy="122" r="12" fill={C.i300} stroke={C.i600} />
      <circle cx="157" cy="122" r="12" fill={C.i300} stroke={C.i600} />
      <circle cx="237" cy="58" r="12" fill={C.i600} stroke={C.i800} />
      <circle cx="214" cy="122" r="12" fill={C.i600} stroke={C.i800} />
      <circle cx="260" cy="122" r="12" fill={C.r300} stroke={C.r600} />
    </g>
  </>
);

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
    <path d="M40,140 L280,140" className={HAIRLINE} strokeWidth={1.1} opacity={0.55} />
    <circle cx="120" cy="78" r="3.4" fill={C.i600} />
    <circle cx="205" cy="52" r="3.4" fill={C.r600} />
  </>
);

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

const Bars = () => (
  <>
    <g strokeWidth={1.3}>
      <rect x="50" y="134" width="14" height="6" rx="2" fill={C.i200} stroke={C.i600} />
      <rect x="70" y="130" width="14" height="10" rx="2" fill={C.i200} stroke={C.i600} />
      <rect x="90" y="122" width="14" height="18" rx="2" fill={C.i300} stroke={C.i600} />
      <rect x="110" y="110" width="14" height="30" rx="2" fill={C.i300} stroke={C.i700} />
      <rect x="130" y="88" width="14" height="52" rx="2" fill={C.i400} stroke={C.i700} />
      <rect x="150" y="62" width="14" height="78" rx="2" fill={C.r300} stroke={C.r700} />
      <rect x="170" y="82" width="14" height="58" rx="2" fill={C.i400} stroke={C.i700} />
      <rect x="190" y="106" width="14" height="34" rx="2" fill={C.i300} stroke={C.i700} />
      <rect x="210" y="120" width="14" height="20" rx="2" fill={C.i300} stroke={C.i600} />
      <rect x="230" y="129" width="14" height="11" rx="2" fill={C.i200} stroke={C.i600} />
      <rect x="250" y="133" width="14" height="7" rx="2" fill={C.i200} stroke={C.i600} />
    </g>
    <path d="M42,140 L278,140" className={HAIRLINE} strokeWidth={1.1} opacity={0.55} />
  </>
);

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

const CoverArt = ({ motif, className }: { motif: Motif; className?: string }) => {
  // useId's colons break a url(#…) reference.
  const arrow = `ca-arrow-${useId().replace(/:/g, "")}`;
  const Shape = MOTIFS[motif];

  return (
    <svg
      viewBox="0 0 320 180"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
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
      <rect width="320" height="180" className="fill-paper" />
      <Shape arrow={arrow} />
    </svg>
  );
};

export default CoverArt;
