import { ProductModel } from './../../base/model';
import { MarketTypes } from 'typings/marketType';
export default class AppModule {
  info: MarketTypes.ProductType; //应用详情
  publishList: any[]; //已上架市场列表

  constructor(target: MarketTypes.ProductType) {
    super(target);
    this.info = [];
    this.publishList = [];
  }
  // 打开
  openApp() {
    console.log('打开');
  }
  // 获取详情
  getInfo() {
    console.log('获取详情');
  }
  // 管理
  manageApp() {
    console.log('管理');
  }
  // 上架
  putawayApp() {
    console.log('putawayApp');
  }
  // 下架
  soldOutApp() {
    console.log('soldOutApp');
  }
  //共享
  shareApp() {
    console.log('shareApp');
  }
  //分发
  giveOutApp() {
    console.log('giveOutApp');
  }
  // 购买
  buyApp() {
    console.log('buyApp');
  }
  //加购物车
  addCart() {
    console.log('addCart');
  }
  //获取订单
  getOrderList() {
    console.log('getOrderList');
  }
  //取消订单
  cancleOrder() {
    console.log('cancleOrder');
  }
}
