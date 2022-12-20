import { kernel } from './../../base/index';
import BaseTarget from './base';
import { model, schema } from '../../base';

export default class FlowTarget extends BaseTarget {
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
    data: Omit<model.CreateDefineReq, 'belongId'>,
  ): Promise<schema.XFlowDefine> {
    const res = await kernel.publishDefine({ ...data, belongId: this.target.id });
    if (res.success) {
      if (data.id) {
        this.defines = this.defines.filter((a) => {
          return a.id != data.id;
        });
      }
      this.defines.push(res.data);
    }
    return res.data;
  }
  async deleteDefine(id: string): Promise<boolean> {
    const res = await kernel.deleteDefine({ id });
    if (res.success) {
      this.defines = this.defines.filter((a) => {
        return a.id != id;
      });
    }
    return res.success;
  }
  async createInstance(data: model.FlowInstanceModel): Promise<schema.XFlowInstance> {
    return (await kernel.createInstance(data)).data;
  }
  async bindingFlowRelation(
    data: model.FlowRelationModel,
  ): Promise<schema.XFlowRelation> {
    const res = await kernel.createFlowRelation(data);
    if (res.success) {
      this.defineRelations = this.defineRelations.filter(
        (a) => a.productId != data.productId || a.functionCode != data.functionCode,
      );
      this.defineRelations.push(res.data);
    }
    return res.data;
  }
  async unbindingFlowRelation(data: model.FlowRelationModel): Promise<boolean> {
    const res = await kernel.deleteFlowRelation(data);
    if (res.success) {
      this.defineRelations = this.defineRelations.filter(
        (a) => a.productId != data.productId || a.functionCode != data.functionCode,
      );
    }
    return res.success;
  }
}
