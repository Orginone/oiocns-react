import { common } from '@/ts/base';
import Resource from './resource';
import IProduct from './iproduct';
import { CommonStatus } from '../enum';
import Merchandise from './merchandise';
import { kernel, model, schema } from '../../base';

export default class WebApp implements IProduct {
  prod: schema.XProduct;
  resource: Resource[];
  merchandises: Merchandise[];

  get id(): string {
    return this.prod.id;
  }

  constructor(prod: schema.XProduct) {
    this.prod = prod;
    this.merchandises = [];
    this.resource = [];
    prod.resource?.forEach((a) => {
      a.product = prod;
      this.resource?.push(new Resource(a));
    });
  }
  public async getMerchandises(reload: boolean = false): Promise<Merchandise[]> {
    if (!reload && this.merchandises.length > 0) {
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
    if (res.success && res.data.result) {
      this.merchandises = res.data.result.map((a) => {
        return new Merchandise(a);
      });
    }
    return this.merchandises;
  }
  public async createExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<boolean> {
    let rs = await kernel.createSourceExtend({
      sourceId: this.prod.id,
      sourceType: '产品',
      spaceId: this.prod.belongId,
      destIds,
      destType,
      teamId,
    });

    return rs.success;
  }
  public async deleteExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<boolean> {
    return (
      await kernel.deleteSourceExtend({
        sourceId: this.prod.id,
        sourceType: '产品',
        destIds,
        destType,
        spaceId: this.prod.belongId,
        teamId,
      })
    ).success;
  }
  public async queryExtend(
    destType: string,
    teamId: string = '0',
  ): Promise<model.IdNameArray> {
    const res = await kernel.queryExtendBySource({
      sourceId: this.prod.id,
      sourceType: '产品',
      spaceId: this.prod.belongId,
      destType,
      teamId,
    });
    return res.data;
  }
  public async publish(params: {
    caption: string;
    marketId: string;
    sellAuth: '所属权' | '使用权';
    information: string;
    price: number;
    days: string;
  }): Promise<boolean> {
    const res = await kernel.createMerchandise({
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
    return res.success;
  }
  public async unPublish(id: string): Promise<boolean> {
    const res = await kernel.deleteMerchandise({
      id,
      belongId: this.prod.belongId,
    });
    if (res.success) {
      this.merchandises = this.merchandises.filter((a) => {
        return a.merchandise.id != id;
      });
    }
    return res.success;
  }
  public async update(
    name: string,
    code: string,
    typeName: string,
    remark: string,
    photo: string,
    resources: model.ResourceModel[],
  ): Promise<boolean> {
    const res = await kernel.updateProduct({
      id: this.prod.id,
      name,
      code,
      typeName,
      remark,
      photo,
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
    return res.success;
  }
}
