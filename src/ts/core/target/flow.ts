import { kernel } from './../../base/index';
import BaseTarget from './base';
import { model, schema } from '../../base';
import { ResultType } from '../../base/model';
import { IFlow } from './itarget';

export default class FlowTarget extends BaseTarget implements IFlow {
  defines: schema.XFlowDefine[] = [];
  defineRelations: schema.XFlowRelation[] = [];
  async getDefines(reload: boolean = false): Promise<schema.XFlowDefine[]> {
    if (!reload && this.defines.length > 0) {
      return this.defines;
    }
    const res = await kernel.queryDefine({ id: this.target.id });
    if (res.success && res.data.result) {
      this.defines = res.data.result;
    }
    return this.defines;
  }
  async queryFlowRelation(reload: boolean = false): Promise<schema.XFlowRelation[]> {
    if (!reload && this.defineRelations.length > 0) {
      return this.defineRelations;
    }
    const res = await kernel.queryDefineRelation({
      id: this.target.id,
    });
    if (res.success && res.data.result) {
      this.defineRelations = res.data.result;
    }
    return this.defineRelations;
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
    const res = await kernel.createFlowRelation(data);
    if (res.success) {
      this.defineRelations = this.defineRelations.filter((a) => {
        a.productId != data.productId || a.functionCode != data.functionCode;
      });
      this.defineRelations.push(res.data);
    }
    return res;
  }
  async unbindingFlowRelation(
    data: model.FlowRelationModel,
  ): Promise<ResultType<boolean>> {
    const res = await kernel.deleteFlowRelation(data);
    if (res.success) {
      this.defineRelations = this.defineRelations.filter((a) => {
        a.productId != data.productId || a.functionCode != data.functionCode;
      });
    }
    return res;
  }
}
