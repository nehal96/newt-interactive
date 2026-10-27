// The essay's dark-classroom Patterson: walk every note's steps from the centre of a whiteboard and stick a sticker where you land.
import { useId } from "react";
import { useElementWidth } from "@hooks";
import { XR } from "../palette";
import { Labels } from "../scene";

type Kid = { x: number; y: number };

/** In steps; both squares span the same ±REACH so a note's arrow is the same length in the room and on the board. */
const REACH = 3.5;

const ROWS: Kid[] = [-1, 0, 1].flatMap((y) => [-1.5, -0.5, 0.5, 1.5].map((x) => ({ x, y })));

const SCATTERED: Kid[] = (() => {
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const kids: Kid[] = [];
  while (kids.length < ROWS.length) {
    const k = { x: (rand() - 0.5) * 3.4, y: (rand() - 0.5) * 2.2 };
    if (kids.every((o) => Math.hypot(o.x - k.x, o.y - k.y) > 0.55)) kids.push(k);
  }
  return kids;
})();

/** Every ordered pair's note, piled where it lands; landings closer than a hair count as one pile. */
function stickers(kids: Kid[]) {
  const piles = new Map<string, { x: number; y: number; n: number }>();
  for (const a of kids)
    for (const b of kids) {
      if (a === b) continue;
      const x = b.x - a.x;
      const y = b.y - a.y;
      const key = `${x.toFixed(2)},${y.toFixed(2)}`;
      const pile = piles.get(key);
      if (pile) pile.n += 1;
      else piles.set(key, { x, y, n: 1 });
    }
  return Array.from(piles.values());
}

const ROOMS = [
  { kids: ROWS, piles: stickers(ROWS), title: "Desks in rows", note: [5, 6] as const, says: "Sam is 1 step right of Ali", short: "1 step right" },
  { kids: SCATTERED, piles: stickers(SCATTERED), title: "Children scattered", note: [0, 1] as const, says: "one note, one lonely sticker", short: "one lonely sticker" },
];
const BIGGEST = Math.max(...ROOMS.flatMap((r) => r.piles.map((p) => p.n)));

function Arrow({ x0, y0, x1, y1, colour }: { x0: number; y0: number; x1: number; y1: number; colour: string }) {
  const a = Math.atan2(y1 - y0, x1 - x0);
  const h = 6;
  return (
    <g stroke={colour} strokeWidth={1.75} fill="none" strokeLinecap="round">
      <line x1={x0} y1={y0} x2={x1} y2={y1} />
      <path d={`M${x1 - h * Math.cos(a - 0.45)} ${y1 - h * Math.sin(a - 0.45)} L${x1} ${y1} L${x1 - h * Math.cos(a + 0.45)} ${y1 - h * Math.sin(a + 0.45)}`} />
    </g>
  );
}

export function Classroom() {
  const ids = useId();
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const narrow = W < 520;
  const text = narrow ? 10 : 11;
  const gap = narrow ? 28 : 48;
  const size = Math.min(260, (W - gap) / 2);
  const step = size / (2 * REACH);
  const boardX = size + gap;
  const rowH = size + 58;
  const H = ROOMS.length * rowH;

  return (
    <div ref={ref} className="w-full">
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="block" role="img" aria-labelledby={`${ids}t ${ids}d`}>
        <title id={`${ids}t`}>A dark classroom, its notes walked from the centre of a whiteboard</title>
        <desc id={`${ids}d`}>
          With desks in rows, many pairs of children are the same steps apart, so many notes send you to the same places and the
          stickers pile up. With children scattered, every note lands somewhere different and no pattern stands out.
        </desc>

        {ROOMS.map((room, r) => {
          const top = r * rowH + 22;
          const roomAt = (k: Kid) => ({ x: size / 2 + k.x * step, y: top + size / 2 - k.y * step });
          const boardAt = (x: number, y: number) => ({ x: boardX + size / 2 + x * step, y: top + size / 2 - y * step });
          const [ia, ib] = room.note;
          const A = roomAt(room.kids[ia]);
          const B = roomAt(room.kids[ib]);
          const centre = boardAt(0, 0);
          const land = boardAt(room.kids[ib].x - room.kids[ia].x, room.kids[ib].y - room.kids[ia].y);
          return (
            <g key={room.title}>
              <rect x={0} y={top} width={size} height={size} fill={XR.filmGrey} fillOpacity={0.5} stroke={XR.atom} strokeWidth={0.75} />
              {room.kids.map((k, i) => {
                const p = roomAt(k);
                return <circle key={i} cx={p.x} cy={p.y} r={6} fill={XR.sum} fillOpacity={i === ia || i === ib ? 1 : 0.55} />;
              })}
              <Arrow x0={A.x} y0={A.y} x1={B.x - (7 * (B.x - A.x)) / Math.hypot(B.x - A.x, B.y - A.y)} y1={B.y - (7 * (B.y - A.y)) / Math.hypot(B.x - A.x, B.y - A.y)} colour={XR.accent} />

              <path d={`M${size + 8} ${top + size / 2} h${gap - 16} m-5 -4 l5 4 l-5 4`} fill="none" stroke={XR.label} strokeWidth={1} />

              <rect x={boardX} y={top} width={size} height={size} fill={XR.film} stroke={XR.atom} strokeWidth={0.75} />
              {room.piles.map((p, i) => {
                const q = boardAt(p.x, p.y);
                return <circle key={i} cx={q.x} cy={q.y} r={step * (0.1 + 0.28 * Math.sqrt(p.n / BIGGEST))} fill={XR.first} fillOpacity={0.35 + (0.55 * p.n) / BIGGEST} />;
              })}
              <circle cx={centre.x} cy={centre.y} r={3} fill="none" stroke={XR.label} strokeWidth={1} />
              <Arrow x0={centre.x} y0={centre.y} x1={land.x} y1={land.y} colour={XR.accent} />

              <Labels size={text}>
                <text x={0} y={top - 8} fill={XR.sum}>
                  {room.title}
                </text>
                <text x={0} y={top + size + 16}>
                  {narrow ? "the dark classroom" : `the dark classroom: ${room.kids.length} children`}
                </text>
                <text x={boardX} y={top - 8} fill={XR.accent}>
                  {narrow ? room.short : room.says}
                </text>
                <text x={boardX} y={top + size + 16}>
                  {narrow ? `${room.kids.length * (room.kids.length - 1)} stickers` : `the whiteboard: ${room.kids.length * (room.kids.length - 1)} notes, one sticker each`}
                </text>
                {r === 0 && (
                  <>
                    <text x={centre.x - 6} y={centre.y + 16} textAnchor="end">
                      start
                    </text>
                    <text x={land.x} y={land.y + 24} textAnchor="middle" fill={XR.accent}>
                      {`${room.piles.find((p) => Math.hypot(p.x - 1, p.y) < 0.01)?.n ?? 0}${narrow ? " here" : " notes land here"}`}
                    </text>
                  </>
                )}
              </Labels>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
