import { DataType } from 'typings/globelType';
import { RuleTypes } from '../type';
import { IRuleBase } from '../base/ruleBase';
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
/* 过滤对象里的 空值 */
function removeNullObj(data: DataType): DataType {
  let _obj: DataType = {};
  for (const item of Object.keys(data)) {
    if (data[item] !== null || data[item] !== undefined) {
      _obj[item] = data[item];
    }
  }
  return _obj;
}
function filterRules(
  rules: IRuleBase[],
  trigger: RuleTypes.TriggerType,
  changeObj?: DataType,
) {
  let willResloveRules: IRuleBase[] = [];
  switch (trigger) {
    case 'Start':
      willResloveRules = rules.filter((item) => item.trigger === trigger);
      break;
    case 'Running':
      {
        let changeId: string = '';

        if (changeObj) {
          changeId = Object.keys(changeObj)[0];
        }
        willResloveRules = rules.filter((item) => {
          if (changeId) {
            return (
              item.linkAttrs.some((v) => v.id === changeId) && item.trigger === trigger
            );
          }
          return false;
        });
      }
      break;
    case 'Submit':
      break;
    case 'ThingsChanged':
      break;

    default:
      break;
  }
  return willResloveRules;
}

export {
  filterRules,
  findKeyWidthName,
  getAllFixedCharacter,
  getChartcterContent,
  removeNullObj,
  uniqueArray,
};
