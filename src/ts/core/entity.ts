/* eslint-disable no-unused-vars */

import { TargetType } from './enum';

export interface Mixin {
  id: string;
  name: string;
  code: string;
  status: number;
  createUser: string;
  updateUser: string;
  version: string;
  createTime: string;
  updateTime: string;
}

export interface TTeam extends Mixin {
  targetId: string;
  remark: string;
  target: TTarget | undefined;
}

export interface TTarget extends Mixin {
  typeName: TargetType;
  thingId: string;
  belongId: string;
  team: TTeam | undefined;
}

export interface TMerchandise extends Mixin {
  days: number;
  price: number;
  caption: string;
  information: string;
  sellAuth: '所属权' | '使用权';
  orders?: TOrderDetail[];
  stags?: TProduct[];
}

export interface TProduct extends Mixin {
  source: '创建的' | '购买的';
  authority: '所属权' | '使用权';
  typeName: string;
  belongId: string;
  thingId: string;
  orderId: string;
  remark: string;
  resource: TResource[];
  merchandises: TMerchandise[];
}

export interface TResource extends Mixin {
  privateKey: string;
  link: string;
  flows: string;
  components: string;
}

export interface TOrder extends Mixin {
  nftId: string;
  price: number;
  belongId: string;
}

export interface TOrderDetail extends Mixin {
  price: number;
  days?: number;
  caption: string;
  sellAuth: '所属权' | '使用权';
  productSource: '创建的' | '购买的';
}

export interface TStaging extends Mixin {
  number: number;
  merchandise: TMerchandise;
}

export interface TStore extends Mixin {
  public: boolean;
  remark: string;
  belongId: string;
  samrId: string;
  stags: TStaging[];
  merchandises: TMerchandise[];
}
