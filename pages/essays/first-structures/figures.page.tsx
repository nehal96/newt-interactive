// Every figure in the essay, in order, labelled with the file that draws it.
import type { ReactNode } from "react";
import Head from "next/head";
import { MdxLayout } from "@ui/article";
import {
  Figure,
  Plate,
  TwoWaves,
  WhySpots,
  LinedUp,
  Camera,
  SaltPair,
  FourBumps,
  PattersonRods,
  ReadingTheFilm,
  TwoHeavyAtoms,
  SheetStack,
  PerutzModel,
} from "./figures";
import meta from "./meta";

const metadata = {
  ...meta,
  kind: undefined,
  published: undefined,
  title: "Solving the First Protein Structures: figures",
  subtitle: (
    <>
      The essay’s figures, in order. Each is a React component in{" "}
      <code className="font-mono text-[0.9em]">figures/</code>.
    </>
  ),
  url: `${meta.url}/figures`,
};

type Entry = {
  id: string;
  file: string;
  section: string;
  /** In the essay this floats beside the prose at this width on desktop. */
  side?: "20rem" | "16rem";
  figure: ReactNode;
};

const FIGURES: Entry[] = [
  {
    id: "two-waves",
    file: "TwoWaves.tsx",
    section: "X-Rays",
    figure: (
      <Figure
        title="How waves interact"
        subtitle="Waves in step add up to a taller wave; waves half a wave apart cancel out."
      >
        <TwoWaves />
      </Figure>
    ),
  },
  {
    id: "why-spots",
    file: "WhySpots.tsx",
    section: "X-Rays",
    figure: (
      <Figure
        title="Why a crystal makes spots"
        subtitle="When x-rays hit an atom, its electrons emit x-rays of their own. Where those waves meet on the film, they add up or cancel, depending on how far each one has traveled."
        caption="Not to scale. In part 2, the spots sit where they did in Bernal’s 1938 photograph of hemoglobin."
      >
        <WhySpots />
      </Figure>
    ),
  },
  {
    id: "lined-up",
    file: "LinedUp.tsx",
    section: "The Big Idea",
    figure: (
      <Figure title="The film can’t tell you how to line up the waves">
        <LinedUp />
      </Figure>
    ),
  },
  {
    id: "camera",
    file: "Camera.tsx",
    section: "The Phase Problem",
    figure: (
      <Figure
        title="Perutz’s x-ray crystallography setup"
        subtitle="A nickel filter lets through x-rays of just one wavelength. The crystal, sealed in a glass tube, is rocked a few degrees to catch more spots."
        caption="Not to scale. Based on Perutz and Rogers (1946) and Boyes-Watson, Davidson and Perutz (1947). Photograph: Bernal, Fankuchen and Perutz, Nature, 1938."
      >
        <Camera />
      </Figure>
    ),
  },
  {
    id: "salt-pair",
    file: "SaltPair.tsx",
    section: "The Phase Problem",
    side: "20rem",
    figure: (
      <Figure
        title="Salt tells you which way to flip each wave"
        subtitle="Salt changes only the liquid’s wave, which Perutz could work out. Where it is in step with the protein’s wave, the spot gets darker; where it is opposed, fainter."
        caption="The liquid’s wave is drawn at half the height of the protein’s. Based on Boyes-Watson and Perutz (1943)."
      >
        <SaltPair />
      </Figure>
    ),
  },
  {
    id: "four-bumps",
    file: "FourBumps.tsx",
    section: "The Phase Problem",
    side: "20rem",
    figure: (
      <Figure
        title="The first look inside hemoglobin"
        subtitle="Adding the seven waves gave the amount of matter at each depth through one layer. Changing the liquid changed only the edges; the four bumps stayed put."
        caption="Computed from the seven spots in Boyes-Watson, Davidson and Perutz (1947)."
      >
        <FourBumps />
      </Figure>
    ),
  },
  {
    id: "patterson-rods",
    file: "PattersonRods.tsx",
    section: "The Phase Problem",
    figure: (
      <Plate
        title="The rods in Perutz’s map"
        subtitle="Seen straight down Perutz’s Patterson map, each ringed peak is the end of a rod. Drawn in 3D, the rods all run the same way, so Perutz read them as protein chains lying side by side in layers."
        caption="Perutz, Proc. R. Soc. A 195, 1949, fig. 21 (reprinted from Boyes-Watson, Davidson and Perutz, 1947, fig. 3a; rings added), fig. 22 and fig. 23b."
      >
        <PattersonRods />
      </Plate>
    ),
  },
  {
    id: "mercury",
    file: "ReadingTheFilm.tsx",
    section: "Heavy Atoms",
    side: "16rem",
    figure: (
      <Figure
        title="What mercury does to the spots"
        subtitle="The spots stay where they are, because the unit cell is the same. But the heavy atom’s wave makes some darker and others fainter."
      >
        <ReadingTheFilm group="mercury" />
      </Figure>
    ),
  },
  {
    id: "two-heavy-atoms",
    file: "TwoHeavyAtoms.tsx",
    section: "Heavy Atoms",
    side: "20rem",
    figure: (
      <Figure
        title="Why one heavy atom isn’t enough"
        subtitle="If the protein’s wave is a little ahead of the mercury’s, or the same amount behind, the spot changes the same way. A second heavy atom, in another place, tells the two apart."
        caption="The heavy atoms’ waves are drawn at half the height of the protein’s. Based on Bokhoven, Schoone and Bijvoet (1951) and Harker (1956)."
      >
        <TwoHeavyAtoms />
      </Figure>
    ),
  },
  {
    id: "sheet-stack",
    file: "SheetStack.tsx",
    section: "Heavy Atoms",
    figure: (
      <Figure
        title="Kendrew’s 6 Å contour maps of myoglobin"
        subtitle="Each slice is a contour map of one plane through the crystal. The rings crowd together where there are most electrons, and the densest patch of all is the heme."
        caption="Eight of the sixteen slices; the other eight are the same slices turned over. Stacked farther apart than the real 1.93 Å, so each one shows. Traced from Bodo, Dintzis, Kendrew and Wyckoff (1959), figure 18."
      >
        <SheetStack />
      </Figure>
    ),
  },
  {
    id: "perutz-model",
    file: "PerutzModel.tsx",
    section: "Heavy Atoms",
    figure: (
      <Figure
        title="Perutz’s model of human hemoglobin"
        subtitle="In 1967 Perutz built this model from painted wood, the way he built his first in 1959: each slice of the map cut out and stacked. The two kinds of chain are black and white, and each heme is a red disk."
        caption="Rebuilt from the modern structure of human hemoglobin (PDB 2HHB), blurred to 5.5 Å and cut into 2 Å slices as Perutz described in 1960. The original is at the Science Museum, London."
      >
        <PerutzModel />
      </Figure>
    ),
  },
];

export default function FiguresPage() {
  return (
    <MdxLayout metadata={metadata}>
      <Head>
        <meta name="robots" content="noindex" />
      </Head>
      <ol className="grid w-full max-w-prose gap-1 self-center font-mono text-xs text-ink-500 sm:grid-cols-2">
        {FIGURES.map((f, i) => (
          <li key={f.id}>
            <a className="hover:text-ink-900" href={`#${f.id}`}>
              {i + 1}. {f.file}
            </a>
          </li>
        ))}
      </ol>
      {FIGURES.map((f, i) => (
        <section
          key={f.id}
          id={f.id}
          className="mt-16 flex w-full max-w-prose flex-col self-center border-t border-ink-200 pt-4"
        >
          <p className="font-mono text-xs text-ink-500">
            {i + 1}. {f.file} · {f.section}
            {f.side && ` · beside the prose, ${f.side} wide`}
          </p>
          <div className="flex flex-col" style={f.side ? { maxWidth: f.side } : undefined}>
            {f.figure}
          </div>
        </section>
      ))}
    </MdxLayout>
  );
}
