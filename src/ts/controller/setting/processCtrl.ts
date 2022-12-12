import { Emitter } from '@/ts/base/common';
import { conditionDataType } from './processType';

export enum ConditionCallBackTypes {
  'ProcessData' = 'ProcessData',
}

class ProcessController extends Emitter {
  /** 流程图大小*/
  private _scale: number = 100;
  private _conditionData: conditionDataType;
  private _currentNode: any;
  constructor() {
    super();
    this._conditionData = { name: '', fields: '', labels: [] };
  }
  public get scale() {
    return this._scale;
  }

  public get conditionData() {
    return this._conditionData;
  }
  public get currentNode() {
    return this._currentNode;
  }
  // 设置当前操作的条件数据
  public setCondtionData(conditionData: conditionDataType) {
    console.log(conditionData);
    this._conditionData = conditionData;
    this.changCallbackPart(ConditionCallBackTypes.ProcessData);
  }
  // 设置当前操作的节点
  public setCurrentNode(currentNode: any) {
    this._currentNode = currentNode;
    this.changCallbackPart(ConditionCallBackTypes.ProcessData);
  }
  // 设置大小
  public setScale(scale: number) {
    this._scale = scale;
    this.changCallbackPart(ConditionCallBackTypes.ProcessData);
  }
}

export default new ProcessController();
