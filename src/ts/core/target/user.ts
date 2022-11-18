/* eslint-disable no-unused-vars */
import { TargetType } from '../enum';
import Company from '../target/company';
import { kernel, schema, model, common } from '../../base';
import University from '../target/university';
import Hospital from '../target/hospital';

import Provider from '../provider';
import Types from '../../../module/typings';
import { XTarget } from '../../base/schema';
import BaseService from './base';

/**
 * 我的设置里面的接口
 * const person: Person = Provider.getPerson;
 * import Provider from '@/ts/core/provider';
   import Person from '@/ts/core/target/person';

   import Userdata from '@/ts/core/target/user';
   Userdata.getInstance().searchCompany();
 */
export default class userdataservice extends BaseService {
  // 单例
  private static _instance: userdataservice;
  /**单例模式 */
  public static getInstance() {
    if (this._instance == null) {
      this._instance = new userdataservice(Provider.getPerson.target);
    }
    return this._instance;
  }

  /**构造方法 */
  constructor(target: schema.XTarget) {
    super(target);
  }

  /** 支持的单位类型数组 */
  public get companyTypes(): TargetType[] {
    return [
      TargetType.Company,
      TargetType.University,
      TargetType.Group,
      TargetType.Hospital,
    ];
  }

  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  public async getJoinedGroups(companyId: string | number): Promise<Company[]> {
    let res = await this.getjoined({
      // spaceId: companyId,
      joinTypeNames: this.companyTypes,
      typeName: TargetType.Group,
    });
    console.log('222222222222', res);
    let _joinedCompanys: Company[] = [];
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((item) => {
        switch (item.typeName) {
          case TargetType.University:
            _joinedCompanys.push(new University(item));
            break;
          case TargetType.Hospital:
            _joinedCompanys.push(new Hospital(item));
            break;
          default:
            _joinedCompanys.push(new Company(item));
            break;
        }
      });
    }
    return _joinedCompanys;
  }

  /**
   * 设立单位
   * @param name 单位名称
   * @param code 单位信用代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 单位简介
   * @param type 单位类型,默认'单位', 可选:'大学','医院','单位'
   * @returns 是否成功
   */
  public async createCompany(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    type: TargetType = TargetType.Company,
  ): Promise<boolean> {
    if (!this.companyTypes.includes(type)) {
      return false;
    }
    let data: any = {
      name,
      code,
      teamName,
      teamCode,
      typeName: type,
      teamRemark: remark,
    };
    const res = await this._create(data);
    console.log(res);

    if (res.success) {
      let company;
      switch (type) {
        case TargetType.University:
          company = new University(res.data);
          break;
        case TargetType.Hospital:
          company = new Hospital(res.data);
          break;
        default:
          company = new Company(res.data);
          break;
      }
      //
      return company.pullPersons(['381104941936283648', '378243413037944832']);
    }

    return false;
  }
  /**
   * 搜索单位(公司) 数组里面还有target
   * @returns 根据编码搜索单位, 单位、公司表格需要的数据格式
   */
  public async searchCompany(page: Types.Page): Promise<Types.PageData<XTarget>> {
    // 入参
    let paramData: any = {};
    paramData.name = page.filter;
    paramData.typeName = TargetType.Group;
    paramData.page = {
      offset: 0,
      filter: page.filter,
      limit: common.Constants.MAX_UINT_8,
    };
    // 结果集
    let pageData: any = {};
    try {
      let res = await kernel.searchTargetByName(paramData);
      console.log('333333333333333', res);

      if (res.success && res.data && res.data.result) {
        // 存放返回数组
        let list: XTarget[] = [];
        res.data.result.map((item) => {
          switch (item.typeName) {
            case TargetType.University:
              list.push(new University(item).target);
              break;
            case TargetType.Hospital:
              list.push(new Hospital(item).target);
              break;
            default:
              list.push(new Company(item).target);
              break;
          }
        });
        pageData.success = true;
        pageData.data = list;
      } else {
        pageData.success = false;
        pageData.msg = res.msg;
      }
    } catch (error) {
      pageData.success = false;
      pageData.msg = '接口调用错误';
    }
    return pageData;
  }

  /**加入公司 */
  public async applyJoinCompany(
    targetId: string,
    applyType: TargetType,
  ): Promise<boolean> {
    const res = await kernel.applyJoinTeam({
      id: targetId,
      targetId: this.target.id,
      teamType: applyType,
      targetType: TargetType.Person,
    });
    return res.success;
  }

  /**取消加入组织或个人 */
  public async cancelJoinCompany(
    targetId: string,
    belongId: string,
    applyType: TargetType,
  ): Promise<boolean> {
    const res = await kernel.cancelJoinTeam({
      id: targetId,
      typeName: applyType,
      belongId: belongId,
    });
    return res.success;
  }

  // querySelfProduct 我的产品，上架后才是商品

  /**
   * 创建对象
   * @param data 创建参数
   * @returns 创建结果
   */
  private async _create(data: any): Promise<model.ResultType<any>> {
    data.belongId = this.target.id;
    return await kernel.createTarget(data);
  }
}
