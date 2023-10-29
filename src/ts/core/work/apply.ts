import { kernel, model } from '../../base';
import { IBelong } from '../target/base/belong';
import { IForm } from '../thing/standard/form';
export interface IWorkApply {
  /** 办事空间 */
  belong: IBelong;
  /** 元数据 */
  metadata: model.WorkInstanceModel;
  /** 实例携带的数据 */
  instanceData: model.InstanceDataModel;
  /** 校验表单数据 */
  validation(fromData: Map<string, model.FormEditData>): boolean;
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
    _forms: IForm[],
  ) {
    this.metadata = _metadata;
    this.instanceData = _data;
    this.belong = _belong;
  }
  belong: IBelong;
  metadata: model.WorkInstanceModel;
  instanceData: model.InstanceDataModel;
  validation(fromData: Map<string, model.FormEditData>): boolean {
    const valueIsNull = (value: any) => {
      return (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.length < 1)
      );
    };
    for (const formId of fromData.keys()) {
      const data: any = fromData.get(formId)?.after.at(-1) ?? {};
      for (const item of this.instanceData.fields[formId]) {
        if (item.options?.isRequired && valueIsNull(data[item.id])) {
          console.log(item, data);
          return false;
        }
      }
    }
    return true;
  }
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
    });
    return res.success;
  }
}
