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
    return await provider!.getPerson!.createProduct({ ...values });
  }

  /**
   * @description: 移除应用
   * @param {string} id
   * @return {*}
   */
  public async deleteProduct(id: string) {
    return await provider!.getPerson!.deleteProduct(id);
  }
}

const productCtrl = new productContCtrl();

export { productCtrl };
