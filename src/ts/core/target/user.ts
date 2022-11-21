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
   querySelfProduct 我的产品，上架后才是商品
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
   * 获取加入的target
   * @return 加入的单位target
   */
  public async getJoinedTargets(
    companyId: string,
    typeName: TargetType,
  ): Promise<Company[]> {
    this.target.typeName = typeName;
    let res = await this.getjoined({
      spaceId: companyId,
      JoinTypeNames: this.companyTypes,
    });

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
    targetType: TargetType = TargetType.Company,
  ): Promise<Omit<model.ResultType<any>, 'data'>> {
    if (!this.companyTypes.includes(targetType)) {
      return {
        success: false,
        msg: '类型错误',
        code: -1,
      };
    }

    let data: any = {
      name,
      code,
      teamName,
      teamCode,
      typeName: targetType,
      teamRemark: remark,
    };

    const res = await this._create(data);
    // 创建公司 或 集团
    console.log('创建公司 或 集团===', res);

    if (res.success) {
      let company;
      switch (targetType) {
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

      // 建好公司后，操作拉人。如果是集团， 加入的是公司
      let targetTypeSend = TargetType.Person;
      if (targetType === TargetType.Group) {
        targetTypeSend = TargetType.Company;
      }
      return this.pullTargets([company.target.id], targetTypeSend);
    }

    return {
      success: false,
      msg: res.msg,
      code: -1,
    };
  }

  /**
   * 拉人进入单位, 拉入集团等的操作
   * @param personIds 人员id数组
   * @returns 是否成功
   */
  public async pullTargets(
    personIds: string[],
    targetType: TargetType,
  ): Promise<model.ResultType<any>> {
    return await this.pull({
      targetType: targetType,
      targetIds: personIds,
    });
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
      console.log('================', res);

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

  /**加入公司或集团等内容 */
  public async applyJoinCompany(
    targetId: string,
    teamType: TargetType,
  ): Promise<model.ResultType<any>> {
    const res = await kernel.applyJoinTeam({
      id: targetId,
      teamType: teamType,
      targetId: this.target.id,
      targetType: TargetType.Person,
    });
    return res;
  }

  /**取消加入组织或个人 */
  public async cancelJoinCompany(
    targetId: string,
    belongId: string,
    applyType: TargetType,
  ): Promise<model.ResultType<any>> {
    const res = await kernel.cancelJoinTeam({
      id: targetId,
      typeName: applyType,
      belongId: belongId,
    });
    return res;
  }

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
