import RuleBase, { IRuleBase } from '../base/ruleBase';
import { getChartcterContent, findKeyByName } from '../lib/tools';
import replaceString from './replaceStr';
/**
 *@desc 规定 公式取值必须使用「」作为中文字包裹特殊字符
 */

interface FormulaRuleType extends IRuleBase {}
class FormulaRule extends RuleBase implements FormulaRuleType {
  constructor(data: any) {
    super(data);
    this.ruleType = 'formula';
  }

  dealRule = async ({ $formData, $attrs }: any): Promise<any> => {
    const ruleStr: string = this.content;

    // 切分字符为目标内容和公式内容区
    const [targetContent, formulaContent] = ruleStr.split('=');

    // 获取目标键（id）
    let targetKey: string | undefined =
      findKeyByName(getChartcterContent(targetContent) as string, $attrs) ?? '';

    if (!targetKey) {
      return {
        success: false,
        data: null,
        errMsg: `未找到：${targetContent}对应特性，请检查`,
      };
    }

    try {
      // 处理特殊标记「」
      let resultString: string = await replaceString(
        formulaContent.trim(),
        $formData,
        $attrs,
      );

      // 最终处理 JavaScript 函数
      let result: any = eval(resultString);

      if (isNaN(result)) {
        return { success: false, data: null, errMsg: '计算结果非数字' };
      }

      let finalResult = {
        [targetKey]: result,
      };

      return {
        success: true,
        data: finalResult,
        errMsg: '',
      };
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
