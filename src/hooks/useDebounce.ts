import { useRef } from 'react';

export default function useDebounce(fn: Function, delay: number = 300) {
  const refTimer = useRef<any>();

  return function f(...args: any) {
    if (refTimer.current) {
      clearTimeout(refTimer.current);
    }
    refTimer.current = setTimeout(() => {
      fn(args);
    }, delay);
  };
}
