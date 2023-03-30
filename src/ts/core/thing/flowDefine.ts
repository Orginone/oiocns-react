import { FlowNode } from '@/ts/base/schema';
import { kernel, schema } from '../../base';
import { IFlowDefine } from './iflowDefine';
/**
 * 分类系统项实现
 */
export class FlowDefine implements IFlowDefine {
  id: string;
  name: string;
  target: schema.XFlowDefine;
  curSpaceId: string;
  resource?: FlowNode;
  constructor(target: schema.XFlowDefine, curSpaceId: string) {
    this.target = target;
    this.id = target.id;
    this.name = target.name;
    this.curSpaceId = curSpaceId;
    this.queryNodes(true);
  }

  async queryNodes(reload: boolean = false): Promise<FlowNode> {
    if (this.resource == undefined || reload) {
      let result = await kernel.queryNodes({
        id: this.id || '',
        spaceId: this.curSpaceId,
        page: { offset: 0, limit: 1000, filter: '' },
      });
      this.resource = result.data;
    }
    return this.resource;
  }
}
