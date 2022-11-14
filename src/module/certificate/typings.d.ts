
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
export type PayReq = {
  orderDetailId: number;
  price: number;
  paymentType: string;
};





