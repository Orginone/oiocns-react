import RuleBase, { IRuleBaseType } from '../base/ruleBase';
/**
 * 初始化返回结果 data=>{key：value，key2：value2}
 * 运行中返回结果 data=>{key：value，key2：value2}
 * 提交时返回结果 data=>boolean
 */
class MethodRule extends RuleBase implements IRuleBaseType {
  constructor(data: any) {
    super(data);
    this.ruleType = 'method';
  }
  dealRule = async (): Promise<any> => {
    console.log('函数处理', this.name);
    /*最终处理 js函数*/
    try {
      let _data = eval(this.content)();
      if (this.trigger === 'Start') {
        /* 初始化直接返回所有变更对象， 与目标对象无关 */
        return { success: true, data: _data, errMsg: '' };
      }
      return { success: true, data: { [this.targetId]: _data }, errMsg: '' };
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
