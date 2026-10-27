// The two things a film records: spot spacing from the box size, spot darkness from what sits in the box.
import { useElementWidth } from "@hooks";
import { ReadingTheFilm } from "./ReadingTheFilm";
import { Note } from "./TwoAtoms";

const WHERE = <Note title="Where the spots fall">The smaller the box, the farther apart the spots.</Note>;
const DARK = (
  <Note title="How dark they are">
    A different molecule in the same box leaves the spots in place; its atoms’ waves add up differently at each one.
  </Note>
);

export function TwoKinds() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const wide = W >= 560;
  return (
    <div ref={ref} className={wide ? "grid grid-cols-2 gap-x-8 gap-y-3" : "flex flex-col"}>
      {wide ? (
        <>
          {WHERE}
          {DARK}
          <ReadingTheFilm group="box" />
          <ReadingTheFilm group="molecule" />
        </>
      ) : (
        <>
          {WHERE}
          <div className="mt-3">
            <ReadingTheFilm group="box" />
          </div>
          <div className="mt-8">{DARK}</div>
          <div className="mt-3">
            <ReadingTheFilm group="molecule" />
          </div>
        </>
      )}
    </div>
  );
}
