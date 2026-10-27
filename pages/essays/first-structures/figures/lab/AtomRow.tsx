// More atoms in a row at the same spacing: the bands get thinner and darker.
import { useState } from "react";
import { useElementWidth } from "@hooks";
import { SliderRow } from "../controls";
import { ScatterPanel } from "./TwoAtoms";

const MAX_ATOMS = 12;

export function AtomRow() {
  const [ref, W] = useElementWidth<HTMLDivElement>(640);
  const [n, setN] = useState(6);
  return (
    <div ref={ref}>
      <ScatterPanel W={W} maxLambda={15} span={13} spacing={3} n={n} stage="row" header="" hideHeader grow={MAX_ATOMS} />
      <div className="mt-4">
        <SliderRow
          label="Atoms"
          value={n}
          display={n === 1 ? "1: a faint fog, no bands" : `${n}: bands ${n * n}× as bright as one atom`}
          valueText={`${n} atoms`}
          min={1}
          max={MAX_ATOMS}
          step={1}
          onChange={setN}
        />
      </div>
    </div>
  );
}
