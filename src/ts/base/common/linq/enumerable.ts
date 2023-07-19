import List from './list';

export default class Enumerable {
  /**
   * 生成指定范围内的整数序列。
   */
  public static Range(start: number, count: number): List<number> {
    let result = new List<number>();
    while (count--) {
      result.Add(start++);
    }
    return result;
  }

  /**
   * 生成一个包含一个重复值的序列。
   */
  public static Repeat<T>(element: T, count: number): List<T> {
    let result = new List<T>();
    while (count--) {
      result.Add(element);
    }
    return result;
  }
}
