import { XMarket } from '@/ts/base/schema';
import AppStore from '@/ts/core/market/appstore';
import Product from '@/ts/core/market/product';
import { productCtrl } from './productCtrl';
import Provider from '@/ts/core/provider';
import { myColumns, marketColumns } from './config';
/**
 * @desc: 仓库 展示区 控件
 * @return {*}
 */

class StoreContent {
  private _currentMenu = 'Public'; //当前展示 菜单
  // public public_store: XMerchandise[] = [];
  public curPageType: 'app' | 'market' = 'market'; // 判断当前所处页面类型,调用不同请求
  // public myAppList: XProduct[] = [];
  public Person = Provider.getPerson; // 获取当前 个人实例
  public marketTableCallBack!: (data: any) => void; //触发页面渲染 callback
  // curMarket = storeClassify._curMarket;
  public _curMarket: AppStore | undefined = new AppStore({
    id: '358266491960954880',
  } as XMarket); //TODO: 当前商店信息

  public _curProduct: Product | null = null;
  //TODO: 获取 最近使用应用
  constructor() {}

  /**
   * @desc: 切换侧边栏 触发 展示数据变化
   * @param {any} menuItem
   * @return {*}
   */
  public async changeMenu(menuItem: any) {
    console.log('changeMenu', menuItem, this._currentMenu, menuItem.title);
    this._curMarket = menuItem.node ?? new AppStore(menuItem); // 当前商店信息
    // 点击重复 则判定为无效
    if (this._currentMenu === menuItem.title) {
      return;
    }
    this._currentMenu = menuItem.title;
    this.curPageType = (await import('./sidebar')).default.curPageType;
    console.log('当前页面类型', this.curPageType);

    this.getStoreProduct(this.curPageType);
  }

  /**
   * @desc: 获取表格头部展示数据
   * @return {*}
   */
  public getColumns(pageKey?: string) {
    switch (pageKey) {
      case 'appInfo':
      case 'myApp':
        return myColumns;
      case 'market':
        return marketColumns;
      default:
        return [];
    }
    //TODO:待完善
  }

  /** 获取我的应用列表/商店-商品列表
   * @desc: 获取主体展示数据 --根据currentMenu 判断请求 展示内容
   * @return {*}
   */
  public async getStoreProduct(type = 'app', params?: any) {
    let Fun!: Function;
    if (type === 'app') {
      Fun = Provider.getPerson!.getOwnProducts;
      params = {};
    } else {
      Fun = this._curMarket!.getMerchandise;
      params = { offset: 0, limit: 10, filter: '', ...params };
    }

    const res = await Fun(params);
    if (Array.isArray(res)) {
      this.marketTableCallBack([...res]);
      return;
    }
    console.log('获取数据', res);
    const { success, data } = res;

    if (success) {
      const { result = [] } = data;
      this.marketTableCallBack([...result]);
    }
  }

  /**
   * @desc 创建应用
   * @params
   */
  public createProduct = async (data: any) => productCtrl.createProduct(data);

  /**
   * @desc: 判断当前操作对象是否为已选产品 不是则 修改选中
   * @param {Product} item
   */
  public selectedProduct(item: Product) {
    // 判断当前操作对象是否为已选产品 不是则 修改选中
    // item.prod.id !== this._curProduct?.prod.id &&
    console.log('修改选中');

    this._curProduct = item;
  }
}
const storeContent = new StoreContent();

export default storeContent;
