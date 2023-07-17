import RuleBase, { IRuleBaseType } from '../base/ruleBase';
import { extractContent, findKeyWidthName } from '../tools';
import replaceString from './replaceStr';
class FormulaRule extends RuleBase implements IRuleBaseType {
  constructor(data) {
    super(data);
    this.ruleType = 'formula';
  }
  /* 处理结果 formData，attrs ruleStr */
  dealRule = async (formData: { [key: string]: any } = {}): Promise<any> => {
    console.log('公式处理方法,返回结果');
    const ruleStr: string = this.content;
    const attrs: any[] = this.linkAttrs;
    /* 切分字符为 目标内容 和 公式内容区 */
    const _RuleArr: string[] = ruleStr.split('=');
    /* 获取目标值的id作为key */
    let ruleAimKey: string =
      findKeyWidthName(extractContent(_RuleArr[0]) as string, attrs) ?? '';
    /* 无目标项，直接终止规则 */
    if (!ruleAimKey) {
      return { success: false, data: null, errMsg: '公式不完整，请检查' };
    }
    /* 获取内容区字符串 */

    let resultString: string = _RuleArr[1].trim();
    /*1 依次处理 特殊标记 */
    /*1.1 处理表单字符 不包含特殊函数 :`「净值」「原值」「累计折旧值」` */
    resultString = await replaceString(resultString, formData, attrs);
    /*1.2 处理系统公式 `取数函数；获取系统时间；获取当前操作人，当前单位，当前部门` 「系统时间」「当前操作人」...  */
    // resultString = await handleExtra(ruleStr, formData, attrs);

    /*1.3复合公式 */

    /*最终处理 js函数  (a+b-c/d)*/
    try {
      let _data = eval(resultString);
      return { success: false, data: _data, errMsg: '' };
    } catch (err) {
      return { success: false, data: null, errMsg: '处理公式有误' };
    }
  };
  loadRemoteRules(): void {}
  generateRule(): void {}
}
export default FormulaRule;
