import dynamic from "next/dynamic";
import { H2, Paragraph } from "../../../../components";

/**
 * Section 4 of the essay — cooperativity and the saturation curve. Prose is drafted
 * from the notebook bullets (images 2–4), connected only lightly and kept in the
 * author's voice for a later edit pass. One interactive sits in the middle: a
 * single saturation-curve chart with toggle buttons (myoglobin overlay, P50 marker,
 * tissue O₂ levels, the exercising-muscle right shift). See docs/hemoglobin-essay-plan.md §4.
 */

// The chart owns Victory + a bit of state; lazy + client-only, like the morph
// figures, so it stays out of the initial bundle and avoids any SSR hiccup.
const CooperativityFigure = dynamic(() => import("./CooperativityFigure"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[300px] w-full items-center justify-center rounded-lg bg-slate-50 text-xs text-slate-400 lg:h-[340px]">
      Loading chart…
    </div>
  ),
});

export default function CooperativitySection() {
  return (
    <>
      <H2 className="mt-8">Cooperativity</H2>

      <Paragraph>
        In the catching section, we showed how one heme binding with oxygen makes
        the remaining oxygens bind more easily &mdash; a positive effect. Releasing
        is similar: letting go of one oxygen makes the remaining ones easier to
        release &mdash; another positive effect. This phenomenon is called
        cooperativity, and it&rsquo;s a very important property this structure
        provides. It lets oxygen be picked up quickly in an oxygen-rich
        environment, like the lungs, and released quickly in oxygen-deficient ones,
        like an active muscle.
      </Paragraph>

      <Paragraph>
        You can graph cooperativity by showing what percentage of hemoglobin is
        oxygenated &mdash; how saturated it is &mdash; against how much oxygen is in
        the environment, the partial pressure of oxygen.
      </Paragraph>

      <Paragraph>
        It has a sigmoidal shape, often referred to as the S shape, and the shape
        itself is a result of cooperativity. At the low end, increasing the
        pressure leads to a very slow increase in saturation. But after a certain
        threshold there&rsquo;s a steep increase &mdash; small increases in tension
        lead to much larger increases in saturation, as the positive loop kicks in.
        At high saturation it levels off again, since there are fewer and fewer
        seats left for oxygen to hold onto.
      </Paragraph>

      <figure className="my-8 w-full scroll-mt-24 lg:my-12">
        <div className="mx-auto w-full max-w-md">
          <CooperativityFigure />
        </div>
      </figure>

      <Paragraph>
        That middle steep rise is cooperativity made visible. At the low end, most
        hemoglobin sits in the T state. The steep rise in the centre happens
        because, as they take on a bit of oxygen and switch to R, it becomes easier
        to pick up more &mdash; until there are few slots left and it tapers off. A
        one-seat carrier like myoglobin has no switch, so its curve is hyperbolic
        instead: it picks oxygen up quickly and then holds onto it. (Toggle
        myoglobin on the chart to compare.)
      </Paragraph>

      <Paragraph>
        Other factors &mdash; acid (the Bohr effect), CO&#8322;, BPG, and heat
        &mdash; shift the curve to the right, toward lower affinity. One way to
        think about it is to look at P50: the pressure at which hemoglobin is
        half-saturated. For a right-shifted curve, P50 sits at a higher pressure
        &mdash; in other words, hemoglobin lets go of its oxygen more easily than
        normal, which is exactly what those signals are for: a higher demand for
        oxygen.
      </Paragraph>

      <Paragraph>
        The myoglobin curve is also a good place to see the benefit of the switch.
        At the pressure in the lungs, the two are effectively at the same
        saturation. But at hemoglobin&rsquo;s P50, myoglobin still holds most of its
        oxygen &mdash; it&rsquo;s a good storer &mdash; while hemoglobin, by
        definition, has already given half of its away. It&rsquo;s built to release
        quickly.
      </Paragraph>

      <Paragraph>
        To put real numbers on it: atmospheric pressure at sea level is around 95
        mmHg, which loads hemoglobin to about 98%. At 60 mmHg it&rsquo;s still
        around 90%, so you can be quite elevated &mdash; an airplane cabin, say
        &mdash; without gasping. Resting tissue sits around 40 mmHg, right in that
        steep drop, so a small dip in pressure releases a lot of oxygen. An
        oxygen-hungry active muscle might be lower still, around 20 mmHg. 40 mmHg is
        about 75% saturation; 20 mmHg is about 30%. A similar 20 mmHg drop up at the
        top, from 95 to 75, only costs about 3% in saturation. The curve shows the
        behavior of the molecule as a whole: roughly 15&times; the oxygen delivered
        for the same drop in pressure, exactly what you want in that situation. (One
        thing to keep in mind: the drop in pressure is instant, while the shifts
        from acid, CO&#8322;, BPG, and heat take some time.)
      </Paragraph>

      <Paragraph>
        There&rsquo;s a shift in the other direction, too. Fetal hemoglobin is
        left-shifted, with a higher affinity, which lets it pull oxygen from the
        mother&rsquo;s blood across the placenta.
      </Paragraph>
    </>
  );
}
