import BaseTarget from './base';
import { common, kernel, model, schema } from '../../base';
import { AppStore, Product } from '../market';
import { PageRequest } from '@/ts/base/model';

export default class MarketActionTarget extends BaseTarget {
  protected _joinMarketApplys: schema.XMarketRelation[];
  protected _joinedMarkets: AppStore[];
  protected _owdProducts: Product[];
  constructor(target: schema.XTarget) {
    super(target);
    this._owdProducts = [];
    this._joinedMarkets = [];
    this._joinMarketApplys = [];
  }

  /**
   * 根据编号查询市场
   * @param page 分页参数
   * @returns
   */
  public async getMarketByCode(
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketArray>> {
    return await kernel.queryMarketByCode({
      id: '0',
      page,
    });
  }

  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
  public async getJoinMarketApplys(page: PageRequest): Promise<schema.XMarketRelation[]> {
    if (this._joinMarketApplys.length > 0) {
      return this._joinMarketApplys;
    }
    const res = await kernel.queryJoinMarketApply({
      id: this.target.id,
      page,
    });
    if (res.success && res.data?.result != undefined) {
      this._joinMarketApplys = res.data.result;
    }
    return this._joinMarketApplys;
  }

  /**
   * 删除发起的加入市场申请
   * @param id 申请Id
   */
  public async cancelJoinMarketApply(id: string) {
    const res = await kernel.cancelJoinMarket({
      id,
      typeName: this.target.typeName,
      belongId: this.target.id,
    });
    if (res.success) {
      this._joinMarketApplys = this._joinMarketApplys.filter((apply) => {
        return apply.id != id;
      });
    }
  }

  /**
   * 查询商店列表
   * @returns 商店列表
   */
  public async getJoinMarkets(): Promise<AppStore[]> {
    if (this._joinedMarkets.length > 0) {
      return this._joinedMarkets;
    }
    const res = await kernel.queryOwnMarket({
      id: this.target.id,
      page: { offset: 0, limit: common.Constants.MAX_UINT_16, filter: '' },
    });
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((market) => {
        this._joinedMarkets.push(new AppStore(market));
      });
    }
    return this._joinedMarkets;
  }

  /**
   * 查询开放市场
   * @returns 市场
   */
  public async getPublicMarket(): Promise<model.ResultType<schema.XMarket>> {
    return await kernel.getPublicMarket();
  }

  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  public getOwnProducts = async (): Promise<Product[]> => {
    if (this._owdProducts.length > 0) {
      return this._owdProducts;
    }
    const res = await kernel.querySelfProduct({
      id: this.target.id,
      page: {
        offset: 0,
        filter: this.target.id,
        limit: common.Constants.MAX_UINT_8,
      },
    });
    if (res.success && res?.data?.result != undefined) {
      res.data.result.forEach((product) => {
        this._owdProducts.push(new Product(product));
      });
    }
    return this._owdProducts;
  };

  /**
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  public async applyJoinMarket(id: string): Promise<model.ResultType<any>> {
    return await kernel.applyJoinMarket({ id: id, belongId: this.target.id });
  }

  /**
   * 审批加入市场申请
   * @param id 申请id
   * @param status 审批状态
   * @returns
   */
  public async ApprovalJoinApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<boolean>> {
    return kernel.approvalJoinApply({ id, status });
  }

  /**
   * 退出市场
   * @param appStore 退出的市场
   * @returns
   */
  public async quitMarket(appStore: AppStore): Promise<model.ResultType<any>> {
    const res = await kernel.quitMarket({
      id: appStore.store.id,
      belongId: this.target.id,
    });
    if (res.success) {
      delete this._joinedMarkets[this._joinedMarkets.indexOf(appStore)];
    }
    return res;
  }

  /**
   * 创建市场
   * @param  {model.MarketModel} 市场基础信息
   * @returns
   */
  public async createMarket(
    // 名称
    name: string,
    // 编号
    code: string,
    // 备注
    remark: string,
    // 监管组织/个人
    samrId: string = '0',
    // 产品类型名
    ispublic: boolean = true,
  ) {
    const res = await kernel.createMarket({
      name,
      code,
      remark,
      samrId,
      id: undefined,
      public: ispublic,
      belongId: this.target.id,
    });
    if (res.success) {
      this._joinedMarkets.push(new AppStore(res.data!));
    }
    return res;
  }

  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  public async createProduct(
    // 名称
    name: string,
    // 编号
    code: string,
    // 备注
    remark: string,
    // 资源列
    resources: model.ResourceModel[] | undefined,
    // 元数据Id
    thingId: string = '0',
    // 产品类型名
    typeName: string = 'webApp',
  ): Promise<model.ResultType<schema.XProduct>> {
    const res = await kernel.createProduct({
      name,
      code,
      remark,
      resources,
      thingId,
      typeName,
      id: undefined,
      belongId: this.target.id,
    });
    if (res.success) {
      this._owdProducts.push(new Product(res.data!));
    }
    return res;
  }

  /**
   * 删除市场
   * @param market 市场
   * @returns
   */
  public async deleteMarket(market: AppStore): Promise<model.ResultType<boolean>> {
    const index = this._joinedMarkets.indexOf(market);
    const res = await kernel.deleteMarket({
      id: market.store.id,
      belongId: this.target.id,
    });
    if (res.success) {
      delete this._owdProducts[index];
    }
    return res;
  }

  /**
   * 删除应用
   * @param product 应用
   * @returns
   */
  public async deleteProduct(product: Product): Promise<model.ResultType<boolean>> {
    const index = this._owdProducts.indexOf(product);
    const res = await kernel.deleteProduct({
      id: product.prod.id,
      belongId: this.target.id,
    });
    if (res.success) {
      delete this._owdProducts[index];
    }
    return res;
  }
}
