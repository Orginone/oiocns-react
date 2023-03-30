import { schema, model } from '@/ts/base';

export default interface IResource {
  /** 资源实体 */
  resource: schema.XResource;
  /**
   * 资源分发拓展操作
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  createExtend(teamId: string, destIds: string[], destType: string): Promise<boolean>;
  /**
   * 取消资源分发
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  deleteExtend(teamId: string, destIds: string[], destType: string): Promise<boolean>;
  /**
   * 查询资源分发
   * @param sourceId 资源Id
   * @param destType 目标类型
   * @param teamId 组织Id
   * @returns
   */
  queryExtend(destType: string, teamId?: string): Promise<model.IdNameArray>;
}
