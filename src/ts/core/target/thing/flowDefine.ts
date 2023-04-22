import { FlowNode, XFlowDefine, XFlowDefineArray } from '@/ts/base/schema';
import { kernel } from '../../../base';
import { CreateDefineReq } from '@/ts/base/model';
/**
 * 分类系统项实现
 */
export class FlowDefine {
  belongId: string;
  constructor(id: string) {
    this.belongId = id;
  }

  /* 加载办事 */
  async loadFlowDefine(speciesId: string = ''): Promise<XFlowDefineArray> {
    const res = await kernel.queryDefine({
      speciesId,
      spaceId: this.belongId,
    });
    return res.data;
  }
  /* 发布办事  */
  async publishDefine(data: CreateDefineReq): Promise<XFlowDefine> {
    data.belongId = this.belongId;
    return (await kernel.publishDefine(data)).data;
  }

  /* 删除办事  */
  async deleteDefine(id: string): Promise<boolean> {
    return (await kernel.deleteDefine({ id })).data;
  }

  /** 查询办事节点 */
  async queryNodes(id: string): Promise<FlowNode> {
    return (await kernel.queryNodes({ id })).data;
  }
}
