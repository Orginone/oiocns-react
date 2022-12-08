import { WebApp } from '@/ts/core/market';
import { common, kernel, model, schema } from '../../base';
import { Market } from '../market';
import { ProductType, TargetType } from '../enum';
import { IMTarget } from './itarget';
import FlowTarget from './flow';
import IProduct from '../market/iproduct';

export default class MarketTarget extends FlowTarget implements IMTarget {
  joinedMarkets: Market[];
  publicMarkets: Market[];
  ownProducts: IProduct[];
  usefulProduct: schema.XProduct[];
  usefulResource: Map<string, schema.XResource[]>;
  joinMarketApplys: schema.XMarketRelation[];
  protected extendTargetType: TargetType[];

  constructor(target: schema.XTarget) {
    super(target);
    this.ownProducts = [];
    this.joinedMarkets = [];
    this.joinMarketApplys = [];
    this.usefulProduct = [];
    this.publicMarkets = [];
    this.usefulResource = new Map();
    this.extendTargetType = [];
  }
  public async getMarketByCode(
    name: string,
  ): Promise<model.ResultType<schema.XMarketArray>> {
    return await kernel.queryMarketByCode({
      id: '0',
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: name,
      },
    });
  }
  public async getOwnProducts(reload: boolean = false): Promise<IProduct[]> {
    if (!reload && this.ownProducts.length > 0) {
      return this.ownProducts;
    }
    const res = await kernel.querySelfProduct({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_8,
      },
    });
    if (res.success && res.data.result) {
      this.ownProducts = res.data.result.map((a) => {
        switch (a.typeName) {
          default:
            return new WebApp(a);
        }
      });
    }
    return this.ownProducts;
  }
  public async getJoinMarkets(reload: boolean = false): Promise<Market[]> {
    if (!reload && this.joinedMarkets.length > 0) {
      return this.joinedMarkets;
    }
    const res = await kernel.queryOwnMarket({
      id: this.target.id,
      page: { offset: 0, limit: common.Constants.MAX_UINT_16, filter: '' },
    });
    if (res.success && res.data.result) {
      this.joinedMarkets = res.data.result.map((a) => {
        return new Market(a);
      });
    }
    return this.joinedMarkets;
  }
  public async getPublicMarket(reload: boolean = false): Promise<Market[]> {
    if (!reload && this.publicMarkets.length > 0) {
      return this.publicMarkets;
    }
    const res = await kernel.getPublicMarket();
    if (res.success && res.data.result) {
      this.publicMarkets = res.data.result.map((a) => {
        return new Market(a);
      });
    }
    return this.publicMarkets;
  }
  public async getBuyOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XOrderArray>> {
    return await kernel.queryBuyOrderList({
      id: this.target.id,
      status,
      page,
    });
  }
  public async getSellOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XOrderDetailArray>> {
    const res = await kernel.querySellOrderList({
      id: this.target.id,
      status,
      page,
    });
    return res;
  }
  public async queryJoinMarketApproval(): Promise<
    model.ResultType<schema.XMarketRelationArray>
  > {
    return await kernel.queryJoinApproval({
      id: this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
  }
  public async getJoinMarketApplys(): Promise<schema.XMarketRelation[]> {
    if (this.joinMarketApplys.length > 0) {
      return this.joinMarketApplys;
    }
    const res = await kernel.queryJoinMarketApply({
      id: this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data?.result != undefined) {
      this.joinMarketApplys = res.data.result;
    }
    return this.joinMarketApplys;
  }
  public async applyJoinMarket(id: string): Promise<model.ResultType<any>> {
    return await kernel.applyJoinMarket({ id: id, belongId: this.target.id });
  }
  public async cancelJoinMarketApply(id: string): Promise<model.ResultType<any>> {
    const res = await kernel.cancelJoinMarket({
      id,
      typeName: this.target.typeName,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinMarketApplys = this.joinMarketApplys.filter((apply) => {
        return apply.id != id;
      });
    }
    return res;
  }
  public async queryPublicApproval(): Promise<
    model.ResultType<schema.XMerchandiseArray>
  > {
    return await kernel.queryPublicApproval({
      id: this.target.typeName == TargetType.Person ? '0' : this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
  }
  public async approvalJoinMarketApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<boolean>> {
    return kernel.approvalJoinApply({ id, status });
  }
  public async approvalPublishApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalMerchandise({ id, status });
  }
  public async createMarket({
    name,
    code,
    remark,
    samrId,
    ispublic = true,
  }: {
    name: string;
    code: string;
    remark: string;
    samrId: string;
    ispublic: boolean;
  }): Promise<model.ResultType<schema.XMarket>> {
    const res = await kernel.createMarket({
      name,
      code,
      remark,
      samrId,
      id: undefined,
      public: ispublic,
      belongId: this.target.id,
    });
    console.log('创建市场的结果', res);

    if (res.success) {
      this.joinedMarkets.push(new Market(res.data!));
    }
    return res;
  }
  public async createProduct(
    data: Omit<model.ProductModel, 'id' | 'belongId'>,
  ): Promise<model.ResultType<schema.XProduct>> {
    const res = await kernel.createProduct({
      ...data,
      typeName: ProductType.WebApp,
      id: undefined,
      belongId: this.target.id,
    });
    if (res.success && res.data) {
      let prod: IProduct;
      switch (<ProductType>data.typeName) {
        default:
          prod = new WebApp(res.data);
      }
      this.ownProducts.push(prod);
    }
    return res;
  }
  public async deleteMarket(id: string): Promise<model.ResultType<boolean>> {
    const res = await kernel.deleteMarket({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinedMarkets = this.joinedMarkets.filter((market) => {
        return market.market.id != id;
      });
    }
    return res;
  }
  public async deleteProduct(id: string): Promise<model.ResultType<boolean>> {
    const res = await kernel.deleteProduct({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this.ownProducts = this.ownProducts.filter((prod) => {
        return prod.prod.id != id;
      });
    }
    return res;
  }
  public async quitMarket(id: string): Promise<model.ResultType<any>> {
    const res = await kernel.quitMarket({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinedMarkets = this.joinedMarkets.filter((market) => {
        return market.market.id != id;
      });
    }
    return res;
  }
  public async getUsefulProduct(reload: boolean = false): Promise<schema.XProduct[]> {
    if (!reload && this.usefulProduct.length > 0) {
      return this.usefulProduct;
    }
    const res = await kernel.queryUsefulProduct({
      spaceId: this.target.id,
      typeNames: this.extendTargetType,
    });
    if (res.success && res.data.result) {
      this.usefulProduct = res.data.result;
    }
    return this.usefulProduct;
  }
  public async getUsefulResource(
    id: string,
    reload: boolean = false,
  ): Promise<schema.XResource[]> {
    if (!reload && this.usefulResource.has(id) && this.usefulResource[id].length > 0) {
      return this.usefulResource[id];
    }
    const res = await kernel.queryUsefulResource({
      productId: id,
      spaceId: this.target.id,
      typeNames: this.extendTargetType,
    });
    if (res.success && res.data.result) {
      this.usefulResource[id] = res.data.result;
    }
    return this.usefulResource[id];
  }
}
