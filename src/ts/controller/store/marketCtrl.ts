import { IPerson, ICompany } from './../../core/target/itarget';
import { Market, BaseProduct } from '@/ts/core/market';
import BaseController from '../baseCtrl';
import { PageRequest } from '@/ts/base/model';
export class MarketController extends BaseController {
  /** 人员/单位 */
  private _target: IPerson | ICompany;
  /** 当前操作的商店 */
  private _curMarket: Market | undefined;
  /** 当前操作的应用 */
  private _curProd: BaseProduct | undefined;
  /** 可用应用 */
  private _usefulProds: BaseProduct[] | undefined;
  /**
   * @description: 搜索到的商店
   * @return {*}
   */
  public searchMarket: any;

  constructor(target: IPerson | ICompany) {
    super();
    this._target = target;
    this._usefulProds = [];
    this.searchMarket = [];
  }
  /** 获得所有市场 */
  public get getMarkets() {
    return this._target.getJoinMarkets();
  }
  /** 获取当前操作的市场 */
  public getCurrentMarket() {
    return this._curMarket;
  }
  /** 获取购物车 */
  public getStagings() {
    return this._target.getStaging();
  }
  /** 获得所拥有的应用 */
  public getOwnProduct() {
    return this._target.getOwnProducts();
  }
  /** 获取当前操作的应用 */
  public getCurrentProduct() {
    return this._curProd;
  }
  /** 切换市场 */
  public setCurrentMarket(market: Market) {
    this._curMarket = market;
    this.changCallback();
  }
  /** 切换应用 */
  public setCurrentProduct(prod: BaseProduct) {
    this._curProd = prod;
  }
  // 购买
  public buyApp() {}
  /**
   * 添加购物车
   * @param id 商品Id
   */
  public async addCart(id: string) {
    await this._target.stagingMerchandise(id);
    this.changCallback();
  }
  /**
   * 获取购买订单
   * @param status 订单状态
   * @param page 分页参数
   * @returns
   */
  public async getBuyOrders(status: number, page: PageRequest) {
    return await this._target.getBuyOrders(status, page);
  }
  /**
   * 获取售卖订单
   * @param status 订单状态
   * @param page 分页参数
   * @returns
   */
  public async getSellOrders(status: number, page: PageRequest) {
    return await this._target.getSellOrders(status, page);
  }

  /**
   * @description: 创建商店
   * @return {*}
   */
  public creatMarkrt = async (data: {
    name: string;
    code: string;
    remark: string;
    samrId: string;
    ispublic: boolean;
  }) => {
    await this._target.createMarket(
      data.name,
      data.code,
      data.remark,
      data.samrId,
      data.ispublic,
    );
    this.changCallback();
  };

  /**
   * @description: 删除商店
   * @return {*}
   */
  public deleteMarket = async (id: string) => {
    await this._target.deleteMarket(id);
    this.changCallback();
  };

  /**
   * @description: 退出商店
   * @param {string} id
   * @return {*}
   */
  public async quitMarket(id: string) {
    await this._target.quitMarket(id);
    this.changCallback();
  }

  /**
   * @description: 根据编号查询市场
   * @param {string} code
   * @return {*}
   */
  public async getMarketByCode(code: string) {
    const res = await this._target.getMarketByCode(code);
    if (res?.success && res?.data?.result != undefined) {
      this.searchMarket = res?.data?.result;
    }
    return this.searchMarket;
  }
}
