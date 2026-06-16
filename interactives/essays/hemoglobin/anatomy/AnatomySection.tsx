import { H2, Paragraph } from "../../../../components";
import type { Beat } from "./beats";
import PartsManifest from "./PartsManifest";
import AnatomyBeatBlock from "./AnatomyBeatBlock";

/**
 * Section 1 of the essay — the anatomy of hemoglobin — as a flowing read rather
 * than a stepper: prose, then the LEGO-style parts manifest, then the build-up
 * beat by beat, each interactive sitting inline right where the prose introduces
 * it. Clicking a linkable part in the manifest scrolls to its beat below. The
 * build-up stops at the assembled heme group, before the alpha/beta chains.
 */
export default function AnatomySection() {
  const scrollToBeat = (beat: Beat) => {
    document
      .getElementById(`beat-${beat}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <H2 className="mt-8">Anatomy of hemoglobin</H2>
      <Paragraph>
        To understand the function of a molecule, we must first understand its
        form. Let&rsquo;s do that by putting hemoglobin together piece by piece.
        Here are its parts and components, laid out like a LEGO-inspired
        manifest:
      </Paragraph>

      <PartsManifest onSelectPart={scrollToBeat} />

      <Paragraph>
        Let&rsquo;s start by assembling the heme group, the part that catches and
        releases oxygen. Each hemoglobin molecule has four of them, and each heme
        group can carry one oxygen molecule &mdash; so a single hemoglobin
        carries four oxygen molecules in all.
      </Paragraph>

      <Paragraph>
        We begin with the ferrous iron ion, sitting right at the center.
      </Paragraph>
      <AnatomyBeatBlock beat="iron" id="beat-iron" />

      <Paragraph>
        To this, let&rsquo;s attach &mdash; bond &mdash; a single pyrrole: a
        five-membered ring with a nitrogen pointing inward, toward the iron.
      </Paragraph>
      <AnatomyBeatBlock beat="pyrrole" id="beat-pyrrole" />

      <Paragraph>
        Surrounding the iron with four pyrroles, each joined to the next by a
        methine bridge, creates the porphyrin ring &mdash; a flat macrocycle with
        the iron clasped at its center.
      </Paragraph>
      <AnatomyBeatBlock beat="porphyrin" id="beat-porphyrin" />

      <Paragraph>
        At the &ldquo;back&rdquo; of this ring sits the proximal histidine, an
        amino acid that anchors the heme to the rest of the structure &mdash; to
        either an alpha or a beta chain. It bonds to the iron from below, the
        fifth of its six connections.
      </Paragraph>
      <AnatomyBeatBlock beat="proximalHis" id="beat-proximalHis" />

      <Paragraph>
        And hovering just above the ring is the distal histidine, so named
        because it sits a little further away. It belongs to the same chain, and
        both histidines have crucial roles to play in catching and releasing
        oxygen.
      </Paragraph>
      <AnatomyBeatBlock beat="distalHis" id="beat-distalHis" />

      <Paragraph>
        This whole assembly together &mdash; the iron, the porphyrin ring with
        the methyl, vinyl, and propionate groups decorating its rim, and the two
        flanking histidines &mdash; makes up one complete heme pocket.
      </Paragraph>

      <Paragraph>
        And a single hemoglobin molecule cradles four of these heme pockets,
        clasped in their real positions &mdash; two from the alpha chains and two
        from the beta chains, set diametrically across the molecule:
      </Paragraph>
      <AnatomyBeatBlock beat="fourHemes" id="beat-fourHemes" />
    </>
  );
}
