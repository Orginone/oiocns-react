import IMarket from './imarket';
import { kernel } from '../../base';
import { model, schema } from '../../base';
import { TargetType, companyTypes } from '../enum';

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
  ): Promise<model.ResultType<any>> {
    const res = await kernel.updateMarket({
      id: this.market.id,
      name,
      code,
      samrId,
      remark,
      public: ispublic,
      belongId: this.market.belongId,
    });
    if (res.success) {
      this.market.name = name;
      this.market.code = code;
      this.market.samrId = samrId;
      this.market.remark = remark;
      this.market.public = ispublic;
    }
    return res;
  }
  public async getMember(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await kernel.queryMarketMember({
      id: this.market.id,
      page: page,
    });
  }
  public async getJoinApply(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await kernel.queryJoinMarketApply({
      id: this.market.id,
      page,
    });
  }
  public async approvalJoinApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalJoinApply({ id, status });
  }
  public async pullMember(targetIds: string[]): Promise<model.ResultType<any>> {
    return await kernel.pullAnyToMarket({
      targetIds: targetIds,
      marketId: this.market.id,
      typeNames: this.pullTypes,
    });
  }
  public async removeMember(targetIds: string[]): Promise<model.ResultType<any>> {
    return await kernel.removeMarketMember({
      targetIds,
      marketId: this.market.id,
      typeNames: this.pullTypes,
    });
  }
  public async getMerchandise(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await kernel.searchMerchandise({
      id: this.market.id,
      page: page,
    });
  }
  public async getMerchandiseApply(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await kernel.queryMerchandiesApplyByManager({
      id: this.market.id,
      page: page,
    });
  }
  public async approvalPublishApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalMerchandise({ id, status });
  }
  public async unPublish(merchandiseId: string): Promise<model.ResultType<any>> {
    return await kernel.deleteMerchandiseByManager({
      id: merchandiseId,
      belongId: this.market.belongId,
    });
  }
  public async createOrder(
    nftId: string,
    name: string,
    code: string,
    spaceId: string,
    merchandiseIds: string[],
  ): Promise<model.ResultType<schema.XOrder>> {
    return await kernel.createOrder({
      id: '0',
      nftId,
      name,
      code,
      belongId: spaceId,
      merchandiseIds,
    });
  }
}
