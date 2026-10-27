// The lab's question chain: each section answers one question and hands on to the next.
import { type ReactNode } from "react";
import { H3 } from "@ui/prose";

type Section = { q: string; payoff?: string; act?: string };

export const SECTIONS: Section[] = [
  { q: "What is the experiment?", act: "I. How does a molecule make spots?" },
  { q: "What is an x-ray?" },
  { q: "What happens when two waves meet?" },
  { q: "Where do the waves on the film come from?" },
  { q: "What do two atoms do together?" },
  { q: "What does a whole row of atoms do?" },
  { q: "What does a crystal do?", payoff: "Spot positions measure the unit cell." },
  { q: "What sets how dark a spot is?" },
  {
    q: "What pattern do the darknesses follow?",
    payoff: "Spot darknesses are a coded picture of the molecule.",
  },
  { q: "What would running it backwards mean?", act: "II. Can we run it backwards?" },
  { q: "How does a spot point back into the box?" },
  {
    q: "So what is missing?",
    payoff: "Each spot is a sheet of stripes; the film keeps how fine and bold, not where it goes. The phase problem.",
  },
  { q: "Can you line them up by hand?" },
  { q: "How do you learn which way up each wave goes?", act: "III. How did they find the phases?" },
  { q: "Why only one column of spots, and what did it show?" },
  { q: "Can you get anything without the flips?" },
  { q: "How did mercury give the flips for a whole view?" },
  { q: "Why wasn’t one heavy atom enough?" },
  {
    q: "How did the map finally appear?",
    payoff: "Measured phases, added on a computer, turned spots into an electron density map, and the map into a model.",
  },
];

const anchor = (n: number) => `q${n}`;

export function ChainMap() {
  return (
    <ol className="my-8 w-full max-w-prose self-center rounded-xl bg-card px-5 py-4 font-ui text-sm leading-6 text-ink-700">
      {SECTIONS.map(({ q, payoff, act }, i) => (
        <li key={q} className="flex flex-wrap gap-x-3">
          {act && <span className={`w-full font-semibold text-ink-800 ${i ? "mt-3" : ""}`}>{act}</span>}
          <span className="w-5 shrink-0 text-right font-mono text-ink-400">{i + 1}</span>
          <span className="min-w-0 flex-1">
            <a href={`#${anchor(i + 1)}`} className="hover:text-ink-900 hover:underline">
              {q}
            </a>
            {payoff && <span className="block text-rose-600">→ {payoff}</span>}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** A section's heading: its number and its question. */
export function Q({ n }: { n: number }) {
  return (
    <H3 id={anchor(n)} className="mt-14">
      <span className="mr-3 font-mono text-base text-ink-400">{n}</span>
      {SECTIONS[n - 1].q}
    </H3>
  );
}

/** The question a section leaves open, linked to the section that answers it. */
export function Next({ n, children }: { n: number; children: ReactNode }) {
  const next = SECTIONS[n - 1];
  return (
    <div className="mb-6 mt-2 w-full max-w-prose self-center border-t border-ink-200 pt-4 font-ui text-sm leading-6 text-ink-500">
      <p>{children}</p>
      {next && (
        <a href={`#${anchor(n)}`} className="mt-1 inline-block text-ink-800 hover:underline">
          → {n}. {next.q}
        </a>
      )}
    </div>
  );
}

export function Payoff({ children }: { children: ReactNode }) {
  return (
    <p className="my-6 w-full max-w-prose self-center rounded-xl bg-card px-5 py-4 font-ui text-sm leading-6 text-ink-800">
      <span className="font-semibold text-rose-600">Payoff. </span>
      {children}
    </p>
  );
}
