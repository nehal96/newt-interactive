// Reusable SVG atom primitive for the hemoglobin anatomy build-up (iron →
// pyrrole → porphyrin → heme). The annotated SVG is the *flat schematic* side of
// each beat (the Mol* pane carries the shaded 3D look), so atoms default to a
// flat fill with a hairline rim for definition. A "shaded" variant (radial
// shading + specular + contact shadow) is kept available for one-off uses.

export type Element = "Fe" | "C" | "N" | "O" | "H";

// Muted CPK palette — base (flat fill), light (highlight), rim (edge).
export const ATOM_PALETTE: Record<
  Element,
  { base: string; light: string; rim: string; name: string }
> = {
  Fe: { base: "#E0762E", light: "#F8BC8B", rim: "#A8531A", name: "Iron" },
  C: { base: "#D9D8CF", light: "#F3F2EC", rim: "#B4B3A9", name: "Carbon" },
  N: { base: "#3F71D8", light: "#8BAAF1", rim: "#2A4FA6", name: "Nitrogen" },
  O: { base: "#E2533C", light: "#F59781", rim: "#B23A28", name: "Oxygen" },
  H: { base: "#EFEEE9", light: "#FFFFFF", rim: "#CDCCC4", name: "Hydrogen" },
};

type AtomSphereProps = {
  cx: number;
  cy: number;
  r: number;
  element: Element;
  /** Unique within the parent <svg> — gradients/filters are namespaced by it. */
  id?: string;
  variant?: "flat" | "shaded";
};

export default function AtomSphere({
  cx,
  cy,
  r,
  element,
  id = "",
  variant = "flat",
}: AtomSphereProps) {
  const p = ATOM_PALETTE[element];

  if (variant === "flat") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={p.base}
        stroke={p.rim}
        strokeOpacity={0.45}
        strokeWidth={1.25}
      />
    );
  }

  const grad = `atom-grad-${id}`;
  const spec = `atom-spec-${id}`;
  const shadow = `atom-shadow-${id}`;
  return (
    <g>
      <defs>
        <radialGradient id={grad} cx="35%" cy="32%" r="75%">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="55%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.rim} />
        </radialGradient>
        <radialGradient id={spec} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <filter id={shadow} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation={r * 0.09} />
        </filter>
      </defs>
      <ellipse
        cx={cx}
        cy={cy + r * 0.92}
        rx={r * 0.8}
        ry={r * 0.2}
        fill="#000000"
        opacity={0.1}
        filter={`url(#${shadow})`}
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#${grad})`}
        stroke={p.rim}
        strokeOpacity={0.35}
        strokeWidth={1}
      />
      <ellipse
        cx={cx - r * 0.3}
        cy={cy - r * 0.36}
        rx={r * 0.42}
        ry={r * 0.3}
        fill={`url(#${spec})`}
        transform={`rotate(-20 ${cx - r * 0.3} ${cy - r * 0.36})`}
      />
    </g>
  );
}
