
/**
 * 创建市场类请求体
 */
export type CreateMarketReq = {
  name: string;
  code?: string;
  samrId: number;
  remark?: string;
  public: boolean;
};

export type CreateMerchandiseReq = {
  caption: string;
  productid: number;
  price: number;
  sellAuth: string;
  marketId: number;
  information?: string;
  days: number;
};

export type CreateOrderByStagReq = {
  name: string;
  code?: string;
  stagIds: number[];
};

export type CreateOrderReq = {
  name: string;
  code: string;
  merchandiseId: number;
};

/**
 * 创建应用请求体
 */
export type CreateProductReq = {
  name: string;
  code?: string;
  thingId: number;
  remark?: string;
  resources?: ResourceModel[];
};

/**
 * 创建资源请求体
 */
export type CreateResourceReq = {
  productId: number;
  code?: string;
  name: string;
  link: string;
  flows?: string;
  components?: string;
};

export type CreateResourcesReq = {
  productId: number;
  resources?: ResourceModel[];
};

/**
 * 加入市场请求体
 */
export type JoinMarketReq = {
  targetIds: number[];
  marketId: number;
};

export type PayReq = {
  orderDetailId: number;
  price: number;
  paymentType: string;
};

export type ResourceModel = {
  id: number;
  code?: string;
  name: string;
  link: string;
  flows?: string;
  components?: string;
};

export type StagingReq = {
  id: number;
  merchandiseId: number;
};

export type UpdateMarketReq = {
  id: number;
  name: string;
  code?: string;
  samrId: number;
  remark?: string;
  public: boolean;
};

export type UpdateMerchandiseReq = {
  id: number;
  caption: string;
  price: number;
  sellAuth: string;
  information?: string;
  days: number;
};

export type UpdateOrderDetailReq = {
  id: number;
  price: number;
  days: number;
  caption?: string;
  status: number;
};

/**
 * 修改订单请求体
 */
export type UpdateOrderReq = {
  id: number;
  nftId?: string;
  name: string;
  code?: string;
};

/**
 * 修改产品请求体
 */
export type UpdateProductReq = {
  id: number;
  name: string;
  code?: string;
  remark?: string;
  resources?: ResourceModel[];
};

/**
 * 修改资源请求体
 */
export type UpdateResourceReq = {
  id: number;
  code?: string;
  name: string;
  link: string;
  flows?: string;
  components?: string;
};

