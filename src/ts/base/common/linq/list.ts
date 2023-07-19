import { composeComparers, isObj, equal, keyComparer } from './helpers';

type PredicateType<T> = (value: T, index: number, list: T[]) => boolean;

class List<T> {
  protected _elements: T[];

  /**
   * 使用数组构建列表
   */
  constructor(elements: T[] = []) {
    this._elements = elements;
  }

  /**
   * 列表添加元素
   */
  public Add(element: T): void {
    this._elements.push(element);
  }

  /**
   * 列表追加元素，同添加功能
   */
  public Append(element: T): void {
    this.Add(element);
  }

  /**
   * 插入到列表的开始位置
   */
  public Prepend(element: T): void {
    this._elements.unshift(element);
  }

  /**
   * 追加一个数组
   */
  public AddRange(elements: T[]): void {
    this._elements.push(...elements);
  }

  /**
   * 确定列表的所有元素是否满足条件。
   */
  public All(predicate: PredicateType<T>): boolean {
    return this._elements.every(predicate);
  }

  /**
   * 列表是否存在元素
   */
  public Any(): boolean {
    return this._elements.length > 0;
  }
  public AnyOf(predicate: PredicateType<T>): boolean {
    return this._elements.some(predicate);
  }

  /**
   * 元素的算术平均值
   */
  public Average(): number {
    return this.Sum() / this.Count();
  }
  public AverageOf(transform: (value?: T, index?: number, list?: T[]) => any): number {
    return this.SumOf(transform) / this.CountOf(transform);
  }

  /**
   * 将序列的元素强制转换为指定的类型
   */
  public Cast<U>(): List<U> {
    return new List<U>(this._elements as any);
  }

  /**
   * 清空所有元素
   */
  public Clear(): void {
    this._elements = [];
  }

  /**
   * 连接两个列表
   */
  public Concat(list: List<T>): List<T> {
    return new List<T>(this._elements.concat(list.ToArray()));
  }

  /**
   * 列表是否包含元素
   */
  public Contains(element: T): boolean {
    return this.AnyOf((x) => x === element);
  }

  /**
   * 返回列表数量
   */
  public Count(): number {
    return this._elements.length;
  }

  /** 返回列表满足条件的数量 */
  public CountOf(predicate: PredicateType<T>): number {
    return this.Where(predicate).Count();
  }

  /**
   * 如果列表不为空则返回自身，为空则用默认值新建一个列表返回
   */
  public DefaultIfEmpty(defaultValue: T): List<T> {
    return this.Count() > 0 ? this : new List<T>([defaultValue]);
  }

  /**
   * 列表元素去重
   */
  public Distinct(): List<T> {
    return this.Where(
      (value, index, iter) =>
        (isObj(value)
          ? iter.findIndex((obj) => equal(obj, value))
          : iter.indexOf(value)) === index,
    );
  }

  /**
   * 列表元素使用指定的键去重
   */
  public DistinctBy(keySelector: (key: T) => string | number): List<T> {
    const groups = this.GroupBy(keySelector);
    return Object.keys(groups).reduce((res, key) => {
      res.Add(groups[key][0]);
      return res;
    }, new List<T>());
  }

  /**
   * 返回指定位置的元素，超出则异常
   */
  public ElementAt(index: number): T {
    if (index < this.Count() && index >= 0) {
      return this._elements[index];
    } else {
      throw new Error('参数异常, 索引超出。');
    }
  }

  /**
   * 返回指定位置的元素，超出则取默认值
   */
  public ElementAtOrDefault(index: number, defaultValue: T): T {
    return index < this.Count() && index >= 0 ? this._elements[index] : defaultValue;
  }

  /**
   * 剔除子列表里的元素
   */
  public Except(source: List<T>): List<T> {
    return this.Where((x) => !source.Contains(x));
  }

