import RuleBase, { IRuleBaseType } from '../base/ruleBase';
import { getChartcterContent, findKeyWidthName } from '../tools';
import replaceString from './replaceStr';
/**
 *@desc 规定 公式取值必须使用「」作为中文字包裹特殊字符
 */

interface FormulaRuleType extends IRuleBaseType {}
class FormulaRule extends RuleBase implements FormulaRuleType {
  constructor(data: any) {
    super(data);
    this.ruleType = 'formula';
  }

  dealRule = async ({ $formData, $attrs }: any): Promise<any> => {
    const ruleStr: string = this.content;
    // 切分字符为目标内容和公式内容区
    const [targetContent, formulaContent] = ruleStr.split('=');

    // 通过目标内容name，在表单特性里找到对应 目标key（id）
    let ruleAimKey: string =
      findKeyWidthName(getChartcterContent(targetContent) as string, $attrs) ?? '';
    // 如果没有目标项，则报错直接返回
    if (!ruleAimKey) {
      return {
        success: false,
        data: null,
        errMsg: `未找到：${targetContent}对应特性，请检查`,
      };
    }

    // 处理特殊标记「」
    let resultString: string = await replaceString(
      formulaContent.trim(),
      $formData,
      $attrs,
    );

    //处理函数请求例如SUM等，需要依据上一步获取到的数据，再次加工数据。，

    // 最终处理 JavaScript 函数
    try {
      let result = eval(resultString);
      return { success: true, data: { [ruleAimKey]: result }, errMsg: '' };
    } catch (err) {
      return { success: false, data: null, errMsg: '处理公式有误' };
    }
  };
  loadRemoteDatas(): void {
    throw new Error('Method not implemented.');
  }
  generateRule(): void {}
}

export default FormulaRule;
