import OrgCtrl from '@/ts/controller';
import FormulaRule from './formulaRule';
import MethodRule from './methodRule';
import { Emitter } from '@/ts/base/common';
import { sleep } from '../../../base/common';
import { RuleTypes } from './type.d';
import { IRuleBase } from './base/ruleBase';
import { debounce } from '@/utils/tools';
import { DataType } from 'typings/globelType';
import { filterRules } from './lib/tools';

// 定义规则类型常量，方便代码维护
const RuleType = {
  FORMULA: 'formula',
  METHOD: 'method',
};

// 定义表单规则的类型
export type WorkFormRulesType = {
  isReady: boolean;
  _beloneId: string;
  _AllFormRules: Map<string, { rules: IRuleBase[]; attrs: any[] }>;
  initRules: (forms: any[]) => void;
  setFormCallback: (formId: string, callBack: (data: any) => void) => void;
  loadRemoteRules: (forms: any[]) => void;
  resloveFormRule: (
    trigger: RuleTypes.TriggerType,
    formData: { id: string; data: RuleTypes.DataType },
    changeObj?: DataType, //变动项
  ) => void;
  renderRules: (
    Rules: any[],
    formData: { attrs: RuleTypes.DataType[]; data: RuleTypes.DataType },
  ) => void;
};

// 定义表单规则的键值对类型
type MapType = { rules: IRuleBase[]; attrs: any[]; callback?: (data: DataType) => void };

class WorkFormRules extends Emitter {
  constructor(forms: any[], beloneId: string) {
    super();
    this._beloneId = beloneId;
    this.initRules(forms);
  }

  // 办事归属权
  private _beloneId: string;

  // 所有表单规则
  private _AllFormRules: Map<string, MapType> = new Map([]);

  // 是否所有规则都已加载完毕
  public isReady: boolean = false;

  // 初始化表单规则
  private initRules = async (forms: any[]) => {
    let count = 0;
    console.log(8888, forms);
    //TODO:区分主子表
    // 遍历每个表单，获取其中的规则
    for (const formItem of forms) {
      const { list: ruleList = [] } = JSON.parse(formItem.metadata?.rule ?? '{}');

      // 将表单的规则存入 _AllFormRules 中
      this._AllFormRules.set(formItem.id, {
        rules: await this.setFormRules(ruleList),
        attrs: formItem.fields,
        callback: undefined,
      });
      count++;

      // 如果所有的表单规则已经全部加载完毕，将 isReady 设为 true，并通知回调函数
      if (count === forms.length) {
        this.isReady = true;
        this.changCallback();
        console.log('已办事所有表单规则', forms, this._AllFormRules);
      }
    }
  };

  // 设置表单的回调函数
  public setFormCallback(formId: string, callback: () => DataType) {
    const _aimFormInfo: MapType = this._AllFormRules.get(formId)!;

    // 如果该表单没有回调函数，则将该回调函数赋值给它，并执行一个 "Start" 触发器
    if (!_aimFormInfo.callback) {
      this._AllFormRules.set(formId, { ..._aimFormInfo, callback });
      this.resloveFormRule('Start', { id: formId, data: {} });
    }
  }

  // 获取表单的规则
  private async setFormRules(ruleList: any[]) {
    let _list = [];

    // 遍历所有规则，根据规则类型创建不同的规则对象
    for (const _r of ruleList) {
      switch (_r.ruleType) {
        case RuleType.FORMULA:
          _list.push(new FormulaRule(_r));
          break;
        case RuleType.METHOD:
          _list.push(new MethodRule(_r));
          break;
        default:
          break;
      }
    }

    return _list;
  }

  // 加载远程的规则库
  async loadRemoteRules(path: string) {
    await sleep(500);
    console.log(path, '暂无远程规则库');
  }

  /**
   * 触发表单规则的处理
   * @param trigger 触发方式
   * @param formData 当前表单数据，用于处理运行中、提交时读取表单数据
   * @param changeObj 表单操作变化的值
   */
  public resloveFormRule = debounce(
    async (
      trigger: RuleTypes.TriggerType,
      formData: { id: string; data: RuleTypes.DataType },
      changeObj?: DataType | 'all',
    ) => {
      const { id, data } = formData;

      // 如果 _AllFormRules 中存在这个表单的规则，则取出该表单的规则进行处理
      if (this._AllFormRules.has(id)) {
        const _info: MapType = this._AllFormRules.get(id)!;

        // 执行该表单的所有规则，并将规则返回的数据保存到 resultObj 中
        const resultObj = await this.renderRules(
          filterRules(_info.rules, trigger, changeObj),
          { data: data, attrs: _info.attrs },
        );

        // 如果该表单设置了回调函数，则调用回调函数将数据传递给页面
        _info.callback && _info.callback(resultObj);

        // 如果该表单没有设置回调函数，则输出错误信息
        if (!_info.callback) {
          console.error('未设置回调函数：' + id);
        }
        if (trigger == 'Start') {
          this.resloveFormRule('Running', { id, data: resultObj }, 'all');
        }
      }
    },
    300,
  );

  /**
   * 触发表单规则的处理，并返回所有要回显至表单的数据
   * @param trigger 触发方式
   * @param formData 当前表单数据，用于处理运行中、提交时读取表单数据
   *  //TODO:通过增加 权重参数，修改规则执行顺序；当前为 按顺序执行
   */
  private async renderRules(
    Rules: any[],
    formData: { attrs: RuleTypes.DataType[]; data: RuleTypes.DataType },
  ) {
    let resultObj = {};

    // 遍历该表单的所有规则，并执行每一个规则
    await Promise.all(
      Rules.map(async (_R) => {
        try {
          // 执行该规则，并将规则返回的数据保存到 res 中
          let res = await _R.dealRule({
            $formData: formData.data,
            $attrs: formData.attrs,
            $company:
              OrgCtrl.user.companys.find((v) => v.id === this._beloneId)?.metadata ?? {},
            $user: OrgCtrl.user.metadata,
          });

          // 如果规则执行成功，则将规则返回的数据合并到 resultObj 中
          if (res.success) {
            resultObj = { ...resultObj, ...res.data };
          }
        } catch (error) {
          throw new Error('规则解析错误：' + _R.name);
        }
      }),
    );

    console.log('所有规则最终数据结果', Rules, '===>', resultObj);
    return resultObj;
  }
}

export default WorkFormRules;
