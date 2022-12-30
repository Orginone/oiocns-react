import { Emitter } from '@/ts/base/common';
import {
  conditionDataType,
  NodeType,
  AddNodeType,
  defalutDesignValue,
} from '../Design/Chart/FlowDrawer/processType';
import { deepClone } from '@/ts/base/common';

export enum ConditionCallBackTypes {
  'ConditionsData' = 'ConditionsData', // 监听当前操作的条件数据
  'CurrentOperateNode' = 'CurrentOperateNode', //监听当前操作节点
  'Scale' = 'Scale', //监听大小
  'ProcessTree' = 'ProcessTree',
}

class ProcessController extends Emitter {
  private _conditionData: conditionDataType;
  private _currentTreeDesign: any = deepClone(defalutDesignValue);
  constructor() {
    super();
    this._conditionData = { name: '', fields: '', labels: [] };
  }
  public get conditionData() {
    return this._conditionData;
  }
  public get currentTreeDesign() {
    return this._currentTreeDesign;
  }
}

export default new ProcessController();