  /**
   * 返回第一个元素，列表为空则异常
   */
  public First(): T {
    if (this.Count() > 0) {
      return this._elements[0];
    }
    throw new Error('异常, 数组是空的。');
  }
  /**
   * 返回满足条件的第一个元素，都不满足则异常
   */
  public FirstOf(predicate: PredicateType<T>): T {
    if (this.Count()) {
      return predicate ? this.Where(predicate).First() : this._elements[0];
    } else {
      throw new Error('InvalidOperationException: The source sequence is empty.');
    }
  }

  /**
   * 返回第一个元素，列表为空返回默认值
   */
  public FirstOrDefault(defaultValue: T): T {
    if (this.Count()) {
      return this._elements[0];
    } else {
      return defaultValue;
    }
  }
  /**
   * 返回满足条件的第一个元素，都不满足则返回默认值
   */
  public FirstOrDefaultOf(predicate: PredicateType<T>, defaultValue: T): T {
    return this.CountOf(predicate) > 0 ? this.FirstOf(predicate) : defaultValue;
  }

  /**
   * 列表迭代
   */
  public ForEach(action: (value: T, index: number, list: T[]) => any): void {
    return this._elements.forEach(action);
  }

  /**
   * 对列表应用累加器函数。
   */
  public Aggregate<U>(
    accumulator: (accum: U, value: T, index: number, list: T[]) => any,
    initialValue: U,
  ): any {
    return this._elements.reduce(accumulator, initialValue);
  }
  /**
   * 根据指定的键选择器函数对列表的元素进行分组。
   */
  public GroupBy<TResult = T>(
    grouper: (key: T) => string | number,
    mapper: (element: T) => TResult = (val) => val as unknown as TResult,
  ): { [key: string]: TResult[] } {
    const initialValue: { [key: string]: TResult[] } = {};
    return this.Aggregate((ac, v) => {
      const key = grouper(v!);
      const existingGroup = ac[key];
      const mappedValue = mapper(v!);
      existingGroup ? existingGroup.push(mappedValue) : (ac[key] = [mappedValue]);
      return ac;
    }, initialValue);
  }

  /**
   * 基于键的相等性来关联两个列表的元素，并对结果进行分组。默认的相等比较器用于比较键。
   */
  public GroupJoin<U, R>(
    list: List<U>,
    key1: (k: T) => any,
    key2: (k: U) => any,
    result: (first: T, second: List<U>) => R,
  ): List<R> {
    return this.Select((x) =>
      result(
        x,
        list.Where((z) => key1(x) === key2(z)),
      ),
    );
  }

  /**
   * 返回列表中元素第一次出现的索引。
   */
  public IndexOf(element: T): number {
    return this._elements.indexOf(element);
  }

  /**
   * 在指定的索引处将元素插入列表中，索引超出则异常。
   */
  public Insert(index: number, element: T): void | Error {
    if (index < 0 || index > this._elements.length) {
      throw new Error('索引超限。');
    }

    this._elements.splice(index, 0, element);
  }

  /**
   * 通过使用默认的相等比较器比较值，生成两个序列的集合交集。
   */
  public Intersect(source: List<T>): List<T> {
    return this.Where((x) => source.Contains(x));
  }

  /**
   * 基于匹配关键字将两个序列的元素进行关联。默认的相等比较器用于比较键。
   */
  public Join<U, R>(
    list: List<U>,
    key1: (key: T) => any,
    key2: (key: U) => any,
    result: (first: T, second: U) => R,
  ): List<R> {
    return this.SelectMany((x) =>
      list.Where((y) => key2(y) === key1(x)).Select((z) => result(x, z)),
    );
  }

  /**
   * 返回列表的最后一个元素，如果列表为空则异常
   */
  public Last(): T {
    if (this.Count() > 0) {
      return this._elements[this.Count() - 1];
    }
    throw new Error('列表是空的');
  }

  /**
   * 返回列表匹配的的最后一个元素，都不满足则异常
   */
  public LastOf(predicate: PredicateType<T>): T {
    if (this.Count()) {
      return this.Where(predicate).Last();
    } else {
      throw new Error('列表是空的');
    }
  }

