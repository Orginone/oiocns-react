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
  dealRule = async (props: any): Promise<any> => {
    /*最终处理 js函数*/
    try {
      const _data = eval(this.content)(props);
      const data: Record<string, any> =
        typeof _data === 'object' ? _data : { [this.targetId]: _data };

      return { success: true, data, errMsg: '' };
    } catch (err) {
      return { success: false, data: null, errMsg: '处理函数有误' };
    }
  };
  loadRemoteDatas(): void {
    throw new Error('Method not implemented.');
  }

  generateRule(): void {
    throw new Error('generateRule not implemented.');
  }
}

export default MethodRule;
