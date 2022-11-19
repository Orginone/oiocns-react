import Group from './group';
import { FaildResult, kernel, model, schema, common } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';

/**
 * 公司的元操作
 */
export default class Company extends BaseTarget {
  private _joinedGroups: Group[];
  constructor(target: schema.XTarget) {
    super(target);
    this._joinedGroups = [];
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

  /**
   * 设立集团
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
      return FaildResult('该集团已存在!');
    }
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
   * 创建职权
   * @param name 职权名称
   * @param code 职权编号
   * @param dPublic 是否公开
   * @param parentId 父级id
   * @param remark 备注信息
   * @returns
   */
  public async createpostAuth(
    name: string,
    code: string,
    dPublic: boolean,
    parentId: string,
    remark: string,
  ): Promise<model.ResultType<any>> {
    const params = {
      name: name,
      code: code,
      dPublic: dPublic,
      parentId: parentId,
      remark: remark,
    };
    const res = await this.createAuthorityBase(params);
    return res;
  }
  /**
   * 删除职权
   * @param belongId 当前工作空间id
   * @returns
   */
  public async deletePostAuth(belongId: string): Promise<model.ResultType<any>> {
    return await this.deleteAuthorityBase(belongId, TargetType.Company);
  }
  /**
   * 创建身份
   * @param name 名称
   * @param code 编号
   * @param authId 权限ID
   * @param remark 备注
   * @returns
   */
  public async createIdentity(
    name: string,
    code: string,
    authId: string,
    remark: string,
  ): Promise<model.ResultType<any>> {
    const params = {
      name: name,
      code: code,
      authId: authId,
      remark: remark,
    };
    const res = await this.createIdentityBase(params);
    return res;
  }
  /**
   * 删除身份
   * @param belongId 当前工作空间id
   * @returns
   */
  public async deleteIdentity(belongId: string): Promise<model.ResultType<any>> {
    return await this.deleteIdentityBase(belongId, TargetType.Cohort);
  }
  /**
   * 获取单位下的工作组
   * @returns 返回好友列表
   */
  public async getWorkings(): Promise<model.ResultType<any>> {
    return await this.getsTargets(
      this.target.id,
      [TargetType.Company],
      [TargetType.Working],
    );
  }
  /**
   * 获取单位下的人员
   * @returns 返回好友列表
   */
  public async getPersons(): Promise<model.ResultType<any>> {
    return await this.getsTargets(
      this.target.id,
      [TargetType.Company],
      [TargetType.Person],
    );
  }

  /**
   * 查询指定身份赋予的人员
   * @param id
   * @returns
   */
  public async selectIdentityTargets(id: string): Promise<model.ResultType<any>> {
    const res = await this.getIdentityTargetsBase(id, TargetType.Group);
    return res;
  }

  /**
   * 查找公司
   * @param name 名称
   * @returns
   */
  public async searchCompany(name: string): Promise<model.ResultType<any>> {
    const TypeName = TargetType.Company;
    const res = await this.search(name, TypeName);
    return res;
  }
}
