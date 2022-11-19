import Group from './group';
import { TargetType } from '../enum';
import MarketActionTarget from './mbase';
import { FaildResult, model, schema } from '../../base';
/**
 * 公司的元操作
 */
export default class Company extends MarketActionTarget {
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
   * 获取单位下的工作组
   * @returns 返回好友列表
   */
  public async getWorkings(): Promise<model.ResultType<any>> {
    return await this.getSubTargets(
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
    return await this.getSubTargets(
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
    return await this.getIdentityTargets(id, TargetType.Company);
  }
}
