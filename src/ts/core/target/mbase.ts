import { common, faildResult, kernel, model, schema } from '../../base';
import { Market, BaseProduct } from '../market';
import { TargetType } from '../enum';
import { IMTarget } from './itarget';
import FlowTarget from './flow';
import consts from '../consts';

export default class MarketTarget extends FlowTarget implements IMTarget {
  joinedMarkets: Market[];
  publicMarkets: Market[];
  ownProducts: BaseProduct[];
  stagings: schema.XStaging[];
  usefulProduct: schema.XProduct[];
  usefulResource: Map<string, schema.XResource[]>;
  joinMarketApplys: schema.XMarketRelation[];
  protected extendTargetType: TargetType[];

  constructor(target: schema.XTarget) {
    super(target);
    this.stagings = [];
    this.ownProducts = [];
    this.joinedMarkets = [];
    this.joinMarketApplys = [];
    this.usefulProduct = [];
    this.publicMarkets = [];
    this.usefulResource = new Map();
    this.extendTargetType = [];
  }
  /**
   * @description: 根据编号查询市场
   * @return {*}
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
  public async getOwnProducts(reload: boolean = false): Promise<BaseProduct[]> {
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
        return new BaseProduct(a);
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
  public async getStaging(reload: boolean = false): Promise<schema.XStaging[]> {
    if (!reload && this.stagings.length > 0) {
      return this.stagings;
    }
    const res = await kernel.queryStaging({
      id: this.target.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success && res.data.result) {
      this.stagings = res.data.result;
    }
    return this.stagings;
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
    samrId: string,
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
      this.joinedMarkets.push(new Market(res.data!));
    }
    return res;
  }

  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  public createProduct = async ({
    name,
    code,
    remark,
    resources,
    thingId,
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
      this.ownProducts.push(new BaseProduct(res.data!));
    }
    return res;
  };

  public async stagingMerchandise(
    id: string,
  ): Promise<model.ResultType<schema.XStaging>> {
    const stag = this.stagings.find((a) => {
      a.merchandiseId == id;
    });
    if (stag == undefined) {
      const res = await kernel.createStaging({
        id: '0',
        merchandiseId: id,
        belongId: this.target.id,
      });
      return res;
    }
    return faildResult(consts.IsExistError);
  }

  public async deleteStaging(id: string): Promise<model.ResultType<any>> {
    const stag = this.stagings.find((a) => {
      a.id == id;
    });
    if (stag != undefined) {
      const res = await kernel.deleteStaging({
        id,
        belongId: this.target.id,
      });
      if (res.success) {
        this.stagings = this.stagings.filter((a) => {
          a.id != id;
        });
      }
      return res;
    }
    return faildResult(consts.NotFoundError);
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
        return market.market.id != id;
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
      this.ownProducts = this.ownProducts.filter((prod) => {
        return prod.id != id;
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
        return market.market.id != id;
      });
    }
    return res;
  }
  /** 获得可用应用 */
  public async getUsefulProduct(): Promise<schema.XProduct[]> {
    if (this.usefulProduct.length > 0) {
      return this.usefulProduct;
    }
    const res = await kernel.queryUsefulProduct({
      spaceId: this.target.id,
      typeNames: this.extendTargetType,
    });
    if (res.success && res.data.result != undefined) {
      this.usefulProduct = res.data.result;
    }
    return this.usefulProduct;
  }
  /** 获得可用资源 */
  public async getUsefulResource(id: string): Promise<schema.XResource[]> {
    if (this.usefulResource.has(id) && this.usefulResource[id].length > 0) {
      return this.usefulResource[id];
    }
    const res = await kernel.queryUsefulResource({
      productId: id,
      spaceId: this.target.id,
      typeNames: this.extendTargetType,
    });
    if (res.success) {
      let resources;
      res.data.result?.forEach((a) => {
        resources.push(a);
      });
      this.usefulResource[id] = resources;
    }
    return this.usefulResource[id];
  }
}
