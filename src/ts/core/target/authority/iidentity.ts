import { model, schema } from '../../../base';
import { TargetType } from '../../enum';

export interface IIdentity {
  /** 当前身份Id */
  id: string;
  /**
   * 更新身份
   * @param id 唯一ID
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns
   */
  updateIdentity(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>>;
  /**
   * 查询指定身份赋予的组织/人员
   * @param id
   * @param targetType
   * @returns
   */
  getIdentityTargets(
    targetType: TargetType,
  ): Promise<model.ResultType<schema.XTargetArray>>;
  /**
   * 赋予组织个人身份
   * @param id 身份Id
   * @param targetIds 组织/个人Id集合
   * @returns
   */
  giveIdentity(targetIds: string[]): Promise<model.ResultType<any>>;
  /**
   * 移除赋予给组织/个人的身份
   * @param id 身份Id
   * @param targetIds 组织/个人Id集合
   * @returns
   */
  removeIdentity(targetIds: string[]): Promise<model.ResultType<any>>;
}
