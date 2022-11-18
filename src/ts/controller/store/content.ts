import StoreSiderbar from './sidebar';
/**
 * @desc: 仓库 展示区 控件
 * @return {*}
 */

class StoreContent {
  currentMenu = 'Public'; //当前展示 菜单
  curObject = {};
  // curMarket = storeClassify._curMarket;
  storeClassify: any;
  // 存储 数据
  // 最近使用应用
  // 我的应用列表
  // 商品列表
  constructor() {
    setTimeout(() => {
      console.log('內容區域', StoreSiderbar);
    }, 10);
  }

  /**
   * async getMarket
   */
  public async getMarket() {
    // this.storeClassify = await import('./classify');
  }
  /**
   * 切换侧边栏 触发 展示数据变化
   */
  public changeMenu(menuItem: any) {
    console.log('内容1u', menuItem);

    // 点击重复 则判定为无效
    if (this.currentMenu === menuItem.title) {
      return;
    }
    this.currentMenu = menuItem.title;
    this.getMainData();
  }
  /**
   * @desc: 获取主体展示数据 --根据currentMenu 判断请求 展示内容
   * @return {*}
   */
  public getMainData() {}
}
const storeContent = new StoreContent();

export default storeContent;
