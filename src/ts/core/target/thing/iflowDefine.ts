import { FlowNode, XFlowDefine } from '@/ts/base/schema';

/**
 * 字典系统项接口
 */
export interface IFlowDefine {
  /** 主键,唯一 */
  id: string;
  /** 名称 */
  name: string;
  /** 字典对应的目标 */
  target: XFlowDefine;
  /** 流程设计*/
  resource?: FlowNode;
  /** 查询流程设计节点 */
  queryNodes(reload: boolean): Promise<FlowNode>;
}
