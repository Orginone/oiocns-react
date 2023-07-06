import RuleBase, { IRuleBaseType, ruleResultType } from '../base/ruleBase';
import handleSimple from './handleSimple';
/* 
使用特殊符号区分关键字 『』「」如 「使用人」「使用人部门」 「使用人手机号」 
    // let formData = { 666: 100, 888: 20 };
    // let attrs = [
    //   { name: '净值', id: '123', code: 'jingzhi' },
    //   { name: '原值', id: '666', code: 'value' },
    //   { name: '累计折旧值', id: '888', code: 'zhejiu' },
    // ];
    // const ruleStr = `「净值」=「原值」 -「累计折旧值」`;
*/
class FormulaRule extends RuleBase implements IRuleBaseType {
  constructor(data) {
    super(data);
    this.ruleType = 'formula';
  }
  /* 处理结果 formData，attrs ruleStr */
  dealRule(formData: { [key: string]: any } = {}) {
    console.log('公式处理方法,返回结果');
    const ruleStr: string = this.content;
    const attrs: any[] = this.linkAttrs;
    /*1 区分公式类型 */
    let ruleFunType: string = '';

    /*1.1 处理简单计算公式 不包含特殊函数 :`「净值」=「原值」 -「累计折旧值」`*/
    if (ruleStr.includes('=') && !ruleStr.includes('$')) {
      ruleFunType = 'SIMPLE';
    }

    /*1.2 处理系统内置公式 `自动生成 编码；获取系统时间；获取当前操作人，当前单位，当前部门` 「系统时间」「当前操作人」...  */
    if (!ruleStr.includes('=') && ruleStr.includes('$SYSTEM')) {
      ruleFunType = 'SYSTEM';
    }

    /*1.3复合公式 */

    switch (ruleFunType) {
      case 'SIMPLE':
        return handleSimple(ruleStr, formData, attrs);
      case 'SYSTEM':
      default:
        return handleSimple(ruleStr, formData, attrs);
    }
  }
  loadRemoteRules(): void {}
  generateRule(): void {}
}
export default FormulaRule;
