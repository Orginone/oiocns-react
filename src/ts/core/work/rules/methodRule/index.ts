import RuleBase, { IRuleBaseType } from '../base/ruleBase';

class MethodRule extends RuleBase implements IRuleBaseType {
  constructor(data) {
    super(data);
    this.ruleType = 'method';
  }
  dealRule = async (): Promise<any> => {
    console.log('函数处理方法');
    /*最终处理 js函数  (a+b-c/d)*/
    try {
      let _data = eval(this.content);
      return { success: false, data: _data, errMsg: '' };
    } catch (err) {
      return { success: false, data: null, errMsg: '处理函数有误' };
    }
  };
  loadRemoteRules(): void {
    throw new Error('loadRemoteRules not implemented.');
  }
  generateRule(): void {
    throw new Error('generateRule not implemented.');
  }
}
export default MethodRule;
