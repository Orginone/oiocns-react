import { uniqueArray } from '../tools';

export default function replaceString(ruleStr: string, formData, attrs): string {
  let errInfoArr: string[] = [];
  let ruleContent: string = ruleStr;
  let isContinue: boolean = true;
  // 获取内容区 特殊字符 并且去重;
  const AttrSet = uniqueArray(ruleContent.match(/[\u4e00-\u9fa5]+/g));
  for (const item of AttrSet) {
    const attrObj = attrs.find((v) => v.name === item);
    if (!attrObj) {
      errInfoArr.push('未找到计算项：' + item);
    }
    if (attrObj && formData?.[attrObj.id]) {
      ruleContent = ruleContent.replace(`「${item}」`, formData[attrObj.id]);
    } else {
      /* 存在计算项 缺失 */
      isContinue = false;
      errInfoArr.push('计算项数据缺失：' + item);
      break;
    }
  }

  /* 拦截最终计算 :存在计算项缺失、目标对象不在关联项存在*/
  if (!isContinue) {
    console.error('公式处理失败：' + errInfoArr.join('、'));
    return '';
  }
  return ruleContent;
}
