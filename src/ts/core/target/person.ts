import { XTarget } from './../../base/schema';
import { TargetType } from '../enum';
import BaseTarget from './base';
import { model, schema, FaildResult, kernel, common } from '../../base';
import Cohort from './cohort';
import Company from './company';
import University from './university';
import Hospital from './hospital';
import AppStore from '../market/appstore';
import { validIsSocialCreditCode } from '@/utils/tools';
import { SpaceType } from '@/store/type';

export default class Person extends BaseTarget {
  private _friends: schema.XTarget[];
  private workSpace: SpaceType;
  private _joinedCompanys: Company[];
  private _joinedCohorts: Cohort[];
  private _joinedStores: AppStore[];
  private _ownProducts: any[];
  constructor(target: schema.XTarget) {
    super(target);
    this._friends = [];
    this._joinedCohorts = [];
    this._joinedCompanys = [];
    this._joinedStores = [];
    this.workSpace = { id: this.target.id, name: '个人空间' };
    this._ownProducts = [];
    //初始化时填入信息
    this.getCohort();
    this.getFriends();
  }

  protected override get createTargetType(): TargetType[] {
    return [
      TargetType.Group,
      TargetType.Company,
      TargetType.Hospital,
      TargetType.University,
      TargetType.Cohort,
    ];
  }

  protected override get joinTargetType(): TargetType[] {
    return [
      TargetType.Person,
      TargetType.Company,
      TargetType.Hospital,
      TargetType.University,
      TargetType.Cohort,
    ];
  }
  /** 支持的单位类型数组 */
  public get companyTypes(): TargetType[] {
    return [TargetType.Company, TargetType.University, TargetType.Hospital];
  }

