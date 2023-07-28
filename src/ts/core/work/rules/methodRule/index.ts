import RuleBase, { IRuleBase } from '../base/ruleBase';
import { removeNullObj } from '../lib/tools';
/**
 * 初始化返回结果 data=>{key：value，key2：value2}
 * 运行中返回结果 data=>{key：value，key2：value2}
 * 提交时返回结果 data=>boolean
 */
class MethodRule extends RuleBase implements IRuleBase {
  constructor(data: any) {
    super(data);
    this.ruleType = 'method';
    this.targetId = data.targetId;
  }
  /* 函数目标对象：用于接受展示函数结果 */
  targetId: string;
  dealRule = async (props: any): Promise<any> => {
    /*最终处理 js函数*/
    try {
      const _data = eval(this.content)(props);
      const data: Record<string, any> =
        typeof _data === 'object' ? _data : { [this.targetId]: _data };
      return { success: true, data: removeNullObj(data), errMsg: '' };
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
