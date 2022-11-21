import { faildResult, model, schema } from '../../base';
import { TargetType } from '../enum';
import consts from '../consts';
import BaseTarget from './base';

export default class Group extends BaseTarget {
  public _subGroups: Group[];
  constructor(target: schema.XTarget) {
    super(target);
    this._subGroups = [];
  }

  protected get searchTargetType(): TargetType[] {
    return [...consts.CompanyTypes];
  }

  /**
   * 设立子集团
   * @param name 子集团名称
   * @param code 子集团代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 子集团简介
   * @returns 是否成功
   */
  public async createSubGroup(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>> {
    const tres = await this.getTargetByName({
      name,
      typeName: TargetType.Group,
      page: { offset: 0, limit: 1, filter: code },
    });
    if (tres.success) {
      if (!tres.data) {
        const res = await this.createTarget(
          name,
          code,
          TargetType.Group,
          teamName,
          teamCode,
          remark,
        );
        if (res.success) {
          this._subGroups.push(new Group(res.data));
          return this.pull({
            targetType: TargetType.Group,
            targetIds: [res.data.id],
          });
        }
        return res;
      }
      return faildResult(consts.IsExistError);
    }
    return tres;
  }

  /**
   * 获取集团下的人员（单位、集团）
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  public async getPersons(
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Group],
      [TargetType.Person],
    );
  }

  /**
   * 获取集团下的单位
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  public async getCompanys(
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Group],
      [...consts.CompanyTypes],
    );
  }

  /**
   * 获取集团下的集团
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  public async getGroups(
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(id, [TargetType.Group], [TargetType.Group]);
  }
}
