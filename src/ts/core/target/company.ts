import Group from './group';
import Cohort from './cohort';
import consts from '../consts';
import { TargetType } from '../enum';
import MarketActionTarget from './mbase';
import { faildResult, model, schema, kernel } from '../../base';
/**
 * 公司的元操作
 */
export default class Company extends MarketActionTarget {
  private _joinedGroups: Group[];
  private _joinedCohorts: Cohort[];
  constructor(target: schema.XTarget) {
    super(target);
    this._joinedGroups = [];
    this._joinedCohorts = [];
  }

  /** 可以创建的子类型 enum.ts */
  public get subTypes(): TargetType[] {
    return [
      // 工作群
      TargetType.JobCohort,
      // 工作组
      TargetType.Working,
      // 部门
      TargetType.Department,
      // 集团
      TargetType.Group,
      // 科室
      TargetType.Section,
    ];
  }

  protected get searchTargetType(): TargetType[] {
    return [TargetType.Group, ...super.searchTargetType];
  }

  /**
   * 创建集团
   * @param name 集团名称
   * @param code 集团代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 集团简介
   * @returns 是否成功
   */
  public async createGroup(
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
        this._joinedGroups.push(new Group(res.data));
        return await this.join(res.data.id, [TargetType.Group]);
      }
      return res;
    } else {
      return faildResult('该集团已存在!');
    }
  }

  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  public async createCohort(
    name: string,
    code: string,
    remark: string,
  ): Promise<boolean> {
    const res = await this.createTarget(
      name,
      code,
      TargetType.Cohort,
      name,
      code,
      remark,
    );
    if (res.success && res.data != undefined) {
      const cohort = new Cohort(res.data);
      this._joinedCohorts.push(cohort);
      return cohort.pullPersons([this.target.id]);
    }
    return false;
  }

  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  public async deleteCohorts(id: string): Promise<model.ResultType<any>> {
    let res = await super.deleteTarget(id, TargetType.Cohort);
    if (res.success) {
      this._joinedCohorts = this._joinedCohorts.filter((obj) => obj.target.id != id);
    }
    return res;
  }

  /**
   * 创建部门/工作组
   * @param name 名称
   * @param code 编号
   * @param teamName 团队名称
   * @param teamCode 团队编号
   * @param remark 简介
   * @param parentId 上级组织Id 默认公司 公司、部门
   * @returns
   */
  public async createDepartmentOrWoking(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    parentId: string = '0',
    targetType: TargetType.Working | TargetType.Department,
  ) {
    const res = await this.createTarget(
      name,
      code,
      targetType,
      teamName,
      teamCode,
      remark,
    );
    if (res.success) {
      if (parentId == '0') {
        parentId = this.target.id;
      }
      this._joinedGroups.push(new Group(res.data));
      return await kernel.pullAnyToTeam({
        id: parentId,
        teamTypes: [TargetType.Department, this.target.typeName],
        targetIds: [res.data?.id],
        targetType: targetType,
      });
    }
    return res;
  }

  /**
   * 拉人进入单位
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public async pullPersons(personIds: string[]): Promise<model.ResultType<any>> {
    return await this.pull({
      targetType: TargetType.Person,
      targetIds: personIds,
    });
  }

  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns 返回好友列表
   */
  public async getWorkings(id: string = '0'): Promise<model.ResultType<any>> {
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Department],
      [TargetType.Working],
    );
  }

  /**
   * 获取组织下的人员（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns
   */
  public async getPersons(id: string = '0'): Promise<model.ResultType<any>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Department, TargetType.Working],
      [TargetType.Person],
    );
  }

  /**
   * 获取组织下的部门（单位、部门）
   * @param id 组织Id 默认为当前单位
   * @returns
   */
  public async getDepartments(id: string = '0'): Promise<model.ResultType<any>> {
    if (id == '0') {
      id = this.target.id;
    }
    return await this.getSubTargets(
      id,
      [...consts.CompanyTypes, TargetType.Department],
      [TargetType.Person],
    );
  }

  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  public async getJoinedCohorts(): Promise<Cohort[]> {
    if (this._joinedCohorts.length > 0) {
      return this._joinedCohorts;
    }
    let res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Cohort],
    });
    if (res.success) {
      res.data?.result?.forEach((item) => {
        this._joinedCohorts.push(new Cohort(item));
      });
    }
    return this._joinedCohorts;
  }
}
