import { H2, Paragraph } from "../../../../components";

/**
 * Section 3 of the essay — how hemoglobin releases oxygen. Release is mostly
 * "catching in reverse" (R → T), so it gets no new 3D morph: the binding morph in
 * Section 2 is already two-way and the mechanics are a callback, not fresh
 * material. The new content is the regulation — what tips the T↔R balance toward
 * release: acid/CO₂ (the Bohr effect), 2,3-BPG, and heat. Those three factors share
 * one companion figure drawn in the Section-2 T↔R style (salt-bridge clasps, the
 * 15° switch) with acid's extra clasps and the 2,3-BPG doorstop layered on.
 *
 * Prose is kept near-verbatim to the notebook (the author's own voice) pending a
 * later edit pass — only the obvious R↔T directional slip is corrected and the
 * 2,3-BPG spelling standardized. See docs/hemoglobin-essay-plan.md §3.
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

export default function ReleaseSection() {
  return (
    <>
      <H2 className="mt-8">How hemoglobin releases oxygen</H2>

      {/* --- How does it know when? + release is catching in reverse --- */}
      <Paragraph>
        How does it know when? The molecule doesn&rsquo;t decide, it&rsquo;s the
        conditions around it that signal that oxygen is in demand, and help take it
        from hemoglobin. On the mechanical level, delivery mostly does work like
        catching in reverse &mdash; hemoglobin switches from the R to the T state,
        which holds on more loosely to oxygen and which allows it to leave to where
        it needs to go, like a tissue desperate for oxygen.
      </Paragraph>

      {/* --- What triggers the switch --- */}
      <Paragraph>
        But how does it know when to switch from R to T? (Think of it like
        unfastening the seatbelt after its journey.) There are a number of effects.
      </Paragraph>

      {/* --- CO₂ / acid: the Bohr effect (squats) --- */}
      <Paragraph>
        Let&rsquo;s say that you are doing squats, and your quads are getting really
        worked up. When it&rsquo;s active, the tissue in your quads produce carbon
        dioxide, which pours out and becomes acid in the blood. The extra protons of
        acid bind onto the ends of hemoglobin and turn them positive, which creates
        extra salt-bridges. Acid, in other words, adds clasps to hemoglobin and
        helps it switch to the T state. Thus, carbon dioxide, the waste signal of
        using oxygen, becomes the signal to deliver more of it.
      </Paragraph>

      {/* --- 2,3-BPG: the doorstop --- */}
      <Paragraph>
        Another mechanism to cajole hemoglobin from R to T is a small molecule
        called 2,3-BPG (2,3-bisphosphoglycerate, full form; manufactured by red
        blood cells). In the T state, there is a small cavity between the two
        halves. In the R state, the rotation squeezes the cavity. The 2,3-BPG wedges
        into the cavity and props it open to keep it in the T state, like a
        doorstop.
      </Paragraph>

      {/* --- Heat --- */}
      <Paragraph>
        Heat is another factor &mdash; a warm muscle pushes the balance towards
        release.
      </Paragraph>

      {/* One companion diagram in the Section-2 T↔R style, carrying all three
          release factors on a single frame. */}
      <VisualPlaceholder label="Companion diagram (T↔R style): the two halves and the 15° switch, salt-bridge clasps holding T, with acid's extra clasps at the chain ends and the 2,3-BPG doorstop in the central cavity layered on — all three release factors on one frame." />

      {/* --- Footnote: CO₂'s secondary, carbamate role --- */}
      <Paragraph>
        Footnote: CO&#8322; has a secondary role as carbamate groups.
      </Paragraph>
    </>
  );
}
