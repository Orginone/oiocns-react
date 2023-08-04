import { DataType } from 'typings/globelType';
import { RuleTypes } from '../type';
import { IRuleBase } from '../base/ruleBase';
import { RuleTriggers } from '@/ts/base/model';
import FormulaRule from '../formulaRule';
import MethodRule from '../methodRule';
// 定义规则类型常量，方便代码维护
const RuleType = {
  FORMULA: 'formula',
  METHOD: 'method',
};
//去重函数
function uniqueArray(array: any) {
  const isArray = Array.isArray(array);
  if (!isArray) {
    //不是数组则返回空数组
    return [];
  }
  return Array.from(new Set(array));
}

//获取规则字符串中所有特殊字符，默认为「」
function getAllFixedCharacter(str: string, reg = /「(.*?)」/) {
  return str.match(reg);
}

//获取特殊字符中的内容，默认为「」
function getChartcterContent(str: string, reg = /「(.*?)」/) {
  const match = str.match(reg);
  if (match && match[1]) {
    //如果匹配成功则返回匹配到的内容
    return match[1];
  }
  return null; //如果未找到匹配的内容，则返回 null 或其他自定义的值
}

//通过name获取特性对应的id
function findKeyWidthName(
  name: string,
  ObjArr: { name: string; code: string; id: string }[],
): string | undefined {
  return ObjArr.find((v) => v.name === name)?.id;
}

//过滤对象里的空值
function removeNullObj(data: DataType): DataType {
  let _obj: DataType = {};
  for (const item of Object.keys(data)) {
    if (data[item] !== null || data[item] !== undefined) {
      _obj[item] = data[item];
    }
  }
  return _obj;
}

//根据触发条件过滤规则
function filterRules(
  rules: IRuleBase[], //规则数组
  trigger: RuleTypes.TriggerType, //触发条件
  changeObj?: DataType | 'all', //表单数据变化的对象，选填，默认为 undefined
) {
  let willResloveRules: IRuleBase[] = []; //将要处理的规则数组

  switch (trigger) {
    case RuleTriggers.Start:
    case RuleTriggers.ThingsChanged:
      //如果触发条件是 "Start" 或 "ThingsChanged"，则过滤出规则的 trigger 属性等于该条件的规则
      willResloveRules = rules.filter((item) => item.trigger === trigger);
      break;
    case RuleTriggers.Running:
      {
        let changeId: string = '';
        if (changeObj) {
          changeId = changeObj === 'all' ? '0' : Object.keys(changeObj)[0];
        }

        //如果触发条件是 "Running"，则过滤出规则的 trigger 属性等于该条件并且与表单数据变化对象有关联的规则
        willResloveRules = rules.filter((item) => {
          if (changeId === '0') {
            return item.trigger === trigger;
          } else {
            return (
              item.linkAttrs.some((v) => v.id === changeId) && item.trigger === trigger
            );
          }
        });
      }
      break;
    case RuleTriggers.Submit:
      //如果触发条件是 "Submit"，则过滤出规则的 trigger 属性等于该条件的规则
      willResloveRules = rules.filter((item) => {
        return item.trigger === trigger;
      });
      break;
    default:
      break;
  }
  return willResloveRules;
}
// 获取表单的规则
const setFormRules = async (ruleList: any[]) => {
  let _list = [];

  // 遍历所有规则，根据规则类型创建不同的规则对象
  for (const _r of ruleList) {
    switch (_r.ruleType) {
      case RuleType.FORMULA:
        _list.push(new FormulaRule(_r));
        break;
      case RuleType.METHOD:
        _list.push(new MethodRule(_r));
        break;
      default:
        console.error('暂不支持规则类型：' + _r.ruleType);
        break;
    }
  }

  return _list;
};
export {
  filterRules,
  findKeyWidthName,
  getAllFixedCharacter,
  getChartcterContent,
  removeNullObj,
  setFormRules,
  uniqueArray,
};
