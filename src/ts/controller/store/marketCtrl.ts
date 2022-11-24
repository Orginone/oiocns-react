import Provider from '../../core/provider';
class MarketController {
  /** 当前用户 */
  public get userId() {
    return Provider.userId;
  }
  /**
   * 是否个人空间
   * @returns
   */
  public get isUserSpace() {
    return Provider.isUserSpace;
  }
  // 购买
  public buyApp() {
    Provider.getPerson?.buyApp();
  }
  //加购物车
  public addCart() {
    Provider.getPerson?.addCart();
  }
  //获取订单
  public getOrderList() {
    Provider.getPerson?.getOrderList();
  }
  //取消订单
  public cancleOrder() {
    Provider.getPerson?.cancleOrder();
  }
}

const marketCtrl = new MarketController();
export { marketCtrl };
