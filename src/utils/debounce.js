/**
 * Creates a debounced function that delays invoking the provided function
 * until after wait milliseconds have elapsed since the last time it was invoked.
 *
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {Object} options - Configuration options
 * @param {boolean} options.leading - Specify invoking on the leading edge of the timeout
 * @param {number} options.maxWait - The maximum time func is allowed to be delayed before it's invoked
 * @returns {Function} Returns the new debounced function
 */
export function debounce(func, wait, options = {}) {
  let timeout;
  let lastArgs;
  let lastThis;
  let result;
  let lastCallTime;
  let lastInvokeTime = 0;

  const { leading = false, maxWait } = options;
  const shouldInvoke = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, last call was long ago, or we have a maxWait
    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  };

  const invokeFunc = (time) => {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  };

  const startTimer = (pendingFunc, waitTime) => {
    clearTimeout(timeout);
    timeout = setTimeout(pendingFunc, waitTime);
  };

  const leadingEdge = (time) => {
    // Reset any `maxWait` timer
    lastInvokeTime = time;
    // Start the timer for the trailing edge
    startTimer(timerExpired, wait);
    // Invoke the leading edge
    return leading ? invokeFunc(time) : result;
  };

  const remainingWait = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait === undefined
      ? timeWaiting
      : Math.min(timeWaiting, maxWait - timeSinceLastInvoke);
  };

  const shouldInvokeOnTrailingEdge = (time) => {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Only invoke if we have a pending callback and either:
    // 1. We've waited the full wait time
    // 2. We have a maxWait and it's been reached
    return (
      lastCallTime !== undefined &&
      (timeSinceLastCall >= wait ||
        timeSinceLastCall < 0 ||
        (maxWait !== undefined && timeSinceLastInvoke >= maxWait))
    );
  };

  const timerExpired = () => {
    const time = Date.now();
    if (shouldInvokeOnTrailingEdge(time)) {
      return trailingEdge(time);
    }
    // Restart the timer
    startTimer(timerExpired, remainingWait(time));
  };

  const trailingEdge = (time) => {
    clearTimeout(timeout);
    timeout = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once
    if (lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  };

  const debounced = function(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        // Handle invocations in a tight loop
        startTimer(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === undefined) {
      startTimer(timerExpired, wait);
    }
    return result;
  };

  debounced.cancel = function() {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timeout = undefined;
  };

  debounced.flush = function() {
    return timeout === undefined ? result : trailingEdge(Date.now());
  };

  debounced.pending = function() {
    return timeout !== undefined;
  };

  return debounced;
}

// Alternative simple version (if you don't need all the features)
export function simpleDebounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Debounce hook for React
export function useDebounce(callback, delay) {
  const debouncedCallback = React.useMemo(
    () => debounce(callback, delay),
    [callback, delay]
  );

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      debouncedCallback.cancel?.();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
}