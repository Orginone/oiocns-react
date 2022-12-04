import { IIdentity } from './iidentity';
import { model, schema } from '@/ts/base';

export interface IAuthority {
  /** 职权Id */
  id: string;
  /** 职权名称 */
  name: string;
  /** 职权编号 */
  code: string;
  /** 职权归属ID */
  belongId: string;
  /**备注 */
  remark: string;
  /** 子职权 */
  children: IAuthority[];
  /** 职权下的身份 */
  identitys: IIdentity[];
  /**
   * 创建子职权
   * @param name 名称
   * @param code 编号
   * @param ispublic 是否公开
   * @param remark 备注
   * @returns
   */
  createSubAuthority(
    name: string,
    code: string,
    ispublic: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>>;
  /**
   * 删除子职权
   * @param id 子职权Id
   * @returns
   */
  deleteSubAuthority(id: string): Promise<model.ResultType<any>>;
  /**
   * 更新职权
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
   * 查询指定职权下的身份列表
   *  @param reload 是否强制刷新
   * @returns
   */
  queryAuthorityIdentity(reload: boolean): Promise<IIdentity[]>;
  /**
   * 查询职权子职权
   *  @param reload 是否强制刷新
   * @returns
   */
  getSubAuthoritys(reload: boolean): Promise<IAuthority[]>;
}
