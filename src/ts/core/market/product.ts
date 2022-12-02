import { CommonStatus } from './../enum';
import { common } from '@/ts/base';
import { kernel, model, schema } from '../../base';
import IResource from './iresource';
import Resource from './resource';
import IProduct from './iproduct';
import IMerchandise from './imerchandise';
import Merchandise from './merchandise';
import userCtrl from '@/ts/controller/setting/userCtrl';

export default class Product implements IProduct {
  prod: schema.XProduct;
  resource: IResource[];
  merchandises: IMerchandise[];

  constructor(prod: schema.XProduct) {
    this.prod = prod;
    this.merchandises = [];
    this.resource = [];
    prod.resource?.forEach((a) => {
      this.resource?.push(new Resource(a));
    });
  }
  public async getMerchandises(): Promise<IMerchandise[]> {
    if (this.merchandises.length > 0) {
      return this.merchandises;
    }
    const res = await kernel.queryMerchandiseListByProduct({
      id: this.prod.id,
      page: {
        offset: 0,
        limit: common.Constants.MAX_UINT_16,
        filter: '',
      },
    });
    if (res.success) {
      res.data.result?.forEach((a) => {
        this.merchandises.push(new Merchandise(a));
      });
    }
    return this.merchandises;
  }
  public async createExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.createSourceExtend({
      sourceId: this.prod.id,
      sourceType: '产品',
      spaceId: userCtrl.Space!.target.id,
      destIds,
      destType,
      teamId,
    });
  }
  public async deleteExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.deleteSourceExtend({
      sourceId: this.prod.id,
      sourceType: '产品',
      destIds,
      destType,
      spaceId: userCtrl.Space!.target.id,
      teamId,
    });
  }
  public async queryExtend(
    destType: string,
    teamId?: string,
  ): Promise<model.ResultType<model.IdNameArray>> {
    return await kernel.queryExtendBySource({
      sourceId: this.prod.id,
      sourceType: '产品',
      spaceId: userCtrl.Space!.target.id,
      destType,
      teamId,
    });
  }
  public async publish(params: {
    caption: string;
    marketId: string;
    sellAuth: '所属权' | '使用权';
    information: string;
    price: number;
    days: string;
  }): Promise<model.ResultType<any>> {
    const res = await kernel.createMerchandise({
      id: '0',
      caption: params.caption,
      marketId: params.marketId,
      sellAuth: params.sellAuth,
      information: params.information,
      price: Number(params.price) ?? 0,
      days: params.days || '0',
      productId: this.prod.id,
    });
    if (res.success) {
      if (res.data.status >= CommonStatus.ApproveStartStatus) {
        this.merchandises.push(new Merchandise(res.data));
      }
    }
    return res;
  }
  public async unPublish(id: string): Promise<model.ResultType<any>> {
    const res = await kernel.deleteMerchandise({
      id,
      belongId: userCtrl.Space!.target.id,
    });
    if (res.success) {
      this.merchandises = this.merchandises.filter((a) => {
        return a.merchandise.id != id;
      });
    }
    return res;
  }
  public async update(
    name: string,
    code: string,
    typeName: string,
    remark: string,
    resources: model.ResourceModel[],
  ): Promise<model.ResultType<any>> {
    const res = await kernel.updateProduct({
      id: this.prod.id,
      name,
      code,
      typeName,
      remark,
      thingId: this.prod.thingId,
      belongId: this.prod.belongId,
      resources,
    });
    if (res.success) {
      this.prod.name = name;
      this.prod.code = code;
      this.prod.typeName = typeName;
      this.prod.remark = remark;
      this.resource = [];
      res.data.resource?.forEach((a) => {
        this.resource.push(new Resource(a));
      });
    }
    return res;
  }
}
