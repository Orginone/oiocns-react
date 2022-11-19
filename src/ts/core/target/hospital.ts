import { schema,model } from '../../base';
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
   public async createpostAuth(name:string,code:string,dPublic:boolean,parentId:string,remark:string): Promise<model.ResultType<any>> {
    const params = {
      name:name,
      code:code,
      dPublic:dPublic,
      parentId:parentId,
      remark:remark
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
    return await this.deleteAuthorityBase(belongId, TargetType.Person);
  }
  /**
 * 创建身份
 * @param name 名称
 * @param code 编号
 * @param authId 权限ID
 * @param remark 备注
 * @returns 
 */
 public async createIdentity(name:string,code:string,authId:string,remark:string): Promise<model.ResultType<any>> {
  const params = {
    name:name,
    code:code,
    authId:authId,
    remark:remark
  };
  const res = await this.createIdentityBase(params);
  return res;
}
}
