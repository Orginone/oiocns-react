import { IIdentity } from './iidentity';
import { model, schema } from '../../../base';

export interface IAuthority {
  /** 职权Id */
  id: string;
  /** 职权名称 */
  name: string;
  /** 职权编号 */
  code: string;
  /** 职权归属ID */
  belongId: string;
  /** 子职权 */
  children: IAuthority[];
  /** 职权下的身份 */
  identitys: IIdentity[];
  /**
   * 创建身份
   * @param name 名称
   * @param code 编号
   * @param authId 职权Id
   * @param remark 备注
   * @returns
   */
  createIdentity(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>>;
  /**
   * 删除身份
   * @param id 身份Id
   * @returns
   */
  deleteIdentity(id: string): Promise<model.ResultType<any>>;
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
   * @param id 唯一ID
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
   * @param id
   * @returns
   */
  queryAuthorityIdentity(): Promise<IIdentity[]>;
  /**
   * 查询职权子职权
   * @param id
   * @returns
   */
  getSubAuthoritys(): Promise<IAuthority[]>;
}
