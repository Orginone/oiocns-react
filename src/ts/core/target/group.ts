import { faildResult, kernel, model, schema } from '../../base';
import { TargetType } from '../enum';
import consts from '../consts';
import BaseTarget from './base';

export default class Group extends BaseTarget {
  private _joinedGroups: Group[];
  subGroups: Group[];
  constructor(target: schema.XTarget) {
    super(target);
    this.subGroups = [];
    this._joinedGroups = [];
  }

  protected get searchTargetType(): TargetType[] {
    return [...consts.CompanyTypes];
  }

  /**
   * 查询加入的集团
   * @returns
   */
  getJoinedGroups = async (): Promise<Group[]> => {
    if (this._joinedGroups.length > 0) {
      return this._joinedGroups;
    }
    let res = await this.getjoined({
      spaceId: '0',
      JoinTypeNames: [TargetType.Group],
    });
    if (res.success) {
      res.data?.result?.forEach((item) => {
        this._joinedGroups.push(new Group(item));
      });
    }
    return this._joinedGroups;
  };

  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup = async (id: string): Promise<model.ResultType<any>> => {
    return await this.applyJoin(id, TargetType.Group);
  };

  querySubGroup=async(){

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
  createSubGroup = async (
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>> => {
    const tres = await this.searchTargetByName(name, TargetType.Group);
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
          this.subGroups.push(new Group(res.data));
          return this.pull([res.data.id], TargetType.Group);
        }
        return res;
      }
      return faildResult(consts.IsExistError);
    }
    return tres;
  };

  /**
   * 删除集团
   * @param id 集团Id
   * @returns
   */
  deleteSubGroup = async (id: string): Promise<model.ResultType<any>> => {
    const group = this.subGroups.find((group) => {
      return group.target.id == id;
    });
    if (group != undefined) {
      let res = await kernel.recursiveDeleteTarget({
        id: id,
        typeName: TargetType.Group,
        subNodeTypeNames: [TargetType.Group],
      });
      if (res.success) {
        this.subGroups = this.subGroups.filter((group) => {
          return group.target.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.UnauthorizedError);
  };

  /**
   * 获取集团下的人员（单位、集团）
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getPersons = async (
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> => {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Group],
      [TargetType.Person],
    );
  };

  /**
   * 获取集团下的单位
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getCompanys = async (
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> => {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Group],
      [...consts.CompanyTypes],
    );
  };

  /**
   * 获取集团下的集团
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getSubGroups = async (
    id: string = '0',
  ): Promise<model.ResultType<schema.XTargetArray>> => {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(id, [TargetType.Group], [TargetType.Group]);
  };

  /**
   * 拉单位进入集团
   * @param companyIds 单位Id集合
   * @returns 是否成功
   */
  pullCompanys = async (companyIds: string[]): Promise<model.ResultType<any>> => {
    return await this.pull(companyIds, TargetType.Company);
  };

  /**
   * 拉集团进入集团
   * @param personIds 集团Id集合
   * @returns 是否成功
   */
  pullGroups = async (groupIds: string[]): Promise<model.ResultType<any>> => {
    return await this.pull(groupIds, TargetType.Group);
  };
}
