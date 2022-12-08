import { kernel } from '@/ts/base';
import { MY_POSITION_LIST } from '@/constants/const';
import { message } from 'antd';
import { Emitter } from '@/ts/base/common';
import userCtrl from '../setting/userCtrl';
import { DomainTypes, emitter } from '@/ts/core';

export enum PostitonCallBackTypes {
  'ApplyData' = 'ApplyData',
}

class PostitonController extends Emitter {
  private positionList: any[];

  constructor() {
    super();
    this.positionList = [];
    emitter.subscribePart(DomainTypes.Company, async () => {
      /* 获取 历史缓存的 岗位列表 */
      if (userCtrl.isCompanySpace) {
        kernel.anystore.subscribed(
          MY_POSITION_LIST + userCtrl.space.target.id.toString(),
          'company',
          (positionList: any) => {
            console.log('订阅数据推送 岗位列表===>', positionList);
            const { data = [] } = positionList;
            this.positionList = data || [];
            this.changCallbackPart(PostitonCallBackTypes.ApplyData);
          },
        );
      }
    });
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
      message.success('添加岗位成功');
    } else if (this.positionList.some((item) => item.code === data?.code)) {
      message.warning('您已添加该岗位，请勿重复添加');
      return;
    } else {
      this.positionList.push(data);
    }
    this.cacheJoinOrDelePosition(this.positionList);
  };
  /**
   * @description: 更新岗位
   * @param {any} data
   * @return {*}
   */
  public updatePosttion = (data: any): any => {
    const list = this.positionList.filter((obj) => obj.code != data.code);
    this.positionList = list;
    this.positionList.push(data);
    this.cacheJoinOrDelePosition(this.positionList);
    message.success('更新岗位成功');
  };
  /**
   * @description: 删除岗位
   * @param {any} data
   * @return {*}
   */
  public deletePosttion = (data: any): any => {
    const list = this.positionList.filter((obj) => obj.code != data.code);
    this.positionList = list;
    this.cacheJoinOrDelePosition(this.positionList);
    message.success('删除岗位成功');
  };

  /**
   * 缓存 添加岗位
   * @param message 新消息，无则为空
   */
  public cacheJoinOrDelePosition = (data: any): void => {
    this.changCallbackPart(PostitonCallBackTypes.ApplyData);
    kernel.anystore.set(
      MY_POSITION_LIST + userCtrl.space.target.id.toString(),
      {
        operation: 'replaceAll',
        data: {
          data: data || [],
        },
      },
      'company',
    );
  };
}
export default new PostitonController();
