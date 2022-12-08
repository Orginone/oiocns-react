import { PageRequest } from '@/ts/base/model';
import { model, schema } from '@/ts/base';

export interface IIdentity {
  /** 实体对象 */
  target: schema.XIdentity;
  /** 当前身份Id */
  id: string;
  /** 当前身份名称 */
  name: string;
  /**
   * 更新身份
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns
   */
  updateIdentity(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>>;
  /**
   * 加载组织成员
   * @param page 分页请求
   */
  loadMembers(page: PageRequest): Promise<schema.XTargetArray>;
  /**
   * 拉取成员加入群组
   * @param {string[]} ids 成员ID数组
   */
  pullMembers(ids: string[]): Promise<boolean>;
  /**
   * 移除群成员
   * @param {string[]} ids 成员ID数组
   * @param {TargetType} type 成员类型
   */
  removeMembers(ids: string[]): Promise<boolean>;
}
