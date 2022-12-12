import { Emitter } from '@/ts/base/common';
import {
  conditionDataType,
  nodeType,
  AddNodeType,
  defalutDesignValue,
} from './processType';

export enum ConditionCallBackTypes {
  'ConditionsData' = 'ConditionsData', // 监听当前操作的条件数据
  'CurrentOperateNode' = 'CurrentOperateNode', //监听当前操作节点
  'Scale' = 'Scale', //监听大小
}

class ProcessController extends Emitter {
  /** 流程图大小*/
  private _scale: number = 100;
  private _conditionData: conditionDataType;
  private _currentNode: nodeType;
  private _currentTreeDesign: any = defalutDesignValue;
  private _nodeMap: any = new Map();
  constructor() {
    super();
    this._conditionData = { name: '', fields: '', labels: [] };
    this._currentNode = {
      type: AddNodeType.APPROVAL,
      parentId: '',
      nodeId: '',
      name: '',
      conditions: [],
      props: {
        assignedUser: {},
        assignedType: {},
        num: 0,
      },
    };
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
  public get currentTreeDesign() {
    return this._currentTreeDesign;
  }
  public get nodeMap() {
    return this._nodeMap;
  }
  // 设置当前操作的条件数据
  public setCondtionData(conditionData: conditionDataType) {
    this._conditionData = conditionData;
    this.changCallbackPart(ConditionCallBackTypes.ConditionsData);
  }
  // 设置当前操作的节点
  public setCurrentNode(currentNode: nodeType) {
    this._currentNode = currentNode;
    this.changCallbackPart(ConditionCallBackTypes.CurrentOperateNode);
  }
  // 设置大小
  public setScale(scale: number) {
    this._scale = scale;
    this.changCallbackPart(ConditionCallBackTypes.Scale);
  }
  public setProcessDesignTree(currentTreeDesign: any) {
    this._currentTreeDesign = currentTreeDesign;
  }
  // addNodeMap({ nodeId: node.nodeId, node: node });
  // addNodeMap: async (data: any) =>
  // set((prev: any) => ({ nodeMap: prev.nodeMap.set(data.nodeId, data.node) })),
  // public  addNodeMap(data:any) {
  //   set((prev: any) => ({ nodeMap: prev.nodeMap.set(data.nodeId, data.node) }))
  // }
}

export default new ProcessController();
