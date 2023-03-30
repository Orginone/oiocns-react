import { useEffect } from 'react';

/**
 *
 * @param {React.EffectCallback} fn
 * @param {React.DependencyList} deps
 * @param {number} ms
 */
export default function useDebouncedEffect(fn, deps, ms = 300) {
  useEffect(() => {
    let clean: any = null;
    const timer = setTimeout(() => {
      clean = fn();
    }, ms);
    return () => {
      clearTimeout(timer);
      if (clean) clean();
    };
  }, deps);
}
