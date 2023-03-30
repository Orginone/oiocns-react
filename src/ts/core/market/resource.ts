import { kernel, model, schema } from '../../base';
import IResource from './iresource';

/**
 * 应用资源操作
 */
export default class Resource implements IResource {
  resource: schema.XResource;
  constructor(source: schema.XResource) {
    this.resource = source;
  }
  public async createExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<boolean> {
    return (
      await kernel.createSourceExtend({
        sourceId: this.resource.id,
        sourceType: '资源',
        destIds,
        destType,
        spaceId: this.resource.product!.belongId,
        teamId,
      })
    ).success;
  }
  public async deleteExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<boolean> {
    return (
      await kernel.deleteSourceExtend({
        sourceId: this.resource.id,
        sourceType: '资源',
        destIds,
        destType,
        spaceId: this.resource.product!.belongId,
        teamId,
      })
    ).success;
  }
  public async queryExtend(
    destType: string,
    teamId?: string,
  ): Promise<model.IdNameArray> {
    return (
      await kernel.queryExtendBySource({
        sourceId: this.resource.id,
        sourceType: '资源',
        spaceId: this.resource.product!.belongId,
        destType,
        teamId,
      })
    ).data;
  }
}
