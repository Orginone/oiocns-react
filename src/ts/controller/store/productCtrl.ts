import { ProductModel } from '@/ts/base/model';
import provider from '@/ts/core/provider';

class productContCtrl {
  /**
   * @description: 创建应用
   * @return {*}
   */
  public async createProduct(
    values: Omit<ProductModel, 'id' | 'thingId' | 'typeName' | 'belongId'>,
  ) {
    return await provider!.getPerson!.createProduct(values);
  }
}

const productCtrl = new productContCtrl();

export { productCtrl };
