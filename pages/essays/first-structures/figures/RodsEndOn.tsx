// Perutz's Patterson map seen down the rods (1949 fig. 21), then the rods in 3D (fig. 22) and the layered chains he read into them, end-on (fig. 23b).
import { useElementWidth } from "@hooks";
import { XR } from "./palette";

/** The fig. 21 scan's size in pixels, and its rod peaks in those pixels. */
const MAP = { w: 560, h: 900 };
const PEAKS = [
  { x: 155, y: 295 },
  { x: 388, y: 295 },
  { x: 112, y: 447 },
  { x: 430, y: 447 },
  { x: 155, y: 600 },
  { x: 388, y: 600 },
];
const PEAK_R = 38;
const RODS = { w: 1384, h: 798 };
const LAYERS = { w: 900, h: 530 };

export function RodsEndOn() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const text = W < 520 ? 10 : 11;
  const wide = W >= 560;
  const head = 18;
  const arrow = 48;
  const gap = 44;

  const rightW = wide ? (W - arrow) * 0.62 : W;
  const rodsW = rightW;
  const rodsH = (RODS.h / RODS.w) * rodsW;
  const layersW = rightW * 0.72;
  const layersH = (LAYERS.h / LAYERS.w) * layersW;
  const rightH = head + rodsH + gap + head + layersH;

  const mapH = wide ? Math.min(rightH - head, (((W - arrow - rightW) * 0.95) * MAP.h) / MAP.w) : Math.min(330, W * 0.62 * (MAP.h / MAP.w));
  const mapW = (MAP.w / MAP.h) * mapH;
  const k = mapW / MAP.w;

  const mapX = wide ? (W - arrow - rightW - mapW) / 2 : (W - mapW) / 2;
  const mapY = wide ? head + (rightH - head - mapH) / 2 : head;
  const rightX = wide ? W - rightW : 0;
  const rodsY = wide ? head : head + mapH + 48 + head;
  const layersY = rodsY + rodsH + gap + head;
  const layersX = rightX + (rightW - layersW) / 2;
  const H = layersY + layersH + 4;

  const down = (x: number, y0: number, y1: number) => (
    <>
      <line x1={x} x2={x} y1={y0} y2={y1 - 8} />
      <path d={`M${x} ${y1} l-4.5 -8 h9 z`} />
    </>
  );

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-label="Perutz's Patterson map seen down the rods, six rod peaks ringed; his drawing of the same rods in three dimensions; and the chains he read into them, stacked in layers and seen end-on."
      >
        <image href="/images/first-structures/perutz-1949-fig21.png" x={mapX} y={mapY} width={mapW} height={mapH} style={{ mixBlendMode: "multiply" }} />
        <g fill="none" stroke={XR.accent} strokeWidth={1.5}>
          {PEAKS.map((p) => (
            <circle key={`${p.x}-${p.y}`} cx={mapX + p.x * k} cy={mapY + p.y * k} r={PEAK_R * k} />
          ))}
        </g>
        <image href="/images/first-structures/perutz-1949-rods.png" x={rightX} y={rodsY} width={rodsW} height={rodsH} style={{ mixBlendMode: "multiply" }} />
        <image href="/images/first-structures/perutz-1949-fig23b.png" x={layersX} y={layersY} width={layersW} height={layersH} style={{ mixBlendMode: "multiply" }} />

        <g stroke={XR.label} strokeWidth={1.25} fill={XR.label}>
          {wide ? (
            <>
              <line x1={mapX + mapW + 8} x2={rightX - 12} y1={rodsY + rodsH / 2} y2={rodsY + rodsH / 2} />
              <path d={`M${rightX - 4} ${rodsY + rodsH / 2} l-8 -4.5 v9 z`} />
            </>
          ) : (
            down(W / 2, mapY + mapH + 8, rodsY - head - 2)
          )}
          {down(rightX + rightW / 2, rodsY + rodsH + 8, layersY - head - 2)}
        </g>
        <g className="font-mono" fontSize={text} textAnchor="middle">
          <text x={mapX + mapW / 2} y={mapY - 6} fill={XR.accent}>
            the map, down the rods
          </text>
          <text x={rightX + rightW / 2} y={rodsY - 6} fill={XR.label}>
            the same rods, drawn in 3D
          </text>
          <text x={rightX + rightW / 2} y={layersY - 6} fill={XR.label}>
            his reading: chains in layers, end-on
          </text>
        </g>
      </svg>
    </div>
  );
}
