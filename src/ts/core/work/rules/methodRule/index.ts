import { RuleTriggers } from '@/ts/base/model';
import RuleBase, { IRuleBase } from '../base/ruleBase';
import { removeNullObj } from '../lib/tools';

interface MethodRuleData extends IRuleBase {
  targetId: string;
}

interface RuleResult {
  success: boolean;
  data: any;
  errMsg: string;
}

/**
 * 初始化返回结果 data=>{key：value，key2：value2}
 * 运行中返回结果 data=>{key：value，key2：value2}
 * 提交时返回结果 data=>boolean
 */
class MethodRule extends RuleBase implements IRuleBase {
  private readonly targetId: string;

  constructor(data: MethodRuleData) {
    super(data);
    this.ruleType = 'method';
    this.targetId = data.targetId;
  }

  /* 执行js，生成结果 */
  public async dealRule(props: any): Promise<RuleResult> {
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

export default MethodRule;
