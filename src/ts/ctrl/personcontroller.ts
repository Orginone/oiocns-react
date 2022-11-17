/* eslint-disable no-unused-vars */
import Types from '@/module/typings';
import { XTarget } from '@/ts/base/schema';
import UserdataService from '@/ts/core/service/userdataservice';
import BaseController from './basecontroller';

/**
 * 控制器
 * import PersonController from '@/ts/ctrl/personcontroller';
   PersonController.getInstance().searchCompany();
 */
export default class personcontroller extends BaseController {
  // 单例
  private static _instance: personcontroller;
  /**单例模式 */
  public static getInstance() {
    if (this._instance == null) {
      this._instance = new personcontroller();
    }
    return this._instance;
  }

  /**用户数据service */
  private userDataService: UserdataService = UserdataService.getInstance();

  /**构造方法 */
  constructor() {
    super();
  }

  /**
   * 搜索单位(公司) 数组里面还有target
   * @returns 根据编码搜索单位, 单位、公司表格需要的数据格式
   */
  public async searchCompany(page: Types.Page, callback: any) {
    const datas: Types.PageData<XTarget> = await this.userDataService.searchCompany(page);
    callback(datas);
  }
}
