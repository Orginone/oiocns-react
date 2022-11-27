import { Market } from '@/ts/core/market';
import Provider from '../../core/provider';
import BaseController from '../baseCtrl';
import { settingCtrl } from '../setting/settingCtrl';
class MarketController extends BaseController {
  private _curMarket: Market | undefined;
  private _markets: Market[] | undefined;
  constructor() {
    super();
    settingCtrl.OnWorkSpaceChanged(async () => {
      await this._initialization();
    });
  }

  /** 初始化 */
  private async _initialization(): Promise<void> {
    let workSpace = settingCtrl.getCurWorkSpace;
    if (!workSpace?.isUserSpace) {
      this._curMarket = undefined;
      this._markets = await workSpace?.target?.getJoinMarkets();
    }
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
  public async creatMarkrt(data: {
    name: string;
    code: string;
    remark: string;
    samrId: string;
    ispublic: boolean;
  }) {
    const res = await settingCtrl.getCurWorkSpace?.target?.createMarket(
      data.name,
      data.code,
      data.remark,
      data.samrId,
      data.ispublic,
    );
    if (res?.success) {
      this._markets?.push(new Market(res.data));
    }
    this.changCallback();
  }

  /**
   * @description: 删除商店
   * @return {*}
   */
  public async deleteMarket(id: string) {
    const index = this._markets?.findIndex((a) => {
      return a.market.id == id;
    });
    if (index != undefined && index >= 0) {
      const res = await settingCtrl.getCurWorkSpace?.target?.deleteMarket(market);
      if (res?.success) {
        this._markets?.splice(index, 1);
      }
      this.changCallback();
    }
  }

  /**
   * @description: 退出商店
   * @param {string} id
   * @return {*}
   */
  public async quitMarket(id: string) {
    await settingCtrl.getCurWorkSpace?.target?.quitMarket(id);
  }

  public async getJoinMarkets() {
    await settingCtrl.getCurWorkSpace?.target?.getJoinMarkets();
  }
}

export const marketCtrl = new MarketController();
