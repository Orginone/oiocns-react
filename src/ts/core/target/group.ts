import { FaildResult, model, schema } from '../../base';
import { TargetType } from '../enum';
import BaseTarget from './base';

export default class Group extends BaseTarget {
  public _subGroups: Group[];
  constructor(target: schema.XTarget) {
    super(target);
    this._subGroups = [];
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
    } else {
      return FaildResult('该集团已存在!');
    }
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
    return await this.deleteAuthorityBase(belongId, TargetType.Group);
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
   * 查询加入集团申请
   * @param id 
   * @returns
   */
   public async queryJoinCompanyApply(id: string): Promise<model.ResultType<any>> {
    const res = await this.queryJoinApplyBase(id);
    return res;
  }
  /**
   * 删除身份
   * @param belongId 当前工作空间id
   * @returns
   */
  public async deleteIdentity(belongId: string): Promise<model.ResultType<any>> {
    return await this.deleteIdentityBase(belongId, TargetType.Group);
  }

  /**
   * 查询指定身份赋予的人员
   * @param id
   * @returns
   */
 public async selectIdentityTargets(id: string): Promise<model.ResultType<any>> {
  const res = await this.getIdentityTargetsBase(id,TargetType.Group);
  return res;
}
/**
 * 查询集团
 * @param name 名称
 * @returns 
 */
 public async searchGroup(name: string): Promise<model.ResultType<any>> {
  const TypeName = TargetType.Group;
  const res = await this.search(name, TypeName);
  return res;
}

}
