import { XMarket, XMerchandise } from '@/ts/base/schema';
import AppStore from '@/ts/core/market/appstore';
import StoreSiderbar from './sidebar';
import appContent from './appContent';
import { model } from '@/ts/base';
/**
 * @desc: 仓库 展示区 控件
 * @return {*}
 */

class StoreContent {
  private _currentMenu = 'Public'; //当前展示 菜单
  public public_store: XMerchandise[] = [];
  // curMarket = storeClassify._curMarket;
  public _curMarket: AppStore | undefined = new AppStore({
    id: '358266491960954880',
  } as XMarket); // 当前商店信息
  // 存储 数据
  // 最近使用应用
  // 我的应用列表
  // 商品列表
  constructor() {
    this.getShowData();
  }

  /**
   * async getMarket
   */
  public async getShowData() {
    // this.storeClassify = await import('./classify');

    console.log('shuju1', '对对对');
  }
  /**
   * 切换侧边栏 触发 展示数据变化
   */
  public changeMenu(menuItem: any) {
    console.log('changeMenu', menuItem);

    // 点击重复 则判定为无效
    if (this._currentMenu === menuItem.title) {
      return;
    }
    this._currentMenu = menuItem.title;
    this.getMainData();
  }
  /**
   * @desc: 获取主体展示数据 --根据currentMenu 判断请求 展示内容
   * @return {*}
   */
  public async getMainData() {
    const res = await this._curMarket!.getMerchandise({
      offset: 0,
      limit: 10,
      filter: '',
    });
    const { success, data = { result: [] } } = res;
    if (success) {
      const { result = [] } = data;
      this.public_store = [...result];
    }
  }
  /**
   * @desc 创建应用
   * @params
   */
  public createProduct = async (data: any) => appContent.createProduct(data);
}
const storeContent = new StoreContent();

export default storeContent;
