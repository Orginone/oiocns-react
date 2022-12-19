import IMarket from './imarket';
import { kernel } from '../../base';
import { model, schema } from '../../base';
import { TargetType, companyTypes } from '../enum';
import { XMarketRelationArray, XMerchandiseArray } from '@/ts/base/schema';

export default class Market implements IMarket {
  market: schema.XMarket;
  pullTypes: TargetType[];
  constructor(store: schema.XMarket) {
    this.market = store;
    this.pullTypes = [TargetType.Person, ...companyTypes];
  }
  public async update(
    name: string,
    code: string,
    samrId: string,
    remark: string,
    ispublic: boolean,
    photo: string,
  ): Promise<boolean> {
    const res = await kernel.updateMarket({
      id: this.market.id,
      name,
      code,
      samrId,
      remark,
      photo,
      public: ispublic,
      belongId: this.market.belongId,
    });
    if (res.success) {
      this.market.name = name;
      this.market.code = code;
      this.market.samrId = samrId;
      this.market.remark = remark;
      this.market.public = ispublic;
      this.market.photo = photo;
      return true;
    }
    return false;
  }
  public async getMember(page: model.PageRequest): Promise<XMarketRelationArray> {
    return (
      await kernel.queryMarketMember({
        id: this.market.id,
        page: page,
      })
    ).data;
  }
  public async getJoinApply(
    page: model.PageRequest,
  ): Promise<schema.XMarketRelationArray> {
    return (
      await kernel.queryJoinMarketApply({
        id: this.market.id,
        page,
      })
    ).data;
  }
  public async approvalJoinApply(id: string, status: number): Promise<boolean> {
    return (await kernel.approvalJoinApply({ id, status })).success;
  }
  public async pullMember(targetIds: string[]): Promise<boolean> {
    return (
      await kernel.pullAnyToMarket({
        targetIds: targetIds,
        marketId: this.market.id,
        typeNames: this.pullTypes,
      })
    ).success;
  }
  public async removeMember(targetIds: string[]): Promise<boolean> {
    return (
      await kernel.removeMarketMember({
        targetIds,
        marketId: this.market.id,
        typeNames: this.pullTypes,
      })
    ).success;
  }
  public async getMerchandise(page: model.PageRequest): Promise<XMerchandiseArray> {
    return (
      await kernel.searchMerchandise({
        id: this.market.id,
        page: page,
      })
    ).data;
  }
  public async getMerchandiseApply(page: model.PageRequest): Promise<XMerchandiseArray> {
    return (
      await kernel.queryMerchandiesApplyByManager({
        id: this.market.id,
        page: page,
      })
    ).data;
  }
  public async approvalPublishApply(id: string, status: number): Promise<boolean> {
    return (await kernel.approvalMerchandise({ id, status })).success;
  }
  public async unPublish(merchandiseId: string): Promise<boolean> {
    return (
      await kernel.deleteMerchandiseByManager({
        id: merchandiseId,
        belongId: this.market.belongId,
      })
    ).success;
  }
}
