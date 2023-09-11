/* 规则函数库
 * Author:      SEN
 * CreateTime:  7/20/2023, 10:41:42 AM
 * LastEditor:  SEN
 * ModifyTime:  7/26/2023, 11:06:52 AM
 * Description: 用于提供规则函数
 */
/* 相加 */
export function add(a: number, b: number): number {
  return a + b;
}
/* 依次相加 */
export function sum(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}
/* 依次相减 */
export function subtractArray(arr: number[]): number {
  let result: number = arr[0];
  for (let i = 1; i < arr.length; i++) {
    result -= arr[i];
  }
  return result;
}
/* 根据特性code获取特性id */
export function findIdByCode(
  code: string,
  attrs: { code: string; id: string; rule: string }[],
): string {
  const matchedAttr = attrs.find((attr) => {
    const _Data = JSON.parse(attr.rule ?? '{}');
    return _Data.code === code;
  });

  return matchedAttr ? matchedAttr.id : '';
}

/* 根据特性名称获取特性id */
export function findIdByName(
  name: string,
  attrs: { name: string; id: string; rule: string }[],
): string {
  const matchedAttr = attrs.find((attr) => {
    return attr.name === name;
  });
  return matchedAttr ? matchedAttr.id : '';
}
