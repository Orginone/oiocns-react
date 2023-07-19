import { kernel, model } from '../../base';
import { IBelong } from '../target/base/belong';

export interface IWorkApply {
  /** 办事空间 */
  belong: IBelong;
  /** 元数据 */
  metadata: model.WorkInstanceModel;
  /** 实例携带的数据 */
  instanceData: model.InstanceDataModel;
  /** 发起申请 */
  createApply(
    applyId: string,
    content: string,
    fromData: Map<string, model.FormEditData>,
  ): Promise<boolean>;
}

export class WorkApply implements IWorkApply {
  constructor(
    _metadata: model.WorkInstanceModel,
    _data: model.InstanceDataModel,
    _belong: IBelong,
  ) {
    this.metadata = _metadata;
    this.instanceData = _data;
    this.belong = _belong;
  }
  belong: IBelong;
  metadata: model.WorkInstanceModel;
  instanceData: model.InstanceDataModel;
  async createApply(
    applyId: string,
    content: string,
    fromData: Map<string, model.FormEditData>,
  ): Promise<boolean> {
    fromData.forEach((data, k) => {
      this.instanceData.data[k] = [data];
    });
    const res = await kernel.createWorkInstance({
      ...this.metadata,
      applyId: applyId,
      content: content,
      contentType: 'Text',
      data: JSON.stringify(this.instanceData),
      childrenData: '',
    });
    return res.success;
  }
}
