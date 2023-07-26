import OrgCtrl from '@/ts/controller';
import FormulaRule from './formulaRule';
import MethodRule from './methodRule';
import { Emitter } from '@/ts/base/common';
import { sleep } from '../../../base/common';
import { RuleTypes } from './type.d';
import { IRuleBase } from './base/ruleBase';
enum RuleType {
  'formula' = 'formula',
  'method' = 'method',
}

class WorkFormRules extends Emitter {
  constructor(forms: any[], beloneId: string) {
    super();
    this._beloneId = beloneId;
    this.queryAllFormRules(forms);
  }
  /* 办事归属权 */
  _beloneId: string;
  /* 所有表单规则 */
  _AllFormRules: Map<string, { rules: IRuleBase[]; attrs: any[] }> = new Map([]);
  isReady: boolean = false;

  /* 获取表单关联规则 */
  private queryAllFormRules = async (forms: any[]) => {
    let count = 0;
    for (const formItem of forms) {
      const { list: ruleList = [] } = JSON.parse(formItem.metadata?.rule ?? '{}');
      this._AllFormRules.set(formItem.id, {
        rules: await this.setFormRules(ruleList),
        attrs: formItem.fields,
      });
      count++;
      if (count === forms.length) {
        this.isReady = true;
        this.changCallback();
        console.log('办事所有表单规则', forms, this._AllFormRules);
      }
    }
  };

  /* 获取表单关联规则 */
  private async setFormRules(ruleList: any[]) {
    let _list = [];
    /* 处理规则类型 */
    for (const _r of ruleList) {
      switch (_r.ruleType) {
        case RuleType.formula:
          _list.push(new FormulaRule(_r));
          break;
        case RuleType.method:
          _list.push(new MethodRule(_r));
          break;
        default:
          break;
      }
    }
    return _list;
  }
  /* 获取额外远程规则 */
  async loadRemoteRules(path: string) {
    await sleep(500);
    console.log(path, '暂无远程规则库');

    // this._AllRules.push(new MethodRule(_r));
  }
  /**
   * @desc 处理完一类规则，返回所有要回显至表单的数据，通过回调页面方法操作表单 {attrId1：value1，attrId2：value2}
   * @param trigger 触发方式
   * @param formData 当前表单数据  用于处理 运行中，及提交时 读取表单数据
   * @param callBack 处理完成的回调
   * //TODO:通过增加 权重参数，修改规则执行顺序；当前为 按顺序执行
   */
  async resloveFormRule(
    trigger: RuleTypes.TriggerType,
    formData: { id: string; data: RuleTypes.DataType; attrs: any[] },
    callBack: (data: any) => void,
  ) {
    const { id, data } = formData;
    if (this._AllFormRules.has(id)) {
      const _info: { rules: IRuleBase[]; attrs: any[] } = this._AllFormRules.get(id)!;
      let _Rules: IRuleBase[] = _info!.rules.filter((item) => item.trigger === trigger);
      const reslut = await this.renderRules(_Rules, { data:data?.[0], attrs: _info.attrs });
      console.log('执行结果' + id, '====>', reslut,data);

      /* 弹出数据，展示层处理数据展示逻辑 */
      callBack && callBack(reslut);
    }
  }

  /**
   * @desc 触发规则处理  处理完一类规则，返回所有要回显至表单的数据，通过回调页面方法操作表单 {attrId1：value1，attrId2：value2}
   * @param trigger 触发方式
   * @param formData 当前表单数据  用于处理 运行中，及提交时 读取表单数据
   * @param callBack 处理完成的回调
   * //TODO:通过增加 权重参数，修改规则执行顺序；当前为 按顺序执行
   */
  private async renderRules(
    Rules: any[],
    formData: { attrs: RuleTypes.DataType[]; data: RuleTypes.DataType },
  ) {
    /* 最终输出结果 */
    let resultObj = {};
    console.log('待处理规则', Rules);
    for (let i = 0; i < Rules.length; i++) {
      const _R = Rules[i];
      try {
        /* 对执行函数增加默认数据 依次为 表单数据、表单特性、单位数据、个人数据 ...*/
        let res = await _R.dealRule({
          $formData: formData.data,
          $attrs: formData.attrs,
          $company:
            OrgCtrl.user.companys.find((v) => v.id === this._beloneId)?.metadata ?? {},
          $user: OrgCtrl.user.metadata,
        });
        console.log('规则执行结果', _R.name, '===>', res);
        if (res.success) {
          resultObj = { ...resultObj, ...res.data };
        }
      } catch (error) {
        throw new Error('规则解析错误：' + _R.name);
      }
    }

    console.log('所有规则最终数据结果', resultObj);
    return resultObj;
  }
}

export default WorkFormRules;
