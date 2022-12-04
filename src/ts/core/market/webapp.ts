import IProduct from './iproduct';
import { XProduct } from '../../base/schema';
import { ResultType, IdNameArray, ResourceModel } from '../../base/model';
import imerchandise from './imerchandise';
import iresource from './iresource';

export default class webApp implements IProduct {
  constructor(prod: XProduct) {}
  prod: XProduct;
  merchandises: imerchandise[];
  resource: iresource[];
  getMerchandises(): Promise<imerchandise[]> {
    throw new Error('Method not implemented.');
  }
  createExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<ResultType<any>> {
    throw new Error('Method not implemented.');
  }
  deleteExtend(
    teamId: string,
    destIds: string[],
    destType: string,
  ): Promise<ResultType<any>> {
    throw new Error('Method not implemented.');
  }
  queryExtend(
    spaceId: string,
    destType: string,
    teamId?: string | undefined,
  ): Promise<ResultType<IdNameArray>> {
    throw new Error('Method not implemented.');
  }
  publish(params: {
    caption: string;
    marketId: string;
    sellAuth: '所属权' | '使用权';
    information: string;
    price: number;
    days: string;
  }): Promise<ResultType<any>> {
    throw new Error('Method not implemented.');
  }
  unPublish(merchandiseId: string): Promise<ResultType<any>> {
    throw new Error('Method not implemented.');
  }
  update(
    name: string,
    code: string,
    typeName: string,
    remark: string,
    resources: ResourceModel[],
  ): Promise<ResultType<any>> {
    throw new Error('Method not implemented.');
  }
}
