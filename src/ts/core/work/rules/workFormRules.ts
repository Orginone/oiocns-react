import OrgCtrl from '@/ts/controller';

import { Emitter } from '@/ts/base/common';
import { sleep } from '../../../base/common';
import { RuleTypes } from './type.d';
// import { IRuleBase } from './base/ruleBase';
// import { debounce } from '@/utils/tools';
import { DataType } from 'typings/globelType';
import { filterRules, setFormRules } from './lib/tools';
import * as Tools from './lib';
import { RuleTriggers } from '@/ts/base/model';
import { ValueGoal } from './base/enum';
import { XEntity } from '@/ts/base/schema';
import { IBelong } from '../../target/base/belong';

// 定义表单规则的类型
export type WorkFormRulesType = {
  /* 办事规则是否处理完成 */
  isReady: boolean;
  /* 办事归属权 */
  currentCompanyInfo: XEntity;
  // /* 收集办事表单的规则 */
  // _AllFormRules: Map<string, { rules: IRuleBase[]; attrs: any[] }>;
  /* 当前选中 主表的id标识 */
  currentMainFormId?: string;
  /* 设置最新表单数据 */
  serFormData: any;
  // /* 初始化规则*/
  // initFormRules: (forms: any[]) => void;
  /* 表单渲染时，需提交表单修改方式 至此，用于规则处理后的回显：考虑返回规则执行结果，到页面处理渲染逻辑*/
  setFormChangeCallback: (formId: string, callback: () => DataType) => void;
  /* 加载表单远程规则*/
  loadRemoteRules: (path: string) => Promise<void>;
  /* 处理表单规则，需提供表单标识，表单数据，当前修改数据等*/
  resloveFormRule: (
    trigger: RuleTypes.TriggerType,
    formData: { id: string; data: RuleTypes.DataType },
    changeObj?: DataType, //变动项
  ) => void;
  /* 执行所有表单的最终提交规则 */
  resloveSubmitRules: () => Promise<boolean>;
};

class WorkFormRules extends Emitter implements WorkFormRulesType {
  constructor() {
    super();
    this.currentCompanyInfo = {} as any;
  }
  /* 当前主表id */
  public currentMainFormId: string = '';
  // 是否所有规则都已加载完毕
  public isReady: boolean = false;
  // 单位信息
  public currentCompanyInfo: XEntity;
  // 所有表单规则
  private _AllFormRules: Map<string, RuleTypes.MapType> = new Map([]);
  // 所有表单id，对应的主子表信息
  private _FormIdtoType: Map<string, string> = new Map([]);
  /* 当前办事所有表单数据 */
  private _NewFormData: Map<string, { after: DataType[] }> = new Map([]);
  /* 设置当前办事已修改的所有信息 */
  public set serFormData(data: any) {
    this._NewFormData = data;
  }

  // 初始化表单规则
  public initFormRules = (forms: any[], belone: IBelong) => {
    this._clearData();
    this.currentCompanyInfo = belone.metadata.belong as XEntity;
    let count = 0;
    // 遍历每个表单，获取其中的规则
    for (const formItem of forms) {
      const { list: ruleList = [] } = JSON.parse(formItem.metadata?.rule ?? '{}');
      /* 收集主子表信息 */
      this._FormIdtoType.set(formItem.id, formItem.typeName);
      // 将表单的规则存入 _AllFormRules 中
      this._AllFormRules.set(formItem.id, {
        rules: setFormRules(ruleList),
        attrs: formItem.fields,
        callback: undefined,
      });
      count++;

      // 如果所有的表单规则已经全部加载完毕，将 isReady 设为 true，并通知回调函数
      if (count === forms.length) {
        this.isReady = true;
        this.changCallback();
      }
    }
  };

