import { useCallback } from 'react';
/**
 * 防抖hook
 * @param func 需要执行的函数
 * @param wait 延迟时间
 */
export function useDebounce<A extends Array<any>, R = void>(
  func: (..._args: A) => R,
  wait: number,
) {
  let timeOut: null | NodeJS.Timeout = null;
  let args: A;
  function debounce(..._args: A) {
    args = _args;
    if (timeOut) {
      clearTimeout(timeOut);
      timeOut = null;
    }
    return new Promise<R>((resolve, reject) => {
      timeOut = setTimeout(async () => {
        try {
          // eslint-disable-next-line prefer-spread
          const result = await func.apply(null, args);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      }, wait || 500);
    });
  }
  // 取消
  function cancel() {
    if (!timeOut) return;
    clearTimeout(timeOut);
    timeOut = null;
  }
  // 立即执行
  function flush() {
    cancel();
    // eslint-disable-next-line prefer-spread
    return func.apply(null, args);
  }
  debounce.flush = flush;
  debounce.cancel = flush;
  return useCallback(debounce, []);
}
