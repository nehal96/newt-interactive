// A tiny FIFO semaphore for serializing heavy Mol* boots.
//
// Each anatomy beat mounts its own Mol* plugin (its own WebGL context). Booting
// one is expensive — parse a PDB, build geometry, compile shaders — and doing
// several on the same frame (e.g. a fast scroll past a run of beats) janks the
// main thread. So every viewer awaits a slot here before `createPluginUI` and
// releases it once its first frame is up, capping how many boot at once.
//
// This only throttles *initialization*; once booted, viewers run (or idle)
// independently. Keeping a couple in flight overlaps each plugin's async I/O
// without flooding the thread.
const MAX_CONCURRENT_BOOTS = 2;

let active = 0;
const waiting: Array<() => void> = [];

/**
 * Wait for a boot slot. Resolves with a release function that MUST be called
 * once (idempotent) when the boot finishes or is abandoned, to free the slot
 * for the next viewer in line.
 */
export function acquireBootSlot(): Promise<() => void> {
  return new Promise((resolve) => {
    const grant = () => {
      active += 1;
      let released = false;
      resolve(() => {
        if (released) return;
        released = true;
        active -= 1;
        waiting.shift()?.();
      });
    };

    if (active < MAX_CONCURRENT_BOOTS) grant();
    else waiting.push(grant);
  });
}
