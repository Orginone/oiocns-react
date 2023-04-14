import { IIdentity } from './iidentity';
import { model, schema } from '@/ts/base';
import { PageRequest } from '@/ts/base/model';

export interface IAuthority {
  /** 权限Id */
  id: string;
  /** 权限名称 */
  name: string;
  /** 权限编号 */
  code: string;
  /** 权限归属ID */
  belongId: string;
  /**备注 */
  remark: string;
  /** 数据 */
  target: schema.XAuthority;
  /** 子权限 */
  children: IAuthority[];
  /** 权限下的角色 */
  identitys: IIdentity[];
  /**
   * 创建子权限
   * @param name 名称
   * @param code 编号
   * @param ispublic 是否公开
   * @param remark 备注
   * @returns
   */
  createSubAuthority(
    name: string,
    code: string,
    belongId: string,
    ispublic: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>>;
  /**
   * 删除权限
   * @returns
   */
  delete(): Promise<model.ResultType<any>>;
  /**
   * 删除子权限
   * @param id 子权限Id
   * @returns
   */
  deleteSubAuthority(id: string): Promise<model.ResultType<any>>;
  /**
   * 更新权限
   * @param name 名称
   * @param code 编号
   * @param ispublic 公开的
   * @param remark 备注
   * @returns
   */
  updateAuthority(
    name: string,
    code: string,
    ispublic: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>>;
  /**
   * 查询指定权限下的角色列表
   *  @param reload 是否强制刷新
   * @returns
   */
  queryAuthorityIdentity(reload: boolean): Promise<IIdentity[]>;
  /**
   * 查询指定权限下的人员列表
   *  @param reload 是否强制刷新
   * @returns
   */
  queryAuthorityPerson(
    spaceId: string,
    page: PageRequest,
  ): Promise<model.ResultType<schema.XTargetArray>>;
}
