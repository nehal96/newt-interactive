// Annotated SVG counterpart to the Mol* 3D iron atom — the first beat of the
// anatomy build-up. A single labeled iron sphere (flat schematic); later beats
// add the pyrrole ring, the porphyrin, and the protein, reusing <AtomSphere> +
// a <Bond>.
import AtomSphere from "./AtomSphere";

export default function AnnotatedIron({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 340 320"
      className={className}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-labelledby="annotated-iron-title annotated-iron-desc"
      fontFamily="inherit"
    >
      <title id="annotated-iron-title">Iron atom</title>
      <desc id="annotated-iron-desc">
        A single ferrous iron (Fe2+) atom — the center of the heme group, where
        oxygen binds.
      </desc>

      {/* Leader from the label toward the sphere, stopping short of it. */}
      <line x1="238" y1="95" x2="212" y2="118" stroke="#94a3b8" strokeWidth="1.5" />

      {/* Label pill (hairline border, no shadow). */}
      <rect
        x="224"
        y="60"
        width="104"
        height="34"
        rx="17"
        fill="#ffffff"
        stroke="#e2e8f0"
        strokeWidth="1"
      />
      <text
        x="276"
        y="82"
        textAnchor="middle"
        fontSize="16"
        fontWeight="500"
        fill="#334155"
      >
        Iron (Fe²⁺)
      </text>

      <AtomSphere cx={150} cy={172} r={74} element="Fe" />
    </svg>
  );
}
