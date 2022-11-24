import { common, kernel, model, schema } from '../../base';
import { AppStore, Product } from '../market';
import { TargetType } from '../enum';
import { IMTarget } from './itarget';
import BaseTarget from './base';

export default class MarketTarget extends BaseTarget implements IMTarget {
  public joinMarketApplys: schema.XMarketRelation[];
  public joinedMarkets: AppStore[];
  public owdProducts: Product[];
  constructor(target: schema.XTarget) {
    super(target);
    this.owdProducts = [];
    this.joinedMarkets = [];
    this.joinMarketApplys = [];
  }

  /**
   * 根据编号查询市场
   * @param name 编号、名称
   * @returns
   */
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

  /**
   * 查询商店列表
   * @returns 商店列表
   */
  public async getJoinMarkets(): Promise<AppStore[]> {
    if (this.joinedMarkets.length > 0) {
      return this.joinedMarkets;
    }
    const res = await kernel.queryOwnMarket({
      id: this.target.id,
      page: { offset: 0, limit: common.Constants.MAX_UINT_16, filter: '' },
    });
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((market) => {
        this.joinedMarkets.push(new AppStore(market));
      });
    }
    return this.joinedMarkets;
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
  public async getOwnProducts(): Promise<Product[]> {
    if (this.owdProducts.length > 0) {
      return this.owdProducts;
    }
    const res = await kernel.querySelfProduct({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_8,
      },
    });
    if (res.success && res?.data?.result != undefined) {
      res.data.result.forEach((product) => {
        this.owdProducts.push(new Product(product));
      });
    }
    return this.owdProducts;
  }

  /**
   * 查询加入市场的审批
   * @returns
   */
  public async queryJoinMarketApproval(): Promise<
    model.ResultType<schema.XMarketRelationArray>
  > {
    return await kernel.queryJoinApproval({
      id: this.target.typeName == TargetType.Person ? '0' : this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
  }

  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
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

  /**
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  public async applyJoinMarket(id: string): Promise<model.ResultType<any>> {
    return await kernel.applyJoinMarket({ id: id, belongId: this.target.id });
  }

  /**
   * 删除发起的加入市场申请
   * @param id 申请Id
   */
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

  /**
   * 查询应用上架的审批
   * @returns
   */
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

  /**
   * 审批加入市场申请
   * @param id 申请id
   * @param status 审批状态
   * @returns
   */
  public async approvalJoinMarketApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<boolean>> {
    return kernel.approvalJoinApply({ id, status });
  }

  /**
   * 审批商品上架申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  public async approvalPublishApply(
    id: string,
    status: number,
  ): Promise<model.ResultType<any>> {
    return await kernel.approvalMerchandise({ id, status });
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
  ): Promise<model.ResultType<schema.XMarket>> {
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
      this.joinedMarkets.push(new AppStore(res.data!));
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
      this.owdProducts.push(new Product(res.data!));
    }
    return res;
  }

  /**
   * 删除市场
   * @param id 市场Id
   * @returns
   */
  public async deleteMarket(id: string): Promise<model.ResultType<boolean>> {
    const res = await kernel.deleteMarket({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinedMarkets = this.joinedMarkets.filter((market) => {
        return market.store.id != id;
      });
    }
    return res;
  }

  /**
   * 删除应用
   * @param id 应用Id
   * @returns
   */
  public async deleteProduct(id: string): Promise<model.ResultType<boolean>> {
    const res = await kernel.deleteProduct({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this.owdProducts = this.owdProducts.filter((market) => {
        return market.prod.id != id;
      });
    }
    return res;
  }

  /**
   * 退出市场
   * @param id 退出的市场Id
   * @returns
   */
  public async quitMarket(id: string): Promise<model.ResultType<any>> {
    const res = await kernel.quitMarket({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this.joinedMarkets = this.joinedMarkets.filter((market) => {
        return market.store.id != id;
      });
    }
    return res;
  }
}
