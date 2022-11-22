import { TargetType } from '../enum';
import BaseTarget from './base';
import { kernel, model, schema } from '../../base';
import consts from '../consts';

export default class Cohort extends BaseTarget {
  constructor(target: schema.XTarget) {
    super(target);
  }

  /**
   * 拉人进入群组
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public pullPerson = async (personIds: string[]): Promise<model.ResultType<any>> => {
    return await this.pull(personIds, TargetType.Person);
  };

  /**
   * 拉单位进入群组
   * @param companyIds 单位Id集合
   * @returns 是否成功
   */
  public pullCompanys = async (companyIds: string[]): Promise<model.ResultType<any>> => {
    return await this.pull(companyIds, TargetType.Company);
  };

  /**
   * 获取群组下的人员（群组）
   * @param id 组织Id 默认为群组
   * @returns
   */
  public getPersons = async (
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> => {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [TargetType.Cohort],
      [TargetType.Person, ...consts.CompanyTypes],
    );
  };

  /**
   * 移除群组成员
   * @param ids 成员Id集合
   * @param typeName 成员类型
   * @returns
   */
  public removePerson = async (ids: string[], typeName: TargetType) => {
    return kernel.removeAnyOfTeam({
      id: this.target.id,
      teamTypes: [TargetType.Cohort],
      targetIds: ids,
      targetType: typeName,
    });
  };
}
