import { kernel } from './../../base/index';
import BaseTarget from './base';
import { model, schema } from '../../base';
import { ResultType } from '../../base/model';
import { IFlowTarget } from './itarget';

export default class FlowTarget extends BaseTarget implements IFlowTarget {
  defines: schema.XFlowDefine[] = [];
  async getDefines(): Promise<schema.XFlowDefine[]> {
    if (this.defines.length > 0) {
      return this.defines;
    }
    const res = await kernel.queryDefine({ id: this.target.id });
    if (res.success && res.data.result) {
      this.defines = res.data.result;
    }
    return this.defines;
  }
  async publishDefine(
    data: model.CreateDefineReq,
  ): Promise<ResultType<schema.XFlowDefine>> {
    const res = await kernel.publishDefine(data);
    if (data.Id != '') {
      this.defines = this.defines.filter((a) => {
        return a.id == data.Id;
      });
    }
    this.defines.push(res.data);
    return res;
  }
  async deleteDefine(id: string): Promise<ResultType<boolean>> {
    const res = await kernel.deleteDefine({ id });
    this.defines = this.defines.filter((a) => {
      return a.id == id;
    });
    return res;
  }
  async createInstance(
    data: model.FlowInstanceModel,
  ): Promise<ResultType<schema.XFlowInstance>> {
    return await kernel.createInstance(data);
  }
  async bindingFlowRelation(
    data: model.FlowRelationModel,
  ): Promise<ResultType<schema.XFlowRelation>> {
    return await kernel.createFlowRelation(data);
  }
  async unbindingFlowRelation(
    data: model.FlowRelationModel,
  ): Promise<ResultType<boolean>> {
    return await kernel.deleteFlowRelation(data);
  }
}
