import RuleBase, { IRuleBaseType } from '../base/ruleBase';
import { extractContent, findKeyWidthName } from '../tools';
import replaceString from './replaceStr';

class FormulaRule extends RuleBase implements IRuleBaseType {
  constructor(data: any) {
    super(data);
    this.ruleType = 'formula';
  }

  dealRule = async ({ $formData, $attrs }: any): Promise<any> => {
    const ruleStr: string = this.content;
    // 切分字符为目标内容和公式内容区
    const [targetContent, formulaContent] = ruleStr.split('=');

    // 从目标内容中获取目标key
    let ruleAimKey: string =
      findKeyWidthName(extractContent(targetContent) as string, $attrs) ?? '';
    // 如果没有目标项，则直接返回
    if (!ruleAimKey) {
      return { success: false, data: null, errMsg: '公式不完整，请检查' };
    }

    // 处理特殊标记
    let resultString: string = await replaceString(
      formulaContent.trim(),
      $formData,
      $attrs,
    );

    // 最终处理 JavaScript 函数
    try {
      let result = eval(resultString);
      return { success: true, data: { [ruleAimKey]: result }, errMsg: '' };
    } catch (err) {
      return { success: false, data: null, errMsg: '处理公式有误' };
    }
  };

  loadRemoteRules(): void {}

  generateRule(): void {}
}

export default FormulaRule;
