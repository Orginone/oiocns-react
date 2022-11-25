import { Obj } from './type';
export interface market {
  id: string;
  name: string;
  code: string;
  remark: string;
  public: boolean;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
}
export interface merchandise {
  id: string;
  caption: string;
  productId: string;
  sellAuth: string;
  days?: string;
  price?: number;
  marketId: string;
  information?: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
}
export interface result<T, J> {
  id: string;
  merchandiseId: string;
  belongId: string;
  marketId: string;
  number: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
  market: T;
  merchandise: J;
}

export interface Appdata<T> {
  limit: number;
  total: number;
  result: Array<T>;
}
