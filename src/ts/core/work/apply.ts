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
    gateways: Map<string, string>,
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
        (typeof value === 'string' && (value == '[]' || value.length < 1))
      );
    };
    for (const formId of fromData.keys()) {
      const formDataValue = fromData.get(formId);
      const data: any = formDataValue?.after.at(-1) ?? {};
      for (const item of this.instanceData.fields[formId]) {
        var isRequired =
          formDataValue?.rule[item.id]?.isRequired ||
          formDataValue?.rule[item.id]?.visible;
        if (isRequired == undefined) {
          isRequired = item.options?.isRequired;
        }
        if (isRequired && valueIsNull(data[item.id])) {
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
    gateways: Map<string, string>,
  ): Promise<boolean> {
    fromData.forEach((data, k) => {
      this.instanceData.data[k] = [data];
    });
    var gatewayInfos: model.WorkGatewayInfoModel[] = [];
    gateways.forEach((v, k) => {
      gatewayInfos.push({
        nodeId: k,
        TargetId: v,
      });
    });
    var mark = await this.getMarkInfo();
    if (content.length > 0) {
      mark += `备注:${content}`;
    }
    const res = await kernel.createWorkInstance({
      ...this.metadata,
      applyId: applyId,
      content: mark,
      contentType: 'Text',
      data: JSON.stringify(this.instanceData),
      gateways: JSON.stringify(gatewayInfos),
    });
    return res.success;
  }
  async getMarkInfo(): Promise<string> {
    const remarks: string[] = [];
    for (const primaryForm of this.instanceData.node.primaryForms) {
      const key = primaryForm.id;
      const data = this.instanceData.data[key];
      const fields = this.instanceData.fields[key];
      if (data && fields) {
        for (const field of fields.filter((a) => a.options && a.options.showToRemark)) {
          var value = data.at(-1)?.after[0][field.id];
          switch (field.valueType) {
            case '用户型':
              value = (await this.belong.user.findEntityAsync(value))?.name;
              break;
            case '选择型':
              value = field.lookups?.find(
                (a) => a.id === (value as string).substring(1),
              )?.text;
              break;
            default:
              break;
          }
          remarks.push(`${field.name}:${value}  `);
        }
      }
    }
    return remarks.join('');
  }
}
