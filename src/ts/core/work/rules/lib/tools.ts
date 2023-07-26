/* 去重 */
function uniqueArray(array: any) {
  const isArray = Array.isArray(array);
  if (!isArray) {
    return [];
  }
  return Array.from(new Set(array));
}
/* 获取规则字符串里，所有的特殊字符 默认「」*/
function getAllFixedCharacter(str: string, reg = /「(.*?)」/) {
  return str.match(reg);
}
/* 获取特殊字符中的内容 默认「」*/
function getChartcterContent(str: string, reg = /「(.*?)」/) {
  const match = str.match(reg);
  if (match && match[1]) {
    return match[1];
  }
  return null; // 如果未找到匹配的内容，返回 null 或其他自定义的值
}
/* 通过name获取特性对应得id */
function findKeyWidthName(
  name: string,
  ObjArr: { name: string; code: string; id: string }[],
): string | undefined {
  if (!name) {
    return undefined;
  }
  return ObjArr.find((v) => v.name === name)?.id;
}
/* 替换规则特殊字符=>表单值 */

export { findKeyWidthName, getAllFixedCharacter, getChartcterContent, uniqueArray };
