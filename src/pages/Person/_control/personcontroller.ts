/* eslint-disable no-unused-vars */
import Types from '@/module/typings';
import { XTarget } from '@/ts/base/schema';
import UserdataService from '@/ts/core/target/user';
import BaseController from './basecontroller';
import { TargetType } from '@/ts/core/enum';
import { model } from '@/ts/base';

/**
 * 控制器
 * import PersonController from '@/pages/Person/_control/personcontroller';
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

    // 调试代码，要删除 @modify oyj
    this.myTest();
  }

  // 接口调试
  public async myTest(): Promise<boolean> {
    this.getJoinedCompanys((data: any) => {});

    let companys = await this.userDataService.getJoinedTargets(
      this.getPerson.target.id,
      TargetType.Person,
      [TargetType.Company],
    );

    //let aa1 = await this.getPerson.queryMyProduct();

    //let aa2 = await this.getPerson.queryMySpaceProduct();

    // const companys = await Userdata.getInstance().searchCompany({
    //   page: 1,
    //   pageSize: 100,
    //   filter: '91330304254498785G'
    // });
    // console.log("===获取到的内核数据2！ ", companys);

    return true;
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
    const datas = await this.getPerson.getJoinedCompanys();
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
