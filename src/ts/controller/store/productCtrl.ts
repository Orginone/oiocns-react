import { ProductModel } from '@/ts/base/model';
import userCtrl from '../setting/userCtrl';

class productContCtrl {
  /**
   * @description: 创建应用
   * @return {*}
   */
  public async createProduct(
    values: Omit<ProductModel, 'id' | 'thingId' | 'typeName' | 'belongId'>,
  ) {
    return await userCtrl.User.createProduct({ ...values });
  }

  /**
   * @description: 移除应用
   * @param {string} id
   * @return {*}
   */
  public async deleteProduct(id: string) {
    return await userCtrl.User.deleteProduct(id);
  }
}

const productCtrl = new productContCtrl();

export { productCtrl };
