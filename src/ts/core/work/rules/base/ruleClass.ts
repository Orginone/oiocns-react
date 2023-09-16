import { RuleTriggers } from '../../../public/enums';
import RuleBase, { IRuleBase } from '../base/ruleBase';

import type { RuleTypes } from '../type.d';
import {
  getSpecialChartcterContent,
  findKeyByName,
  replaceString,
  removeNullObj,
} from '../lib/tools';
/**
 *@desc 公式类型 规则
  规定 公式取值必须使用「」作为中文字包裹特殊字符
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
      findKeyByName(getSpecialChartcterContent(targetContent) as string, $attrs) ?? '';

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
}

/**
 * @desc:函数类型 规则
 * 初始化返回结果 data=>{key：value，key2：value2}
 * 运行中返回结果 data=>{key：value，key2：value2}
 * 提交时返回结果 data=>boolean
 */
interface MethodRuleData extends IRuleBase {
  targetId: string;
}
class MethodRule extends RuleBase implements IRuleBase {
  private readonly targetId: string;

  constructor(data: MethodRuleData) {
    super(data);
    this.ruleType = 'method';
    this.targetId = data.targetId;
  }

  /* 执行js，生成结果 */
  public async dealRule(props: any): Promise<RuleTypes.ResultType> {
    try {
      const _data = eval(this.content)(props);
      const result = await this._handleResult(_data);
      return { success: true, data: result, errMsg: '' };
    } catch (err) {
      return { success: false, data: null, errMsg: '处理函数有误' };
    }
  }

  /* 处理最终展示结果 */
  private async _handleResult(resValue: any): Promise<boolean | Record<string, any>> {
    if (this.trigger === RuleTriggers.Submit) {
      return resValue;
    }

    const data: Record<string, any> =
      typeof resValue === 'object' ? resValue : { [this.targetId]: resValue };
    return await removeNullObj(data);
  }
}
export { FormulaRule, MethodRule };
