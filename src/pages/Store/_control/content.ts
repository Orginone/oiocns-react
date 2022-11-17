// import storeClassify from './classify';
/**
 * @desc: 仓库 展示区 控件
 * @return {*}
 */

class StoreContent {
  currentMenu = 'Public'; //当前展示 菜单
  // curMarket = storeClassify._curMarket;
  storeClassify: any;
  constructor() {
    this.getMarket();
  }

  /**
   * async getMarket
   */
  public async getMarket() {
    this.storeClassify = await import('./classify');
    console.log('storeClassify', this.storeClassify.currentMenu);
  }
  /**
   * changeMenu
   */
  public changeMenu(menuItem: any) {
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
