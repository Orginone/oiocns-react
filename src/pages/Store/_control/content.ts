/**
 * @desc: 仓库 展示区 控件
 * @return {*}
 */
class StoreContent {
  currentMenu: ''; //当前展示 菜单
  // constructor(parameters) {}
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
