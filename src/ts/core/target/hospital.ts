import { schema, model } from '../../base';
import { TargetType } from '../enum';
import Company from './company';

export default class Hospital extends Company {
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
      TargetType.Laboratory,
    ];
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
    return await this.deleteAuthorityBase(belongId, TargetType.Hospital);
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
   * 查询加入医院申请
   * @param id
   * @returns
   */
  public async queryJoinCompanyApply(id: string): Promise<model.ResultType<any>> {
    const res = await this.queryJoinApplyBase(id);
    return res;
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
   * 删除身份
   * @param belongId 当前工作空间id
   * @returns
   */
  public async deleteIdentity(belongId: string): Promise<model.ResultType<any>> {
    return await this.deleteIdentityBase(belongId, TargetType.University);
  }

  /**
   * 查询指定身份赋予的人员
   * @param id
   * @returns
   */
  public async selectIdentityTargets(id: string): Promise<model.ResultType<any>> {
    const res = await this.getIdentityTargetsBase(id, TargetType.Hospital);
    return res;
  }
}