  /**
   * 返回列表的最后一个元素，如果列表为空则返回默认值
   */
  public LastOrDefault(defaultValue: T): T {
    return this.Count() > 0 ? this.Last() : defaultValue;
  }
  /**
   * 返回列表满足条件的最后一个元素，如果都不满足则返回默认值
   */
  public LastOrDefaultOf(predicate: PredicateType<T>, defaultValue: T): T {
    return this.CountOf(predicate) ? this.LastOf(predicate) : defaultValue;
  }

  /**
   * 返回列表的最大值，列表的元素必须是数字
   */
  public Max(): number {
    return Math.max(...this._elements.map((x) => Number(x)));
  }
  /**
   * 返回列表元素指定项的最大值
   */
  public MaxOf(selector: (value: T, index: number, array: T[]) => number): number {
    return Math.max(...this._elements.map(selector));
  }

  /**
   * 返回列表的最大值，列表的元素必须是数字
   */
  public Min(): number {
    return Math.min(...this._elements.map((x) => Number(x)));
  }

  /**
   * 返回列表元素指定项的最小值
   */
  public MinOf(selector: (value: T, index: number, array: T[]) => number): number {
    return Math.min(...this._elements.map(selector));
  }

  /**
   * 返回列表中指定类型的元素组成的列表
   */
  public OfType<U>(type: any): List<U> {
    let typeName: string;
    switch (type) {
      case Number:
        typeName = typeof 0;
        break;
      case String:
        typeName = typeof '';
        break;
      case Boolean:
        typeName = typeof true;
        break;
      case Function:
        typeName = typeof function () {};
        break;
      default:
        typeName = '';
        break;
    }
    return typeName === null
      ? this.Where((x) => x instanceof type).Cast<U>()
      : this.Where((x) => typeof x === typeName).Cast<U>();
  }

  /**
   * 根据指定的元素和比较器正序排序
   */
  public OrderBy(
    keySelector: (key: T) => any,
    comparer = keyComparer(keySelector, false),
  ): List<T> {
    return new OrderedList<T>(this._elements, comparer);
  }

  /**
   * 根据指定的元素和比较器倒序排序
   */
  public OrderByDescending(
    keySelector: (key: T) => any,
    comparer = keyComparer(keySelector, true),
  ): List<T> {
    return new OrderedList<T>(this._elements, comparer);
  }

  /**
   * 移除指定元素
   */
  public Remove(element: T): boolean {
    return this.IndexOf(element) !== -1
      ? (this.RemoveAt(this.IndexOf(element)), true)
      : false;
  }

  /**
   * 移除所有满足条件的元素
   */
  public RemoveAll(predicate: PredicateType<T>): List<T> {
    return this.Where((v, i, l) => !predicate(v, i, l));
  }

  /**
   * 移除指定索引的元素
   */
  public RemoveAt(index: number): void {
    this._elements.splice(index, 1);
  }

  /**
   * 反转列表
   */
  public Reverse(): List<T> {
    return new List<T>(this._elements.reverse());
  }

  /**
   * 返回按照指定方法生成的元素的新序列
   */
  public Select<TOut>(selector: (element: T, index: number) => TOut): List<TOut> {
    return new List<TOut>(this._elements.map(selector));
  }

  /**
   * 返回二维列表按照指定方法生成的元素的新一维列表
   */
  public SelectMany<TOut extends List<any>>(
    selector: (element: T, index: number) => TOut,
  ): TOut {
    return this.Aggregate(
      (ac, _, i) => (ac.AddRange(this.Select(selector).ElementAt(i).ToArray()), ac),
      new List<TOut>(),
    );
  }

  /**
   * 通过使用元素类型的默认相等比较器比较元素，确定两个序列是否相等。
   */
  public SequenceEqual(list: List<T>): boolean {
    return this.All((e) => list.Contains(e));
  }

