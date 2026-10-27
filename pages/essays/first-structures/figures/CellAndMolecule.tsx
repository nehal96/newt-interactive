// What a film records: spot spacing from the unit cell, spot darkness from the molecule inside it.
import { useElementWidth } from "@hooks";
import { ReadingTheFilm } from "./ReadingTheFilm";
import { Note } from "./Figure";

const FILM = 120;

const WHERE = <Note title="3. The unit cell sets where the spots fall">Make the unit cell smaller, and the spots spread farther apart.</Note>;
const DARK = (
  <Note title="4. The molecule sets how dark they are">
    Put a different molecule in the same unit cell, and the spots stay put but some get darker and some fainter.
  </Note>
);

export function CellAndMolecule() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const wide = W >= 560;
  return (
    <div ref={ref} className={wide ? "grid grid-cols-2 gap-x-8 gap-y-3" : "flex flex-col"}>
      {wide ? (
        <>
          {WHERE}
          {DARK}
          <ReadingTheFilm group="cell" size={FILM} />
          <ReadingTheFilm group="molecule" size={FILM} />
        </>
      ) : (
        <>
          {WHERE}
          <div className="mt-3">
            <ReadingTheFilm group="cell" size={FILM} />
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
