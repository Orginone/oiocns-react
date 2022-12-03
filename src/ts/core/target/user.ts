/* eslint-disable no-unused-vars */
import { TargetType } from '../enum';
import Company from '../target/company';
import { kernel, schema, model, common } from '../../base';
import University from '../target/university';
import Hospital from '../target/hospital';

import { XTarget, XTargetArray } from '../../base/schema';
import BaseService from './base';
import userCtrl from '../../controller/setting/userCtrl';

/**
 * 我的设置里面的接口
 */
export default class userdataservice extends BaseService {
  // 单例
  private static _instance: userdataservice;
  /**单例模式 */
  public static getInstance() {
    if (this._instance == null) {
      this._instance = new userdataservice(userCtrl.User.target);
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
      TargetType.Department,
    ];
  }

  public async getBelongTargetById(
    companyId: string,
    typeName: TargetType,
    joinTypes: TargetType[],
  ): Promise<Company[]> {
    this.target.id = companyId;
    this.target.typeName = typeName;
    let res = await this.getjoinedTargets(joinTypes);

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
   * 获取加入的target
   * @return 加入的单位target
   */
  public async getJoinedTargets(
    companyId: string,
    typeName: TargetType,
    joinTypes: TargetType[],
  ): Promise<Company[]> {
    this.target.id = companyId;
    this.target.typeName = typeName;
    let res = await this.getjoinedTargets(joinTypes);

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

  public async getBelongTargets(
    companyId: string,
    typeName: TargetType,
  ): Promise<Company[]> {
    this.target.typeName = typeName;
    this.target.id = companyId;
    let res = await this.getSpaceSubDepts();

    let _joinedCompanys: Company[] = [];
    if (res.success && res.data && res.data.result) {
      res.data.result.forEach((item) => {
        _joinedCompanys.push(new Company(item));
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
  public async createMyCompany(
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
      return this.pullTargets(company.target.id, targetTypeSend);
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
    personId: string,
    targetType: TargetType,
  ): Promise<model.ResultType<any>> {
    const thisTarget: any = {
      id: personId,
      typeName: targetType,
    };
    return await this.pullMember([thisTarget]);
  }

  /**
   * 搜索单位(公司) 数组里面还有target
   * @returns 根据编码搜索单位, 单位、公司表格需要的数据格式
   */
  public async searchMyCompany(
    filter: string,
    typeName?: TargetType,
  ): Promise<schema.XTargetArray> {
    let paramData: any = {};
    paramData.name = filter;
    paramData.typeName = TargetType.Company;
    if (typeName) {
      paramData.typeName = typeName;
    }
    paramData.page = {
      offset: 0,
      filter: filter,
      limit: common.Constants.MAX_UINT_8,
    };

    // 结果集
    let pageData: schema.XTargetArray = {
      offset: 0,
      limit: 0,
      total: 0,
      result: [],
    };
    try {
      let res = await kernel.searchTargetByName(paramData);
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
        pageData.total = list.length;
        pageData.result = list;
      } else {
        pageData.total = 0;
      }
    } catch (error) {
      pageData.total = 0;
    }

    return pageData;
  }

  /**加入公司或集团等内容 */
  public async applyJoinMyCompany(
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
  public async cancelJoinMyCompany(
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

  protected async getSpaceSubDepts(): Promise<model.ResultType<schema.XTargetArray>> {
    return await kernel.queryBelongTargetById({
      id: this.target.id,
      typeNames: [TargetType.Company, TargetType.Department],
      subTypeNames: [TargetType.Department],
      page: {
        offset: 0,
        filter: '',
        limit: common.Constants.MAX_UINT_16,
      },
    });
  }

  /**
   * 创建部门
   * @param name 名称
   * @param code 编号
   * @param teamName 团队名称
   * @param teamCode 团队编号
   * @param remark 简介
   * @param parentId 上级组织Id 默认公司 公司、部门
   * @returns 成功返回的里面 包含一个target
   */
  public async createDepart(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    parentId: string,
    // 如果是第一层部门，就是公司，如果是第二层部门，就是部门
    isTop: boolean,
    belongId: string,
  ) {
    const targetType = TargetType.Department;
    // 创建部门
    const res = await kernel.createTarget({
      name,
      code,
      typeName: targetType,
      avatar: '',
      belongId,
      teamName,
      teamCode,
      teamRemark: remark,
    });
    if (res.success && isTop) {
      // 把部门加入单位
      const res2 = await kernel.pullAnyToTeam({
        id: parentId,
        teamTypes: [isTop ? TargetType.Company : TargetType.Department],
        targetIds: [res.data?.id],
        targetType: targetType,
      });
      if (!res2.success) {
        return res2;
      }
    }
    return res;
  }

  /**
   * 从部门移除
   * @param id 好友Id
   */
  removeFromTeam = async (
    personId: string,
    ids: string[],
    teamTypes: TargetType,
  ): Promise<model.ResultType<any>> => {
    // 从组织机构移除
    const res = await kernel.removeAnyOfTeam({
      id: personId,
      teamTypes: [TargetType.Person],
      targetIds: ids,
      targetType: teamTypes,
    });
    // 退出公司

    return res;
  };
  // 查询部门的内容
  public async searchDeptment(departId: string): Promise<XTargetArray> {
    const res = await kernel.queryTargetById({ ids: [departId], page: undefined });
    if (res.success) {
      return res.data;
    } else {
      return {
        offset: 0,
        limit: 0,
        total: 0,
        result: undefined,
      };
    }
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
