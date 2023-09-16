import OrgCtrl from '../../../controller';

import { Emitter } from '../../..//base/common';
import { sleep } from '../../../base/common';
import { RuleTypes } from './type.d';
// import { IRuleBase } from './base/ruleBase';
// import { debounce } from '@/utils/tools';
import { DataType } from 'typings/globelType';
import { filterRules, setFormRules } from './lib/tools';
import * as Tools from './lib';
import { RuleTriggers } from '../../public';
import { EffectEnum } from './base/enum';
import { XEntity } from '../../..//base/schema';
import { IBelong } from '../../target/base/belong';
import { model } from '../../..//base';

// 定义表单规则的类型
export type WorkFormRulesType = {
  /* 是否完成 */
  isReady: boolean;
  /* 办事归属权 */
  companyMeta: XEntity;
  /* 当前选中 主表的id标识 */
  currentMainFormId: string;
  /* 初始化规则*/
  initRules: (forms: any[], belone: IBelong) => void;
  /* 加载远程规则*/
  loadRemoteRules: (path: string) => Promise<void>;
  /* 处理表单规则*/
  waitingTask: (
    trigger: RuleTypes.TriggerType,
    formData: { id: string; data: RuleTypes.DataType },
    changeObj?: DataType, //变动项
  ) => void;
  /* 收集关键数据 */
  collectData: <T>(type: 'formsType' | 'hotData' | 'formCallBack', data: T) => void;
  /* 执行所有表单的最终提交规则 */
  handleSubmit: (
    formData: Map<string, model.FormEditData>,
  ) => Promise<{ values: Map<string, model.FormEditData>; success: boolean }>;
};

class WorkFormRules extends Emitter implements WorkFormRulesType {
  constructor() {
    super();
    this.companyMeta = {} as any;
    this.currentMainFormId = '';
  }
  // 当前主表id
  currentMainFormId: string;
  // 是否所有规则都已加载完毕
  isReady: boolean = false;
  // 单位信息
  companyMeta: XEntity;
  // 所有表单规则
  private _AllFormRules: Map<string, RuleTypes.MapType> = new Map([]);
  // 所有表单id，对应的主子表信息
  private _FormsTypeMap: Map<'主表' | '子表', string[]> = new Map([]);
  /* 当前办事所有表单数据 */
  private _hotData: Map<string, model.FormEditData> = new Map([]);

  // 初始化表单规则
  initRules = (forms: any[], belone: IBelong) => {
    this._clearData();
    this.companyMeta = belone.metadata.belong as XEntity;
    let count = 0;
    // 遍历每个表单，获取其中的规则
    for (const formItem of forms) {
      const { list: ruleList = [] } = JSON.parse(formItem.metadata?.rule ?? '{}');
      // 将表单的规则存入 _AllFormRules 中
      this._AllFormRules.set(formItem.id, {
        rules: setFormRules(ruleList),
        attrs: formItem.fields,
        callback: undefined,
      });
      count++;

      // 如果所有的表单规则已经全部加载完毕，将 isReady 设为 true，并通知回调
      if (count === forms.length) {
        this.isReady = true;
        this.changCallback();
      }
    }
  };
  /* 收集数据 */
  collectData = <T extends any>(
    type: 'formsType' | 'hotData' | 'formCallBack',
    data: T,
  ) => {
    switch (type) {
      /* 收集主子表信息 */
      case 'formsType':
        for (let key in data) {
          this._FormsTypeMap.set(
            key === 'primaryFormIds' ? '主表' : '子表',
            data[key] as T as string[],
          );
        }
        break;
      /* 收集当前表展示信息 */
      case 'hotData':
        this._hotData = data as Map<string, model.FormEditData>;
        break;
      /*   设置表单的回调函数，表单首次渲染时触发 */
      case 'formCallBack':
        {
          const { formId, callback } = data as T as RuleTypes.callBackType;
          const _FormInfo: RuleTypes.MapType = this._AllFormRules.get(formId)!;
          // 如果该表单没有回调函数，则将该回调函数赋值给它，并执行一个 "Start" 触发器-即表单初始化
          if (!_FormInfo.callback) {
            this._AllFormRules.set(formId, { ..._FormInfo, callback });
            this.waitingTask(RuleTriggers.Start, { id: formId, data: {} });
          }
        }
        break;
      default:
        break;
    }
  };

  //TODO: 加载远程的规则库
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
  async waitingTask(
    trigger: RuleTypes.TriggerType,
    formData: { id: string; data: RuleTypes.DataType },
    changeObj: DataType | 'all' = 'all',
  ) {
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
        params['things'] = this._hotData.get(id)?.after;
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
          this.waitingTask(RuleTriggers.Running, { id: _formId, data: resultObj });
        }
      } else {
        console.error('未设置回调函数：' + _formId);
      }
    }
  }

  handleSubmit = async (formData: Map<string, model.FormEditData>) => {
    let _Results = [];
    let forms = this._FormsTypeMap.get('主表') || [];
    for (const item of forms) {
      const params: any = { id: item, data: this._hotData.get(item)?.after?.[0] };
      _Results.push(await this.waitingTask(RuleTriggers.Submit, params));
    }

    let subValues = {}; // 提交时赋值
    let boolArr: boolean[] = []; // 提交时 判断拦截提交
    _Results.forEach((v: any) => {
      // 提交时赋值
      if (typeof v[0] === 'object') {
        subValues = { ...subValues, ...v[0] };
      } else {
        // 提交时 判断拦截提交
        boolArr.push(v[0]);
      }
    });
    const changedForm = formData.get(this.currentMainFormId);
    if (changedForm) {
      formData.set(this.currentMainFormId!, {
        ...changedForm,
        after: [{ ...changedForm!.after[0]!, ...subValues }],
      } as any);
    }
    return {
      values: formData,
      success: boolArr.length > 0 ? boolArr.some((v) => v == false) : true,
    };
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
            $company: this.companyMeta, //单位信息
            $user: OrgCtrl.user.metadata, //用户信息
            tools: Tools, //方法库
          });

          // 如果规则执行成功，则将规则返回的数据合并到 resultObj 中
          if (res.success) {
            // 判断赋值类型
            if (_R.effect === EffectEnum.mainVals || !_R.effect) {
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
    this._FormsTypeMap = new Map([]);
    this._hotData = new Map([]);
    this.companyMeta = {} as any;
    this.isReady = false;
  };
}

export default new WorkFormRules();