  // 设置表单的回调函数，表单首次渲染时触发
  public setFormChangeCallback(formId: string, callback: () => DataType): void {
    const _aimFormInfo: RuleTypes.MapType = this._AllFormRules.get(formId)!;

    // 如果该表单没有回调函数，则将该回调函数赋值给它，并执行一个 "Start" 触发器-即表单初始化
    if (!_aimFormInfo.callback) {
      this._AllFormRules.set(formId, { ..._aimFormInfo, callback });
      this.resloveFormRule(RuleTriggers.Start, { id: formId, data: {} });
    }
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
  public resloveFormRule = async (
    trigger: RuleTypes.TriggerType,
    formData: { id: string; data: RuleTypes.DataType },
    changeObj: DataType | 'all' = 'all',
  ) => {
    const { id, data } = formData;

    // 根据触发类型确定待处理规则所属的表单ID
    const _formId = trigger === RuleTriggers.ThingsChanged ? this.currentMainFormId : id;

    if (this._AllFormRules.has(_formId)) {
      const _info: RuleTypes.MapType = this._AllFormRules.get(_formId)!;

      // 构建执行规则所需参数
      let params: any = {
        data,
        attrs: _info.attrs,
      };

      /* 收集子表数据 */
      if (trigger === RuleTriggers.ThingsChanged) {
        params['things'] = this._NewFormData.get(id)?.after;
      }

      // 执行符合条件的规则，并将结果保存到 resultObj 中
      const resultObj = await this.renderRules(
        filterRules(_info.rules, trigger, changeObj),
        params,
      );

      /* 提交验证直接返回 */
      if (trigger === RuleTriggers.Submit) {
        return resultObj;
      }

      // 如果该表单设置了回调函数，则调用回调函数将数据传递给页面
      if (_info.callback) {
        _info.callback(resultObj as Object);

        /* 若初始化结束，需执行一次运行态规则 */
        if (
          trigger === RuleTriggers.Start &&
          typeof resultObj === 'object' &&
          Object.keys(resultObj).length > 0
        ) {
          this.resloveFormRule(RuleTriggers.Running, { id: _formId, data: resultObj });
        }
      } else {
        console.error('未设置回调函数：' + _formId);
      }
    }
  };

  public resloveSubmitRules = async () => {
    let _Results = [];
    for (const [key, value] of this._FormIdtoType) {
      if (value === '主表') {
        const paramns: any = { id: key, data: this._NewFormData.get(key)?.after?.[0] };
        _Results.push(await this.resloveFormRule(RuleTriggers.Submit, paramns));
      }
    }
    let res = _Results.flat().some((v) => v == false);

    return !res;
  };
  /**
   * 执行过滤后的最终规则，并返回所有要回显至表单的数据
   * @param trigger 触发方式
   * @param formData 当前表单数据，用于处理运行中、提交时读取表单数据
   *  //TODO:通过增加 权重参数，修改规则执行顺序；当前为 按顺序执行
   */
  private async renderRules(
    Rules: any[],
    formData: {
      attrs: RuleTypes.DataType[];
      data: RuleTypes.DataType;
      things?: DataType[];
    },
  ) {
    if (Rules.length == 0) {
      return;
    }
    let resultObj = {};
    if (Rules?.[0].trigger === RuleTriggers.Submit) {
      resultObj = [];
    }
    let other: any[] = [];

    // 遍历该表单的所有规则，并执行每一个规则
    await Promise.all(
      Rules.map(async (_R) => {
        try {
          // 执行该规则，并将规则返回的数据保存到 res 中
          let res = await _R.dealRule({
            $formData: formData.data, //主表数据
            $attrs: formData.attrs, //主表所有特性
            $things: formData?.things ?? [], //子表数据
            $company: this.currentCompanyInfo, //单位信息
            $user: OrgCtrl.user.metadata, //用户信息
            tools: Tools, //方法库
          });

          // 如果规则执行成功，则将规则返回的数据合并到 resultObj 中
          if (res.success) {
            // 判断赋值类型
            if (_R.valueGoal === ValueGoal.主表赋值 || !_R.valueGoal) {
              if (Array.isArray(resultObj)) {
                resultObj.push(res.data);
              } else {
                resultObj = { ...resultObj, ...res.data };
              }
            } else {
              other.push(res);
            }
          }
        } catch (error) {
          throw new Error('规则解析错误：' + _R.name);
        }
      }),
    );

    console.log(
      '所有规则最终数据结果',
      Rules,
      '===>',
      resultObj,
      '====',
      '非赋值操作===》',
      other,
    );
    return resultObj;
  }
  _clearData = () => {
    this._AllFormRules = new Map([]);
    this._FormIdtoType = new Map([]);
    this._NewFormData = new Map([]);
    this.currentCompanyInfo = {} as any;
    this.isReady = false;
  };
}

export default new WorkFormRules();
