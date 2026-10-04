// The X-ray camera: side view of the setup, the crystal's mount, and a film it produced.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "./palette";
import { Labels } from "./scene";

const PHOTO = { src: "/images/first-structures/bernal-1938-haemoglobin.jpg", aspect: 576 / 436 };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function SideView({ W, top, text }: { W: number; top: number; text: number }) {
  const by = top + 92;
  const tubeW = clamp(W * 0.15, 56, 110);
  const filterX = tubeW + W * 0.05;
  const colX0 = filterX + W * 0.04;
  const colX1 = colX0 + W * 0.12;
  const xc = W * 0.55;
  const filmX = W - 8;
  const stopX = filmX - Math.max(20, W * 0.06);
  const rays = [-58, -40, -22, 22, 40, 58];

  return (
    <g>
      <rect x={1} y={by - 30} width={tubeW - 2} height={60} rx={6} fill={XR.card} stroke={XR.label} strokeWidth={1.25} />
      <rect x={tubeW - 16} y={by - 10} width={8} height={20} rx={1} fill={XR.second} />

      <g stroke={XR.first} strokeWidth={2.5}>
        <line x1={tubeW - 8} x2={xc - 12} y1={by} y2={by} />
        <line x1={xc + 6} x2={stopX} y1={by} y2={by} strokeOpacity={0.55} />
      </g>
      <path d={`M${xc - 6} ${by} l-10 -5.5 v11 z`} fill={XR.first} />

      <rect x={filterX - 1.5} y={by - 14} width={3} height={28} fill={XR.atom} />
      <rect x={colX0} y={by - 8} width={colX1 - colX0} height={16} rx={2} fill="none" stroke={XR.label} strokeWidth={1.25} />

      <g stroke={XR.first} strokeWidth={1} strokeOpacity={0.5}>
        {rays.map((t) => (
          <line key={t} x1={xc} y1={by} x2={filmX - 3} y2={by + t} />
        ))}
      </g>

      <rect x={xc - 4} y={by - 44} width={8} height={74} rx={4} fill={XR.film} fillOpacity={0.6} stroke={XR.label} strokeWidth={1} />
      <path d={`M${xc - 3} ${by - 3} l3 -4 l3 4 l-3 5 z`} fill={XR.sum} />
      <path d={`M${xc - 9} ${by + 30} h18 l-4 14 h-10 z`} fill={XR.atom} />
      <line x1={xc} x2={xc} y1={by + 44} y2={by + 74} stroke={XR.label} strokeWidth={2} />
      <path
        d={`M${xc - 16} ${by + 62} A 16 6 0 0 0 ${xc + 16} ${by + 62}`}
        fill="none"
        stroke={XR.label}
        strokeWidth={1.25}
      />
      <path d={`M${xc - 16} ${by + 62} l-1 -6 l5 3 z M${xc + 16} ${by + 62} l1 -6 l-5 3 z`} fill={XR.label} />

      <rect x={stopX} y={by - 6} width={5} height={12} rx={1} fill={XR.label} />
      <rect x={filmX - 3} y={by - 70} width={6} height={140} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
      <g fill={XR.sum}>
        {rays.map((t) => (
          <circle key={t} cx={filmX} cy={by + t} r={2} />
        ))}
      </g>

      <g stroke={XR.label} strokeWidth={1}>
        <line x1={xc} x2={filmX} y1={by + 90} y2={by + 90} />
        <line x1={xc} x2={xc} y1={by + 86} y2={by + 94} />
        <line x1={filmX} x2={filmX} y1={by + 86} y2={by + 94} />
      </g>

      <Labels size={text}>
        <text x={2} y={by + 46}>X-ray tube</text>
        <text x={2} y={by + 46 + text + 3}>(copper)</text>
        <text x={filterX} y={by - 40} textAnchor="middle">nickel filter</text>
        {W < 560 ? (
          <>
            <text x={(colX0 + colX1) / 2} y={by + 26} textAnchor="middle">narrow</text>
            <text x={(colX0 + colX1) / 2} y={by + 26 + text + 3} textAnchor="middle">tube</text>
          </>
        ) : (
          <text x={(colX0 + colX1) / 2} y={by + 26} textAnchor="middle">narrow tube</text>
        )}
        <text x={xc} y={by - 52} textAnchor="middle">crystal in a glass tube</text>
        <text x={xc + 22} y={by + 70}>rocked 3–5°</text>
        <text x={stopX + 5} y={by + 24} textAnchor="end">beam stop</text>
        <text x={filmX + 3} y={by - 78} textAnchor="end">flat film</text>
        <text x={(xc + filmX) / 2} y={by + 106} textAnchor="middle">5–10 cm</text>
      </Labels>
    </g>
  );
}

