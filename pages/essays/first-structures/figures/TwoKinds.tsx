// What a film records: spot spacing from the box size, spot darkness from what sits in the box.
import { useElementWidth } from "@hooks";
import { ReadingTheFilm } from "./ReadingTheFilm";
import { Note } from "./Figure";

const FILM = 120;

const WHERE = <Note title="3. The unit cell sets where the spots fall">Make the unit cell smaller, and the spots spread farther apart.</Note>;
const DARK = (
  <Note title="4. The molecule sets how dark they are">
    Put a different molecule in the same unit cell. The spots stay in the same places, but some get darker and some fainter.
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
          <ReadingTheFilm group="box" size={FILM} />
          <ReadingTheFilm group="molecule" size={FILM} />
        </>
      ) : (
        <>
          {WHERE}
          <div className="mt-3">
            <ReadingTheFilm group="box" size={FILM} />
          </div>
          <div className="mt-8">{DARK}</div>
          <div className="mt-3">
            <ReadingTheFilm group="molecule" size={FILM} />
          </div>
        </>
      )}
    </div>
  );
}
