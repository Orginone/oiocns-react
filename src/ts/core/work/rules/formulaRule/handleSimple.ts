import { ruleResultType } from '../base/ruleBase';
import { extractContent, findKeyWidthName, uniqueArray } from '../tools';

export default function handleSimple(ruleStr: string, formData, attrs): ruleResultType {
  /* 切分字符为 目标内容 和 公式内容区 */
  const _RuleArr: string[] = ruleStr.split('=');
  let errInfoArr: string[] = [];
  //是否继续计算：用于判断，计算项缺失时，是否继续计算
  let isContinue: boolean = true;
  /* 获取目标值的id作为key */
  let ruleAimKey: string =
    findKeyWidthName(extractContent(_RuleArr[0]) as string, attrs) ?? '';
  if (!ruleAimKey) {
    isContinue = false;
    errInfoArr.push('未找到 公式目标项');
  }
  /* 获取内容区字符串 */
  let ruleContent: string = _RuleArr[1].trim();
  /* 获取内容区 特殊字符 并且去重 */
  const AttrSet = uniqueArray(ruleContent.match(/[\u4e00-\u9fa5]+/g));
  for (const item of AttrSet) {
    const attrObj = attrs.find((v) => v.name === item);
    if (!attrObj) {
      errInfoArr.push('未找到计算项：' + item);
    }
    if (attrObj && formData?.[attrObj.id]) {
      ruleContent = ruleContent.replaceAll(`「${item}」`, formData[attrObj.id]);
    } else {
      /* 存在计算项 缺失 */
      isContinue = false;
      errInfoArr.push('计算项数据缺失：' + item);
      break;
    }
  }

  /* 拦截最终计算 :存在计算项缺失、目标对象不在关联项存在*/
  if (!isContinue || !ruleAimKey) {
    return {
      success: false,
      data: {},
      errMsg: errInfoArr.join('、'),
    };
  }
  /* 进行计算 */
  try {
    /* 正常返回 */
    const value = eval(ruleContent!);
    return {
      success: true,
      data: { [ruleAimKey]: value },
      errMsg: '',
    };
  } catch (err) {
    /* 异常返回 */
    return {
      success: false,
      data: {},
      errMsg: '规则解析有误' + this?.name,
    };
  }
}
