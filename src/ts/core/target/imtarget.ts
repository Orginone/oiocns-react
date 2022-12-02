/** 市场相关操作方法 */
export interface IMTarget {
  /** 我加入的市场 */
  joinedMarkets: Market[];
  /** 开放市场 */
  publicMarkets: Market[];
  /** 拥有的产品/应用 */
  ownProducts: BaseProduct[];
  /** 我的购物车 */
  stagings: schema.XStaging[];
  /** 我发起的加入市场的申请 */
  joinMarketApplys: schema.XMarketRelation[];
  /** 可使用的应用 */
  usefulProduct: schema.XProduct[];
  /** 可使用的资源 */
  usefulResource: Map<string, schema.XResource[]>;
  /**
   * 根据编号查询市场
   * @param name 编号、名称
   * @returns
   */
  getMarketByCode(name: string): Promise<ResultType<schema.XMarketArray>>;
  /**
   * 查询商店列表
   * @returns 商店列表
   */
  getJoinMarkets(): Promise<Market[]>;
  /**
   * 查询开放市场
   * @returns 市场
   */
  getPublicMarket(): Promise<Market[]>;
  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  getOwnProducts(): Promise<BaseProduct[]>;
  /**
   * 查询购物车列表
   */
  getStaging(): Promise<schema.XStaging[]>;
  /**
   * 查询购买订单
   */
  getBuyOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderArray>>;
  /**
   * 查询售卖订单
   */
  getSellOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderDetailArray>>;
  /**
   * 查询加入市场的审批
   * @returns
   */
  queryJoinMarketApproval(): Promise<ResultType<schema.XMarketRelationArray>>;
  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
  getJoinMarketApplys(): Promise<schema.XMarketRelation[]>;
  /**
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  applyJoinMarket(id: string): Promise<ResultType<any>>;
  /**
   * 删除发起的加入市场申请
   * @param id 申请Id
   */
  cancelJoinMarketApply(id: string): Promise<ResultType<any>>;
  /**
   * 查询应用上架的审批
   * @returns
   */
  queryPublicApproval(): Promise<ResultType<schema.XMerchandiseArray>>;
  /**
   * 审批加入市场申请
   * @param id 申请id
   * @param status 审批状态
   * @returns
   */
  approvalJoinMarketApply(id: string, status: number): Promise<ResultType<boolean>>;
  /**
   * 审批商品上架申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  approvalPublishApply(id: string, status: number): Promise<ResultType<any>>;
  /**
   * 创建市场
   * @param  {model.MarketModel} 市场基础信息
   * @returns
   */
  createMarket(
    // 名称
    name: string,
    // 编号
    code: string,
    // 备注
    remark: string,
    // 监管组织/个人
    samrId: string,
    // 产品类型名
    ispublic: boolean,
  ): Promise<ResultType<schema.XMarket>>;
  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  createProduct({
    name,
    code,
    remark,
    resources,
    thingId,
    typeName,
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
    thingId: string;
    // 产品类型名
    typeName: string;
  }): Promise<ResultType<schema.XProduct>>;
  /**
   * 添加暂存区
   * @param id 商品Id
   */
  stagingMerchandise(id: string): Promise<ResultType<any>>;
  /**
   * 删除暂存区
   * @param id 暂存区Id
   */
  deleteStaging(id: string): Promise<ResultType<any>>;
  /**
   * 删除市场
   * @param id 市场Id
   * @returns
   */
  deleteMarket(id: string): Promise<ResultType<boolean>>;
  /**
   * 删除应用
   * @param id 应用Id
   * @returns
   */
  deleteProduct(id: string): Promise<ResultType<boolean>>;
  /**
   * 退出市场
   * @param id 退出的市场Id
   * @returns
   */
  quitMarket(id: string): Promise<ResultType<any>>;
  /** 获得可用应用 */
  getUsefulProduct(): Promise<schema.XProduct[]>;
  /**
   * 获得可用资源
   * @param id 应用Id
   */
  getUsefulResource(id: string): Promise<schema.XResource[]>;
}
