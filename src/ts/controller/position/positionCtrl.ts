import { kernel } from '@/ts/base';
import { MY_POSITION_LIST } from '@/constants/const';
import { message } from 'antd';
import { Emitter } from '@/ts/base/common';
import userCtrl from '../setting/userCtrl';

export enum PostitonCallBackTypes {
  'ApplyData' = 'ApplyData',
}

class PostitonController extends Emitter {
  private positionList: any[];

  constructor() {
    super();
    this.positionList = [];
    // emitter.subscribePart([DomainTypes.Company, DomainTypes.User], async () => {
    //   if (userCtrl.IsCompanySpace) {
    //     this._target = userCtrl.Company;
    //   } else {
    //     this._target = userCtrl.User;
    //   }
    //   this._curMarket = (await this._target.getPublicMarket(false))[0];
    //   await this._target.getJoinMarkets();
    //   this.changCallback();
    // });
    /* 获取 历史缓存的 购物车商品列表 */
    kernel.anystore.subscribed(
      MY_POSITION_LIST + userCtrl.Space.target.id.toString(),
      'company',
      (positionList: any) => {
        console.log('订阅数据推送 岗位列表===>', positionList.data);
        const { data = [] } = positionList;
        this.positionList = data || [];
        this.changCallbackPart(PostitonCallBackTypes.ApplyData);
      },
    );
  }

  /**
   * 获取岗位列表
   */
  public get positionListData() {
    return this.positionList;
  }

  /**
   * @description: 添加岗位
   * @param {any} data
   * @return {*}
   */
  public joinApply = (data: any): any => {
    if (this.positionList.length === 0) {
      this.positionList.push(data);
      console.log('数据进入', data);
      message.success('添加岗位成功');
    } else if (this.positionList.some((item) => item.code === data?.code)) {
      message.warning('您已添加该岗位，请勿重复添加');
      return;
    } else {
      this.positionList.push(data);
      message.success('添加岗位成功');
    }
    this.cacheJoinOrDelePosition(this.positionList);
  };
  /**
   * @description: 更新岗位
   * @param {any} data
   * @return {*}
   */
  public updatePosttion = (data: any): any => {
    console.log('数据进入', data);
    const list = this.positionList.filter((obj) => obj.code != data.code);
    this.positionList = list;
    console.log('过滤后', this.positionList);
    this.positionList.push(data);
    this.cacheJoinOrDelePosition(this.positionList);
  };
  // /**
  //  * @description: 删除购物车内的商品
  //  * @param {any} data
  //  * @return {*}
  //  */
  // public deleApply = async (data: any) => {
  //   if (this._shopinglist.length > 0) {
  //     let arrs = this._shopinglist.filter(
  //       (item) => !data.some((ele: any) => ele.id === item.id),
  //     );
  //     this._shopinglist = arrs;
  //     this.cacheJoinOrDeleShopingCar(this._shopinglist);
  //   }
  // };

  /**
   * 缓存 加入/删除购物车的商品
   * @param message 新消息，无则为空
   */
  public cacheJoinOrDelePosition = (data: any): void => {
    this.changCallbackPart(PostitonCallBackTypes.ApplyData);
    console.log('进行存储', data);
    console.log(
      '操作结果',
      kernel.anystore.set(
        MY_POSITION_LIST + userCtrl.Space.target.id.toString(),
        {
          operation: 'replaceAll',
          data: {
            data: data || [],
          },
        },
        'company',
      ),
    );
  };
}
export default new PostitonController();
