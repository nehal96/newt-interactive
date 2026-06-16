import { H2, Paragraph } from "../../../../components";
import MorphFigure, { BINDING_MORPH_URL, LEAN_MORPH_URL } from "./MorphFigure";

/**
 * Section 2 of the essay — how hemoglobin catches oxygen — as a flowing read in
 * the author's own voice (lightly cleaned from the notebook). The six-coordinate
 * "open seat" setup now lives in the anatomy section's proximal-His beat, and the
 * αβ-dimer and distal-His introductions there are invoked as callbacks rather than
 * re-taught here. Three interactives slot inline: the O₂-binding morph (the pull),
 * a static T↔R switch diagram, and a close-up of the bound O₂ at its 120° lean.
 * See docs/hemoglobin-essay-plan.md §2 for the beat-by-beat plan.
 */

/** A labeled stand-in for an interactive that isn't wired yet. */
function VisualPlaceholder({ label }: { label: string }) {
  return (
    <figure className="my-8 w-full lg:my-12">
      <div className="flex h-[300px] w-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-6 text-center text-sm text-slate-400 lg:h-[360px]">
        {label}
      </div>
    </figure>
  );
}

export default function CatchingSection() {
  return (
    <>
      <H2 className="mt-8">How hemoglobin catches oxygen</H2>

      {/* --- The pull (the trigger) --- */}
      <Paragraph>
        Oxygen binds in that open sixth spot. When it docks, it pulls the iron
        toward it. Before oxygen arrives, the iron sits a little behind the plane
        of the heme &mdash; about half an &aring;ngstr&ouml;m off. Oxygen pulls it
        into the ring. And because the iron is tethered to the proximal histidine,
        which is connected to the rest of the protein chain, that chain gets
        tugged too. This shift presses on the neighboring subunits, nudging them
        to open up and grab oxygen more easily. So the bonding of one oxygen sends
        a mechanical signal to the rest of the protein.
      </Paragraph>

      <MorphFigure url={BINDING_MORPH_URL} />

      {/* high-spin / low-spin — kept in the main line for now; a candidate
          footnote in the later edit pass. */}
      <Paragraph>
        You might be wondering how a tiny oxygen molecule can &ldquo;pull&rdquo; a
        huge iron atom. When oxygen binds, the iron&rsquo;s spin state shifts and
        it actually becomes a little smaller &mdash; small enough to slip into the
        plane of the ring.
      </Paragraph>

      {/* --- Why one oxygen makes the next easier (T → R) --- */}
      <Paragraph>
        How, exactly, does one oxygen bonding and tugging make it easier for the
        other three to bind? When no oxygen is bound, hemoglobin is in a tense (T)
        state, and its structure is quite rigid. What holds it rigid is a network
        of salt bridges &mdash; little electrostatic clasps formed between a
        positively charged amino-acid side chain and a negatively charged one
        nearby. A set of these clasps, mostly around the tail ends of the chains
        and near the joints between subunits, keeps the empty molecule in its
        low-appetite, tense state. The first oxygen is thus the hardest to bind; it
        needs the most effort &mdash; the most activation energy &mdash; to get in.
      </Paragraph>

      <Paragraph>
        Recall the two alpha and two beta chains, paired into two
        alpha&ndash;beta dimers. Within each half, the pieces barely shift against
        each other. But between the two halves, there&rsquo;s room for a very
        particular, switch-like movement. Essentially, there are two stable states.
        One, as we just described, is the tense state. The other is the relaxed (R)
        state, separated by a 15-degree rotation of one half against the other.
        There is no intermediate state; like a clicker pen or a light switch, it
        wants to sit fully in one position or the other.
      </Paragraph>

      <VisualPlaceholder label="T ↔ R switch (diagram) — the two stable states side by side, with the 15° rotation of one αβ half against the other." />

      <Paragraph>
        When the tug on the iron from the bound oxygen travels out through the
        chain, it puts a strain on the clasps holding the T setting. Usually one
        oxygen doesn&rsquo;t apply enough strain to flip the switch. But past a
        threshold, the two halves rotate 15 degrees, the T-state salt bridges snap
        open, and the whole molecule switches to the R state.
      </Paragraph>

      <Paragraph>
        Now, why does this flip matter? In the T state, the rigid surrounding
        structure actively restrains the proximal histidine, holding the iron back
        from sliding into the porphyrin plane. So for an oxygen to bind, it has to
        &ldquo;fight&rdquo; the protein &mdash; or, in chemistry terms, it has low
        affinity. In the R state, that restraint is released, and the iron moves
        more freely, which makes binding easier: high affinity. The heme&rsquo;s
        willingness to grab oxygen is shaped by the molecular structure around it.
        In the R state, its appetite for oxygen is larger.
      </Paragraph>

      <Paragraph>
        And so there&rsquo;s a positive feedback in play. The early oxygens
        &mdash; let&rsquo;s say the first two &mdash; have the hardest job, because
        they have to bind in the reluctant T state and thus pay the energetic cost
        of flipping the switch to R. But once it&rsquo;s flipped, the remaining two
        oxygens get to bind the eager R state for essentially free. This working
        together is known as cooperativity.
      </Paragraph>

      {/* --- Why it doesn't rust (the partial bond) — text only --- */}
      <Paragraph>
        There&rsquo;s another interesting structural piece of the puzzle here. The
        iron in the heme &ldquo;grabs&rdquo; oxygen &mdash; but when iron reacts
        with oxygen, it normally forms iron oxide, otherwise known as rust. If
        hemoglobin did that, it would not be able to deliver oxygen, and our
        nanomachine, ironically like many of our industrial machines, would fail
        due to rusting. But it doesn&rsquo;t rust. That&rsquo;s because oxygen
        doesn&rsquo;t &ldquo;fully&rdquo; bond with the iron: when it lands, the
        iron doesn&rsquo;t fully hand over its spare electron &mdash; it only leans
        the electron partway toward the oxygen. So the bound state is a kind of
        tense in-between that&rsquo;s easy to reverse.
      </Paragraph>

      {/* --- The lean, steadied by the distal His --- */}
      <Paragraph>
        That lean &mdash; oxygen sits at about a 120-degree angle where it connects
        to the iron &mdash; is steadied from above by the distal histidine we met
        earlier. It hovers over the oxygen and, like a weak hydrogen bond, a faint
        electrostatic tether, holds the oxygen at a comfortable angle and keeps the
        whole arrangement gentle and returnable.
      </Paragraph>

      <MorphFigure url={LEAN_MORPH_URL} />

      {/* --- Distal His as CO bodyguard — text only --- */}
      <Paragraph>
        Along with helping prevent rusting, the distal histidine has another
        crucial role: it&rsquo;s a quiet bodyguard against carbon monoxide. Without
        the hovering protein, CO binds something like 20,000 times more tightly to
        iron than oxygen does. But CO likes to bind straight, and the distal
        histidine forces it to join on a tilt instead, which makes for a weaker
        connection. Its advantage over oxygen drops from 20,000&times; to about
        200&times; &mdash; a 100&times; decrease. Still poisonous, but meaningfully
        blunted. Without it, sitting by a fire would be 100 times worse for you.
      </Paragraph>
    </>
  );
}
