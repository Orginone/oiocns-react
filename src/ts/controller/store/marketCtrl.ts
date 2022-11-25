import Provider from '../../core/provider';
class MarketController {
  /**
   * @description: 默认个人空间
   * @return {*}
   */
  curTarget = Provider.getPerson;

  /**
   * @description: 当前用户
   * @return {*}
   */
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

  /**
   * @description: 创建商店
   * @return {*}
   */
  public async creatMarkrt({
    name,
    code,
    remark,
    samrId,
    ispublic,
  }: {
    name: string;
    code: string;
    remark: string;
    samrId: string;
    ispublic: boolean;
  }) {
    await this.curTarget?.createMarket({ name, code, remark, samrId, ispublic });
  }

  /**
   * @description: 删除商店
   * @return {*}
   */
  public async deleteMarket(market: any) {
    await this.curTarget?.deleteMarket(market);
  }

  /**
   * @description: 退出商店
   * @param {string} id
   * @return {*}
   */
  public async quitMarket(id: string) {
    await this.curTarget?.quitMarket(id);
  }

  public async getJoinMarkets() {
    await this.curTarget?.getJoinMarkets();
  }
}

const marketCtrl = new MarketController();
export { marketCtrl };
