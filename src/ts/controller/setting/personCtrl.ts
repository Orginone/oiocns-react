/* eslint-disable no-unused-vars */
import Types from '@/module/typings';
import { XTarget } from '@/ts/base/schema';
import UserdataService from '@/ts/core/target/user';
import BaseController from '../baseCtrl';
import { TargetType } from '@/ts/core/enum';
import { model } from '@/ts/base';
import Provider from '@/ts/core/provider';

/**
 * 控制器
 * import PersonController from '@/ts/controller/setting/personCtrl';
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
    const datas: Types.PageData<XTarget> = await this.userDataService.searchMyCompany(
      page,
    );
    callback(datas);
  }

  /**
   * 获取用户已加入的单位组织
   */
  public async getJoinedCompanys(callback: any) {
    const datas = await Provider.getPerson!.getJoinedCompanys();
    callback(datas);
  }

  /**
   * 获取集团下的单位
   * @returns 单位、公司列表
   */
  public getGroupCompanies() {}

  /**
   * 申请加入单位
   * @param id 单位ID
   * @returns
   */
  public async applyJoinCompany(id: string): Promise<model.ResultType<any>> {
    const result = await this.userDataService.applyJoinMyCompany(id, TargetType.Company);
    return result;
  }
}
