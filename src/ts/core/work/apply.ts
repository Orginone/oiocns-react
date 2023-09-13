import { kernel, model } from '../../base';
import { IBelong } from '../target/base/belong';
import { IForm } from '../thing/standard/form';
import WorkFormRules, { WorkFormRulesType } from './rules/workFormRules';
export interface IWorkApply {
  /** 办事空间 */
  belong: IBelong;
  /** 元数据 */
  metadata: model.WorkInstanceModel;
  /** 实例携带的数据 */
  instanceData: model.InstanceDataModel;
  /** 业务规则触发器  */
  ruleService: WorkFormRulesType;
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
    WorkFormRules.initRules(_forms, _belong);
    this.ruleService = WorkFormRules as any;
    //TODO:尝试在此处，执行规则初始化操作 修改instanceData
  }
  belong: IBelong;
  metadata: model.WorkInstanceModel;
  instanceData: model.InstanceDataModel;
  ruleService: WorkFormRulesType;
  async createApply(
    applyId: string,
    content: string,
    fromData: Map<string, model.FormEditData>,
  ): Promise<boolean> {
    fromData.forEach((data, k) => {
      const { after, before, createTime, creator, nodeId } = data;
      this.instanceData.data[k] = [{ after, before, createTime, creator, nodeId }];
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