  public get ChohortArray(): Cohort[] {
    return this._joinedCohorts;
  }
  /**
   * 获取群组列表
   * @param params
   * @returns
   */
  public async getCohort(): Promise<model.ResultType<any>> {
    const res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Cohort],
    });
    if (res.success && res.data != undefined && res.data.result != undefined) {
      this._joinedCohorts = [];
      if (res.data.result?.length) {
        for (var i = 0; i < res.data?.result.length; i++) {
          const cohort = new Cohort(res.data?.result[i]);
          this._joinedCohorts.push(cohort);
        }
      }
    }
    return res;
  }

  /** 支持的群组类型数组*/
  public get cohortTypes(): TargetType[] {
    return [TargetType.Cohort];
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

  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  public async createCohort(
    name: string,
    code: string,
    remark: string,
  ): Promise<boolean> {
    const res = await this.createTarget(
      name,
      code,
      TargetType.Cohort,
      name,
      code,
      remark,
    );
    if (res.success && res.data != undefined) {
      const cohort = new Cohort(res.data);
      this._joinedCohorts.push(cohort);
      return cohort.pullPersons([this.target.id]);
    }
    return false;
  }

  /**
   * 解散群组
   * @param targetId 群组id
   * @param belongId 群组归属id
   * @returns
   */
  public async deleteCohorts(
    targetId: string,
    belongId: string,
  ): Promise<model.ResultType<any>> {
    const params: model.IdReqModel = {
      id: targetId,
      typeName: TargetType.Cohort,
      belongId: belongId,
    };
    let res = await kernel.deleteTarget(params);
    if (res.success) {
      this._joinedCohorts.filter((obj) => (obj.target.id = targetId));
    }
    return res;
  }
  /**
   * 添加群组申请
   * @param id 群组id
   * @returns
   */
  public async applyJoinCohort(id: string): Promise<model.ResultType<any>> {
    const TypeName = TargetType.Cohort;
    const res = await this.applyJoin(id, TypeName);
    return res;
  }

  /**
   * 搜索群组
   * @param name 群组编号
   * @returns
   */
  public async searchCohorts(code: string): Promise<model.ResultType<any>> {
    const TypeName = TargetType.Cohort;
    const res = await this.search(code, TypeName);
    return res;
  }

  /**
   * 搜索目标(人)
   * @param name 名称
   * @returns
   */
  public async searchFriend(name: string): Promise<model.ResultType<any>> {
    const TypeName = TargetType.Person;
    const res = await this.search(name, TypeName);
    return res;
  }

  /**
   * 添加好友申请
   * @param id 好友id
   * @returns
   */
  public async applyJoinFriend(id: string): Promise<model.ResultType<any>> {
    const TypeName = TargetType.Person;
    const res = await this.applyJoin(id, TypeName);
    return res;
  }

  /**
   * 移除好友
   * @param id 好友Id
   */
  public async removeFriend(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      var index = this._friends.findIndex((friend) => {
        return friend.id == id;
      });
      if (index > 0) {
        delete this._friends[index];
      }
    }
    return res;
  }

  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  public async getFriends(): Promise<XTarget[]> {
    if (this._friends.length > 0) {
      return this._friends;
    }
    const res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: [TargetType.Person],
    });
    console.log('好友查询结果', res);
    if (res.success) {
      if (res.data != undefined && res.data.result != undefined) {
        this._friends = res.data.result;
      }
    }
    return this._friends;
  }

  /**
   * 设立单位
   * @param name 单位名称
   * @param code 单位信用代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 单位简介
   * @param type 单位类型,默认'单位',可选:'大学','医院','单位'
   * @returns 是否成功
   */
  public async createCompany(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    type: TargetType = TargetType.Company,
  ): Promise<model.ResultType<any>> {
    if (!this.companyTypes.includes(type)) {
      return FaildResult('您无法创建该类型单位!');
    }
    if (!validIsSocialCreditCode(code)) {
      return FaildResult('请填写正确的代码!');
    }
    const tres = await this.getTargetByName({
      name,
      typeName: type,
      page: { offset: 0, limit: 1, filter: code },
    });
    if (!tres.success) {
      return tres;
    }
    if (tres.data == null) {
      const res = await this.createTarget(name, code, type, teamName, teamCode, remark);
      if (res.success && res.data != undefined) {
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
        this._joinedCompanys.push(company);

        return company.pullPersons([this.target.id]);
      }
      return res;
    } else {
      return FaildResult('该单位已存在!');
    }
  }

  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  public async queryMyProduct(): Promise<model.ResultType<schema.XProductArray>> {
    // model.IDBelongReq
    let paramData: any = {};
    paramData.id = this.target.id;
    paramData.page = {
      offset: 0,
      filter: this.target.id,
      limit: common.Constants.MAX_UINT_8,
    };
    return await kernel.querySelfProduct(paramData);
  }

  // /**
  //  * 查询我的产品/应用
  //  * @param params
  //  * @returns
  //  */
  // public async queryMyProduct(): Promise<model.ResultType<schema.XProductArray>> {
  //   // model.IDBelongReq
  //   let paramData: any = {};
  //   paramData.id = this.target.id;
  //   paramData.page = {
  //     offset: 0,
  //     filter: this.target.id,
  //     limit: common.Constants.MAX_UINT_8,
  //   };
  //   return await kernel.querySelfProduct(paramData);
  // }

  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  public async getJoinedCohorts(): Promise<Cohort[]> {
    if (this._joinedCohorts.length > 0) {
      return this._joinedCohorts;
    }
    let res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: this.cohortTypes,
    });
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((item) => {
        switch (item.typeName) {
          case TargetType.Cohort:
            this._joinedCohorts.push(new Cohort(item));
            break;
        }
      });
    }
    return this._joinedCohorts;
  }

  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  public async getJoinedCompanys(): Promise<Company[]> {
    if (this._joinedCompanys.length > 0) {
      return this._joinedCompanys;
    }
    this._joinedCompanys = [];
    let res = await this.getjoined({
      spaceId: this.target.id,
      JoinTypeNames: this.companyTypes,
    });
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((item) => {
        switch (item.typeName) {
          case TargetType.University:
            this._joinedCompanys.push(new University(item));
            break;
          case TargetType.Hospital:
            this._joinedCompanys.push(new Hospital(item));
            break;
          default:
            this._joinedCompanys.push(new Company(item));
            break;
        }
      });
    }
    return this._joinedCompanys;
  }

  /**
   * 退出群组
   * @param id 群组Id
   */
  public async quitCohorts(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      var index = this._joinedCohorts.findIndex((cohort) => {
        return cohort.target.id == id;
      });
      if (index > 0) {
        delete this._joinedCohorts[index];
      }
    }
    return res;
  }

  /**
   * 退出单位
   * @param id 单位Id
   */
  public async quitCompany(id: string): Promise<model.ResultType<any>> {
    const res = await this.cancelJoinTeam(id);
    if (res.success) {
      var index = this._joinedCompanys.findIndex((cohort) => {
        return cohort.target.id == id;
      });
      if (index > 0) {
        delete this._joinedCompanys[index];
      }
    }
    return res;
  }

  /**
   * 获取工作空间
   * @returns 工作空间
   */
  public getWorkSpace(): SpaceType {
    return this.workSpace;
  }

  /**
   * 切换工作空间
   * @param workSpace
   */
  public setWorkSpace(workSpace: SpaceType) {
    this.workSpace = workSpace;
  }

  /**
   * 是否个人空间
   * @returns
   */
  public isUserSpace(): boolean {
    return this.workSpace.id == this.target.id;
  }

  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  public async createProduct(
    data: Omit<model.ProductModel, 'id' | 'thingId' | 'typeName' | 'belongId'>,
  ): Promise<model.ResultType<schema.XProduct>> {
    const belongId = this.target.id;
    const thingId = '';
    const typeName = 'webapp';
    const reslut = await kernel.createProduct({
      ...data,
      belongId,
      thingId,
      typeName,
      id: undefined,
    });
    console.log(`createProduct`, reslut);
    return reslut;
  }
}
