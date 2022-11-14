// 市场业务
import { CertificateType } from '../../../typings/Certificate';
// import { IdPage, Page } from '../typings';
import API from '../../services';

import CommonClass from '../commonClass/BaseServiceClass';
// public 是默认可见性，所以，'可以直接省略'
// protected: 表示'受保护的',仅对其声明所在类和子类中 (非实例对象) 可见
// private: 表示'私有的,只在当前类中可见'，对实例对象以及子类也是不可见的
// readonly： 表示'只读',用来防止在构造函数之外对属性进行赋值
// static 静态数据

// export interface CertificateServiceType extends CommonClassType<MarketTypes.ProductType> {
//   PUBLIC_STORE: CertificateType.; //共享仓库信息,用于获取共享仓库应用列表
// }
export default class Certificate extends CommonClass {
  public PUBLIC_STORE: CertificateType.cerManageType = {} as CertificateType.cerManageType; //共享仓库信息
  /**
   * @desc: 获取共享仓库信息
   * @return {*}
   */
  public async getPublicStore() {
    if (this.PUBLIC_STORE?.id) {
      return;
    }
    const { success, data } = await API.market.getSoftShareInfo();
    if (success) {
      this.PUBLIC_STORE = data;
    }
  }
}
