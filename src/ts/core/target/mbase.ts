import BaseTarget from './base';
import { common, kernel, model, schema } from '../../base';
import { AppStore, Product } from '../market';
import { PageRequest } from '@/ts/base/model';
import { XMarketRelationArray, XMerchandiseArray } from '@/ts/base/schema';
import { TargetType } from '../enum';

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
  getMarketByCode = async (
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketArray>> => {
    return await kernel.queryMarketByCode({
      id: '0',
      page,
    });
  };

  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
  getJoinMarketApplys = async (page: PageRequest): Promise<schema.XMarketRelation[]> => {
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
  };

  /**
   * 删除发起的加入市场申请
   * @param id 申请Id
   */
  cancelJoinMarketApply = async (id: string): Promise<model.ResultType<any>> => {
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
    return res;
  };

  /**
   * 查询商店列表
   * @returns 商店列表
   */
  getJoinMarkets = async (): Promise<AppStore[]> => {
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
  };

  /**
   * 查询开放市场
   * @returns 市场
   */
  getPublicMarket = async (): Promise<model.ResultType<schema.XMarket>> => {
    return await kernel.getPublicMarket();
  };

  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  getOwnProducts = async (): Promise<Product[]> => {
    if (this._owdProducts.length > 0) {
      return this._owdProducts;
    }
    const res = await kernel.querySelfProduct({
      id: this.target.id,
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_8,
      },
    });
    console.log('我的应用', res);

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
  applyJoinMarket = async (id: string): Promise<model.ResultType<any>> => {
    return await kernel.applyJoinMarket({ id: id, belongId: this.target.id });
  };

  /**
   * 查询加入市场的审批
   * @returns
   */
  getJoinApproval = async (): Promise<model.ResultType<XMarketRelationArray>> => {
    return await kernel.queryJoinApproval({
      id: this.target.typeName == TargetType.Person ? '0' : this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
  };

  /**
   * 查询应用上架的审批
   * @returns
   */
  getPublicApproval = async (): Promise<model.ResultType<XMerchandiseArray>> => {
    return await kernel.queryPublicApproval({
      id: this.target.typeName == TargetType.Person ? '0' : this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
  };

  /**
   * 审批加入市场申请
   * @param id 申请id
   * @param status 审批状态
   * @returns
   */
  approvalJoinMarketApply = async (
    id: string,
    status: number,
  ): Promise<model.ResultType<boolean>> => {
    return kernel.approvalJoinApply({ id, status });
  };

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
  createMarket = async ({
    name,
    code,
    remark,
    samrId = '0',
    ispublic = true,
  }: {
    // 名称
    name: string;
    // 编号
    code: string;
    // 备注
    remark: string;
    // 监管组织/个人
    samrId: string;
    // 产品类型名
    ispublic: boolean;
  }): Promise<model.ResultType<schema.XMarket>> => {
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
  };

  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  createProduct = async ({
    name,
    code,
    remark,
    resources,
    thingId = '0',
    typeName = 'webApp',
  }: {
    // 名称
    name: string;
    // 编号
    code: string;
    // 备注
    remark: string;
    // 资源列
    resources: model.ResourceModel[] | undefined;
    // 元数据Id
    thingId?: string;
    // 产品类型名
    typeName?: string;
  }): Promise<model.ResultType<schema.XProduct>> => {
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
  };

  /**
   * 删除市场
   * @param market 市场
   * @returns
   */
  deleteMarket = async (market: AppStore): Promise<model.ResultType<boolean>> => {
    const index = this._joinedMarkets.indexOf(market);
    const res = await kernel.deleteMarket({
      id: market.store.id,
      belongId: this.target.id,
    });
    if (res.success) {
      delete this._owdProducts[index];
    }
    return res;
  };

  /**
   * 删除应用
   * @param product 应用
   * @returns
   */
  deleteProduct = async (productId: string): Promise<model.ResultType<boolean>> => {
    const res = await kernel.deleteProduct({
      id: productId,
      belongId: this.target.id,
    });
    if (res.success) {
      this._owdProducts = this._owdProducts.filter((v) => {
        return v.prod.id !== productId;
      });
    }
    return res;
  };

  /**
   * 退出市场
   * @param id 退出的市场Id
   * @returns
   */
  quitMarket = async (id: string): Promise<model.ResultType<any>> => {
    const res = await kernel.quitMarket({
      id,
      belongId: this.target.id,
    });
    if (res.success) {
      this._joinedMarkets = this._joinedMarkets.filter((market) => {
        return market.store.id != id;
      });
    }
    return res;
  };
}
