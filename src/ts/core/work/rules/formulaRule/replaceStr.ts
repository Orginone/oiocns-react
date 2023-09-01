import { uniqueArray, getAllFixedCharacter, getChartcterContent } from '../lib/tools';
import { RuleTypes } from '../type.d';
// import { FixedCharacters } from '../lib/const';
const FixedCharacters = [
  '「单位名称」',
  '「单位编码」',
  '「使用人名称」',
  '「使用人编码」',
  '「系统时间」',
  '「」',
];
//定义replaceString函数，接收3个参数：ruleStr, formData, attrs
export default async function replaceString(
  ruleStr: string,
  formData: { [key: string]: any },
  attrs: any[],
): Promise<string> {
  //将ruleStr中的特殊字符「」 提取出来，放到一个数组中，用uniqueArray去重
  const AttrSet = uniqueArray(getAllFixedCharacter(ruleStr));
  let replacedStr = '';
  //定义一个数组用来存储缺少的属性
  const missingAttrs: string[] = [];
  //一、判断是否有限定字符FixedCharacters，替换所有限定字符为对应数据值
  replacedStr = await fixedCharacterResolver(ruleStr);
  //二、替换所有表单特性为对应数据值 使用reduce对AttrSet数组进行遍历和处理,
  replacedStr = await formAttrResolver(ruleStr, AttrSet, formData, attrs, missingAttrs);
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
    .map((_str) => getChartcterContent(_str))
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
/* 固定字符处理 */
const fixedCharacterResolver = (ruleStr: string) => {
  if (!ruleStr) {
    return '';
  }
  //一、判断是否有限定字符FixedCharacters，替换所有限定字符为对应数据值
  //将FixedCharacters数组转化为一个正则表达式，匹配规则字符串中的所有固定字符，并将其替换为对应的数据值
  const fixedRegex = new RegExp(`(${FixedCharacters.join('|')})`, 'g');
  const replacedStr = ruleStr.replace(fixedRegex, (char) => {
    switch (char) {
      case '「单位名称」':
        return 'ABC公司';
      case '「单位编码」':
        return '123456';
      case '「使用人名称」':
        return '张三';
      case '「使用人编码」':
        return '0001';
      case '「系统时间」':
        return new Date().toLocaleString();
      default:
        return '';
    }
  });
  return replacedStr ?? '';
};

// /* 内置函数处理 */
// const builtInFunResolver = () => {};

// /* 外部请求处理处理 */
// const externalFunResolver = () => {};
