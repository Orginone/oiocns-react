import { TargetType } from '../enum';
import BaseTarget from './base';
import { model, schema } from '../../base';
import consts from '../consts';

export default class Cohort extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
    this.subTypes = [TargetType.Person, ...consts.CompanyTypes];
    this.searchTargetType = [TargetType.Person, ...consts.CompanyTypes];
  }

  /**----------------------------------------------弃用方法------------------------------------------------------- */

  /**
   * 拉人进入群组
   * @deprecated 方法已弃用 请使用pullMember
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public pullPerson = async (personIds: string[]): Promise<model.ResultType<any>> => {
    return this.pullMember(personIds, TargetType.Person);
  };

  /**
   * 拉单位进入群组
   * @deprecated 方法已弃用 请使用pullMember
   * @param companyIds 单位Id集合
   * @param typeName 单位类型
   * @returns 是否成功
   */
  public pullCompanys = async (
    companyIds: string[],
    typeName: TargetType,
  ): Promise<model.ResultType<any>> => {
    return this.pullMember(companyIds, typeName);
  };
  /**
   * 获取群组成员
   * @deprecated 方法已弃用 请使用getMember
   * @returns
   */
  public async getPersons(): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.getSubTargets(this.subTypes);
  }

  /**
   * 移除群组成员
   * @deprecated 方法已弃用 请使用removeMember 方法
   * @param ids 成员Id集合
   * @param typeName 成员类型
   * @returns
   */
  public async removePerson(ids: string[], typeName: TargetType) {
    return this.removeMember(ids, typeName);
  }
}
