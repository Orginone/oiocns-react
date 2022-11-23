import { TargetType } from '../enum';
import BaseTarget from './base';
import { kernel, model, schema } from '../../base';
import consts from '../consts';
import { ICohort } from './itarget';

export default class Cohort extends BaseTarget implements ICohort {
  constructor(target: schema.XTarget) {
    super(target);
  }

  // 可以查询的组织类型
  public get searchTargetType(): TargetType[] {
    return [TargetType.Person, ...consts.CompanyTypes];
  }

  // 可以拉入的成员类型
  public get memberTypes(): TargetType[] {
    return [TargetType.Person, ...consts.CompanyTypes];
  }

  /**
   * 拉成员加入组织
   * @param ids
   * @param typeName
   * @returns
   */
  public async pullMember(
    ids: string[],
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    if (this.memberTypes.includes(typeName)) {
      return await this.pull(ids, typeName);
    }
    throw new Error(consts.UnauthorizedError);
  }

  /**
   * 移除群组成员
   * @param ids 成员Id集合
   * @param typeName 成员类型
   * @returns
   */
  public async removeMember(
    ids: string[],
    typeName: TargetType,
  ): Promise<model.ResultType<any>> {
    return await kernel.removeAnyOfTeam({
      id: this.target.id,
      teamTypes: [this.target.typeName],
      targetIds: ids,
      targetType: typeName,
    });
  }

  /**
   * 获得成员列表
   * @returns
   */
  public async getMember(): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.getSubTargets(
      this.target.id,
      [this.target.typeName],
      this.memberTypes,
    );
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
    return await this.getMember();
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
