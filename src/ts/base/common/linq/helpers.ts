/**
 * 检查传递的参数是否为对象
 */
export const isObj = <T>(x: T): boolean => !!x && typeof x === 'object';

/**
 * 确定两个对象是否相等
 */
export const equal = <T, U>(a: T, b: U): boolean => {
  if (isObj(a) && isObj(b)) {
    return Object.entries(a as object).every(([key, val]) => {
      if ((b as any)[key]) {
        return equal((b as any)[key], val);
      }
      return false;
    });
  }
  return (a as unknown) === (b as undefined);
};

/**
 * 比较器助手
 */

export const composeComparers =
  <T>(
    previousComparer: (a: T, b: T) => number,
    currentComparer: (a: T, b: T) => number,
  ): ((a: T, b: T) => number) =>
  (a: T, b: T) =>
    previousComparer(a, b) || currentComparer(a, b);

export const keyComparer =
  <T>(_keySelector: (key: T) => string, descending?: boolean): ((a: T, b: T) => number) =>
  (a: T, b: T) => {
    const sortKeyA = _keySelector(a);
    const sortKeyB = _keySelector(b);
    if (sortKeyA > sortKeyB) {
      return !descending ? 1 : -1;
    } else if (sortKeyA < sortKeyB) {
      return !descending ? -1 : 1;
    } else {
      return 0;
    }
  };