/** Redrawn from Boyes-Watson, Davidson & Perutz (1947), fig. 1: wet crystal sealed in a capillary. */
function Mount({ x, y, w, h, text }: { x: number; y: number; w: number; h: number; text: number }) {
  const bore = Math.min(26, w * 0.18);
  const tx = x + Math.min(30, w * 0.2);
  const plug = h * 0.09;
  const liquidTop = y + h * 0.33;
  const liquidBottom = y + h * 0.66;
  const cy = y + h * 0.5;
  const lx = tx + bore + 14;
  const label = (yy: number, s: string, accent = false) => (
    <g>
      <line x1={tx + bore + 3} x2={lx - 4} y1={yy} y2={yy} stroke={XR.atom} strokeWidth={0.75} />
      <text x={lx} y={yy + 4} fill={accent ? XR.sum : XR.label}>
        {s}
      </text>
    </g>
  );
  return (
    <g>
      <rect x={tx} y={y + plug} width={bore} height={liquidTop - y - plug} fill={XR.first} fillOpacity={0.16} />
      <rect x={tx} y={liquidBottom} width={bore} height={y + h - plug - liquidBottom} fill={XR.first} fillOpacity={0.16} />
      <rect x={tx} y={y + plug * 0.6} width={bore} height={h - plug * 1.2} fill="none" stroke={XR.label} strokeWidth={1.25} />
      <rect x={tx - 4} y={y} width={bore + 8} height={plug} rx={4} fill={XR.sum} />
      <rect x={tx - 4} y={y + h - plug} width={bore + 8} height={plug} rx={4} fill={XR.sum} />
      <path
        d={`M${tx + bore - 1} ${cy - 9} l-7 3 l-1 9 l8 4 z`}
        fill={XR.moleculeEdge}
        stroke={XR.sum}
        strokeWidth={0.75}
      />
      <g stroke={XR.label} strokeWidth={1}>
        <line x1={tx} x2={tx + bore} y1={y + h + 14} y2={y + h + 14} />
        <line x1={tx} x2={tx} y1={y + h + 10} y2={y + h + 18} />
        <line x1={tx + bore} x2={tx + bore} y1={y + h + 10} y2={y + h + 18} />
      </g>
      <Labels size={text}>
        {label(y + plug / 2, "seal")}
        {label((y + plug + liquidTop) / 2, "its liquid")}
        {label(cy, "crystal", true)}
        {label((liquidBottom + y + h - plug) / 2, "its liquid")}
        {label(y + h - plug / 2, "seal")}
        <text x={tx + bore / 2} y={y + h + 32} textAnchor="middle">
          1 mm
        </text>
      </Labels>
    </g>
  );
}

export function Camera() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 560;
  const text = narrow ? 10 : 11;
  const head = narrow ? 11 : 12;
  const sideH = 210;

  const rowTop = sideH + 34;
  let photo: { x: number; y: number; w: number };
  let mount: { x: number; y: number; w: number; h: number };
  if (!narrow) {
    photo = { x: W * 0.62, y: rowTop, w: W * 0.34 };
    mount = { x: W * 0.3, y: rowTop, w: W * 0.26, h: (W * 0.34) / PHOTO.aspect - 40 };
  } else {
    photo = { x: W * 0.48, y: rowTop, w: W * 0.52 };
    mount = { x: 0, y: rowTop, w: W * 0.46, h: Math.max(140, (W * 0.52) / PHOTO.aspect - 40) };
  }
  const photoH = photo.w / PHOTO.aspect;
  const H = rowTop + Math.max(photoH + 30, mount.h + 40);

  const xc = W * 0.55;
  const by = 92;
  const headerY = (y: number) => y - 12;

  return (
    <div ref={ref} className="w-full">
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="block"
        role="img"
        aria-labelledby={`${ids}t ${ids}d`}
      >
        <title id={`${ids}t`}>
          X-rays pass through a crystal and leave spots on a film.
        </title>
        <desc id={`${ids}d`}>
          Side view of an X-ray camera: a copper X-ray tube, a nickel filter, a pinhole
          collimator, a crystal in a glass capillary on a mount that rocks a few degrees,
          a small beam stop and a flat film 5 to 10 centimetres behind. Below: the
          capillary close up, with picein seals at both ends, liquid in each end and the
          crystal clear of it; and a photograph of a wet hemoglobin crystal published in
          1938, dark spots scattered around a clear centre.
        </desc>
        <defs>
          <clipPath id={`${ids}p`}>
            <rect x={photo.x} y={photo.y} width={photo.w} height={photoH} />
          </clipPath>
        </defs>

        <SideView W={W} top={0} text={text} />

        <g stroke={XR.atom} strokeWidth={0.75} strokeDasharray="3 3" fill="none">
          <path d={`M${xc - 4} ${by + 30} L${mount.x + Math.min(30, mount.w * 0.2) - 4} ${mount.y - 26}`} />
          <path d={`M${W - 8} ${by + 70} L${photo.x + photo.w / 2} ${photo.y - 26}`} />
        </g>

        {[
          { x: mount.x + mount.w / 2, y: mount.y, s: "The glass tube" },
          { x: photo.x + photo.w / 2, y: photo.y, s: narrow ? "A photograph, 1938" : "A real photograph, 1938" },
        ].map(({ x, y, s }) => (
          <text key={s} x={x} y={headerY(y)} textAnchor="middle" className="font-ui" fontSize={head} fontWeight={600} fill={XR.sum}>
            {s}
          </text>
        ))}

        <Mount x={mount.x} y={mount.y} w={mount.w} h={mount.h} text={text} />
        <image
          href={PHOTO.src}
          x={photo.x}
          y={photo.y}
          width={photo.w}
          height={photoH}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${ids}p)`}
        />
        <rect x={photo.x} y={photo.y} width={photo.w} height={photoH} fill="none" stroke={XR.atom} strokeWidth={0.75} />
        <Labels size={text}>
          <text x={photo.x + photo.w / 2} y={photo.y + photoH + 18} textAnchor="middle">
            hemoglobin, rocked 5°
          </text>
        </Labels>
      </svg>
    </div>
  );
}
