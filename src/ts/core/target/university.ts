import { schema, model } from '../../base';
import { TargetType } from '../enum';
import Company from './company';

export default class University extends Company {
  constructor(target: schema.XTarget) {
    super(target);
  }

  /** 可以创建的子类型 */
  public override get subTypes(): TargetType[] {
    return [
      TargetType.Group,
      TargetType.JobCohort,
      TargetType.Office,
      TargetType.Working,
      TargetType.Section,
      TargetType.College,
      TargetType.Laboratory,
    ];
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
   * 查询加入学校申请
   * @param id
   * @returns
   */
  public async queryJoinCompanyApply(): Promise<model.ResultType<any>> {
    const res = await this.queryJoinApplyBase();
    return res;
  }
}