  /**
   * 返回序列中唯一的元素，如果序列中没有一个元素，则抛出异常。
   */
  public Single(predicate: PredicateType<T>): T {
    if (this.CountOf(predicate) !== 1) {
      throw new Error('没有满足条件的元素');
    } else {
      return this.FirstOf(predicate);
    }
  }

  /**
   * 返回序列中唯一的元素，如果序列中没有一个元素，则返回默认值
   */
  public SingleOrDefault(predicate: PredicateType<T>, defaultValue: T): T {
    return this.CountOf(predicate) ? this.Single(predicate) : defaultValue;
  }

  /**
   * 跳过指定数量的元素返回新列表
   */
  public Skip(amount: number): List<T> {
    return new List<T>(this._elements.slice(Math.max(0, amount)));
  }

  /**
   *  跳过结尾指定数量的元素返回新列表
   */
  public SkipLast(amount: number): List<T> {
    return new List<T>(this._elements.slice(0, -Math.max(0, amount)));
  }

  /**
   * 只要指定的条件为满足，就跳过序列中的元素，然后返回其余元素。
   */
  public SkipWhile(predicate: PredicateType<T>): List<T> {
    return this.Skip(
      this.Aggregate(
        (ac) => (predicate(this.ElementAt(ac), 0, this._elements) ? ++ac : ac),
        0,
      ),
    );
  }

  /**
   * 计算元素的和
   */
  public Sum(): number {
    return this.Aggregate((ac, v) => (ac += +(v || 0)), 0);
  }

  public SumOf(transform: (value: T, index: number, list?: T[]) => number): number {
    return this.Select(transform).Sum();
  }

  /**
   * 返回从开始位置截取指定数量的元素的新列表
   */
  public Take(amount: number): List<T> {
    return new List<T>(this._elements.slice(0, Math.max(0, amount)));
  }

  /**
   * 从结束位置截取指定数量的元素的新列表
   */
  public TakeLast(amount: number): List<T> {
    return new List<T>(this._elements.slice(-Math.max(0, amount)));
  }

  /**
   * 截取满足条件的元素的新列表
   */
  public TakeWhile(predicate: PredicateType<T>): List<T> {
    return this.Take(
      this.Aggregate(
        (ac) => (predicate(this.ElementAt(ac), 0, this._elements) ? ++ac : ac),
        0,
      ),
    );
  }

  /**
   * 返回元数组
   */
  public ToArray(): T[] {
    return this._elements;
  }

  /**
   * 返回本列表
   */
  public ToList(): List<T> {
    return this;
  }

  /**
   * 返回指定键和元素的新字典
   */
  public ToLookup<TResult>(
    keySelector: (key: T) => string | number,
    elementSelector: (element: T) => TResult,
  ): { [key: string]: TResult[] } {
    return this.GroupBy(keySelector, elementSelector);
  }

  /**
   * 取两个列表的并集
   */
  public Union(list: List<T>): List<T> {
    return this.Concat(list).Distinct();
  }

  /**
   * 根据条件过滤列表
   */
  public Where(predicate: PredicateType<T>): List<T> {
    return new List<T>(this._elements.filter(predicate));
  }

  /**
   * 转成JSON
   */
  public toJSON() {
    return this._elements;
  }
}
/**
 * 生成一个可排序列表
 */
class OrderedList<T> extends List<T> {
  constructor(elements: T[], private _comparer: (a: T, b: T) => number) {
    super(elements);
    this._elements.sort(this._comparer);
  }

  /**
   * 根据键按升序对序列中的元素执行后续排序。
   */
  public ThenBy(keySelector: (key: T) => any): List<T> {
    return new OrderedList(
      this._elements,
      composeComparers(this._comparer, keyComparer(keySelector, false)),
    );
  }

  /**
   * 根据键按降序对序列中的元素执行后续排序。
   */
  public ThenByDescending(keySelector: (key: T) => any): List<T> {
    return new OrderedList(
      this._elements,
      composeComparers(this._comparer, keyComparer(keySelector, true)),
    );
  }
}

export default List;
