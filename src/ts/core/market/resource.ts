import { kernel, model, schema } from '../../base';
import Provider from '../provider';

/**
 * 应用资源操作
 */
export default class Resource {
  private _source: schema.XResource;
  constructor(source: schema.XResource) {
    this._source = source;
  }

  /**
   * 资源分发拓展操作
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  public async createExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.createSourceExtend({
      sourceId: this._source.id,
      sourceType: '资源',
      destIds,
      destType,
      spaceId: Provider.spaceId,
      teamId,
    });
  }

  /**
   * 取消资源分发
   * @param teamId 组织Id
   * @param destIds 目标Id
   * @param destType 目标类型
   * @returns
   */
  public async deleteExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteSourceExtend({
      sourceId: this._source.id,
      sourceType: '资源',
      destIds,
      destType,
      spaceId: Provider.spaceId,
      teamId,
    });
  }

  /**
   * 查询资源分发
   * @param sourceId 资源Id
   * @param destType 目标类型
   * @param teamId 组织Id
   * @returns
   */
  public async queryExtend(
    destType: string,
    teamId?: string,
  ): Promise<model.ResultType<model.IdNameArray>> {
    return await kernel.queryExtendBySource({
      sourceId: this._source.id,
      sourceType: '资源',
      spaceId: Provider.spaceId,
      destType,
      teamId,
    });
  }
}
