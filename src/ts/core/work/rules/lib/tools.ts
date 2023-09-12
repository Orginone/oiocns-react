import { DataType } from 'typings/globelType';
import { RuleTypes } from '../type';
import { IRuleBase } from '../base/ruleBase';
import { RuleTriggers } from '../../../public';
import { FormulaRule, MethodRule } from '../base/ruleClass';
import { FixedCharacters, RuleType } from './const';
import OrgCtrl from '../../../../controller';
import dayjs from 'dayjs';

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
function getAllSpecialCharacter(str: string, reg = /「(.*?)」/) {
  return str.match(reg);
}

//获取特殊字符中的内容，默认为「」
function getSpecialChartcterContent(str: string, reg = /「(.*?)」/) {
  const match = str.match(reg);
  if (match && match[1]) {
    //如果匹配成功则返回匹配到的内容
    return match[1];
  }
  return null; //如果未找到匹配的内容，则返回 null 或其他自定义的值
}

//通过name获取特性对应的id
function findKeyByName(
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
  let waitTask: IRuleBase[] = []; //将要处理的规则数组

  switch (trigger) {
    case RuleTriggers.Start:
    case RuleTriggers.ThingsChanged:
    case RuleTriggers.Submit:
      //如果触发条件是 "Start" 或 "ThingsChanged"，则过滤出规则的 trigger 属性等于该条件的规则
      waitTask = rules.filter((item) => item.trigger === trigger);
      break;
    case RuleTriggers.Running:
      {
        let changeId: string = '';
        if (changeObj) {
          changeId = changeObj === 'all' ? '0' : Object.keys(changeObj)[0];
        }

        //如果触发条件是 "Running"，则过滤出规则的 trigger 属性等于该条件并且与表单数据变化对象有关联的规则
        waitTask = rules.filter((item) => {
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

    default:
      break;
  }
  return waitTask;
}
// 获取表单的规则
const setFormRules = (ruleList: any[]) => {
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

//定义replaceString函数，接收3个参数：ruleStr, formData, attrs
async function replaceString(
  ruleStr: string,
  formData: { [key: string]: any },
  attrs: any[],
): Promise<string> {
  //将ruleStr中的特殊字符「」 提取出来，放到一个数组中，用uniqueArray去重
  const AttrSet = uniqueArray(getAllSpecialCharacter(ruleStr));
  let replacedStr = '';
  //定义一个数组用来存储缺少的属性
  const missingAttrs: string[] = [];
  //一、判断是否有限定字符FixedCharacters，替换所有限定字符为对应数据值
  replacedStr = await fixedCharacterResolver(ruleStr);
  //二、替换所有表单特性为对应数据值 使用reduce对AttrSet数组进行遍历和处理,
  replacedStr = await formAttrResolver(
    ruleStr,
    AttrSet.filter((v) => !FixedCharacters.includes(v)),
    formData,
    attrs,
    missingAttrs,
  );
  //三、根据已有数据 执行内部函数，获取对应数据,
  //TODO:
  //如果missingAttrs数组中有缺少的属性，打印错误信息并返回空字符串
  if (missingAttrs.length > 0) {
    console.error(
      `公式处理失败：${missingAttrs.map((item) => `${item}数据缺失`).join('、')}`,
    );
    return '';
  }

  //如果没有缺少的属性，返回替换后的字符串
  return replacedStr ?? '';
}
/* 表单特性处理 */
const formAttrResolver = async (
  ruleStr: string,
  ruleAttrs: any[],
  formData: RuleTypes.DataType,
  formAttr: any[],
  missingAttrs: string[],
) => {
  if (!ruleStr) {
    return '';
  }
  const replacedStr = ruleAttrs
    .map((_str) => getSpecialChartcterContent(_str))
    .reduce((ruleContent, item) => {
      //在attrs数组中查找是否有name等于item的对象
      const attrObj = formAttr.find((v: { name: string }) => v.name === item);

      //如果没找到，则将item加入到missingAttrs数组中，返回ruleContent
      if (!attrObj) {
        missingAttrs.push(item!);
        return ruleContent;
      }

      //如果找到了，从formData中获取该属性的值
      const attrValue = formData?.[attrObj.id];

      //如果有值，则使用属性值替换掉规则字符串中的「item」，返回替换后的结果
      if (attrValue && ruleContent) {
        return ruleContent.replaceAll(`「${item}」`, attrValue);
      } else {
        //如果没有值，将item加入到missingAttrs数组中，返回ruleContent
        missingAttrs.push(item!);
        return ruleContent;
      }
    }, ruleStr);

  return replacedStr ?? '';
};

/* 固定字符处理 */
const fixedCharacterResolver = async (ruleStr: string) => {
  const _company = (await import('../workFormRules')).default.companyMeta;
  if (!ruleStr) {
    return '';
  }
  //一、判断是否有限定字符FixedCharacters，替换所有限定字符为对应数据值
  //将FixedCharacters数组转化为一个正则表达式，匹配规则字符串中的所有固定字符，并将其替换为对应的数据值
  const fixedRegex = new RegExp(`(${FixedCharacters.join('|')})`, 'g');
  const replacedStr = ruleStr.replace(fixedRegex, (char) => {
    switch (char) {
      case '「单位名称」':
        return _company.name;
      case '「单位编码」':
        return _company.id;
      case '「使用人名称」':
        return OrgCtrl.user.metadata.name;
      case '「使用人编码」':
        return OrgCtrl.user.metadata.id;
      case '「系统时间」':
        return `'${dayjs().format('YYYY-MM-DD HH:mm:ss')}'`;
      default:
        return '';
    }
  });
  return replacedStr ?? '';
};
export {
  filterRules,
  findKeyByName,
  fixedCharacterResolver,
  getAllSpecialCharacter,
  getSpecialChartcterContent,
  removeNullObj,
  replaceString,
  setFormRules,
  uniqueArray,
};
