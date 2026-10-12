import { allWindows, chanceDistribution, FITCH_1966, hitsByShift, meanOf } from "../../core/fitch";
import { ALPHA, BETA } from "../../core/sequences";

const L = FITCH_1966.window;

let cached: ReturnType<typeof compute> | null = null;

function compute() {
  const mrs = allWindows(ALPHA.seq, BETA.seq, L);
  const chance = chanceDistribution(ALPHA.seq, BETA.seq, L);
  return {
    mrs,
    chance,
    mean: meanOf(chance),
    shifts: hitsByShift(mrs, FITCH_1966.cutoff),
  };
}

// α against β, every window of 30 against every other. Computed once, on first use.
export const alphaBeta = () => (cached ??= compute());

export { ALPHA, BETA, L as WINDOW };
