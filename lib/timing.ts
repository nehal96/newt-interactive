type Fn<A extends unknown[]> = (...args: A) => void;

export function debounce<A extends unknown[]>(fn: Fn<A>, wait: number): Fn<A> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

export function throttle<A extends unknown[]>(fn: Fn<A>, wait: number): Fn<A> {
  let last = -Infinity;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let trailing: A | undefined;

  const run = (args: A) => {
    last = Date.now();
    fn(...args);
  };

  return (...args) => {
    const remaining = wait - (Date.now() - last);

    if (remaining <= 0) {
      clearTimeout(timer);
      timer = undefined;
      trailing = undefined;
      run(args);
      return;
    }

    // The last call of a burst still fires, so a drag that stops mid-window
    // isn't left on a stale position.
    trailing = args;
    if (!timer) {
      timer = setTimeout(() => {
        timer = undefined;
        if (trailing) run(trailing);
        trailing = undefined;
      }, remaining);
    }
  };
}
