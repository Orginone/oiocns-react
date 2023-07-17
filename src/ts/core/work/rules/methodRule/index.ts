import RuleBase, { IRuleBaseType } from '../base/ruleBase';

class MethodRule extends RuleBase implements IRuleBaseType {
  constructor(data) {
    super(data);
    this.ruleType = 'method';
  }
  dealRule = async (): Promise<any> => {
    console.log('函数处理方法');
  };
  loadRemoteRules(): void {
    throw new Error('loadRemoteRules not implemented.');
  }
  generateRule(): void {
    throw new Error('generateRule not implemented.');
  }
}
export default MethodRule;
