import { model, schema } from '../../base';
import { TargetType } from '../enum';
import { IAuthority } from './authority/iauthority';
import { Market, BaseProduct } from '../market';
import Company from './company';
import Cohort from './cohort';
import Department from './department';
import Working from './working';
import Group from './group';

export interface ITarget {
  /** 当前组织/个人实体对象 */
  target: schema.XTarget;
  /** 组织职权树 */
  authorityTree: IAuthority | undefined;
  /** 可以创建的子类类型 */
  subTypes: TargetType[];
  /** 可以通过拉取加入的子类类型 */
  pullTypes: TargetType[];
  /** 子组织集合 */
  subTargets: ITarget[];
  /** 父组织集合 */
  joinTargets: ITarget[];
  /** 可以创建的组织类型 */
  createTargetType: TargetType[];
  /** 可以加入的组织类型 */
  joinTargetType: TargetType[];
  /** 可以查询的组织类型 */
  searchTargetType: TargetType[];
  /**
   * 更新组织、对象
   * @param name 名称
   * @param code 编号
   * @param typeName 类型
   * @param teamName team名称
   * @param teamCode team编号
   * @param teamRemark team备注
   * @returns
   */
  updateTarget(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    teamRemark: string,
  ): Promise<model.ResultType<schema.XTarget>>;
  /**
   * 创建子组织
   * @param name 名称
   * @param code 编号
   * @param teamName 团队名称
   * @param teamCode 团队编号
   * @param remark 简介
   * @returns
   */
  createSubTarget(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    targetType: TargetType,
  ): Promise<model.ResultType<any>>;
  /**
   * 删除子组织
   * @param id 子组织Id
   * @returns
   */
  deleteSubTarget(id: string): Promise<model.ResultType<any>>;
  /**
   * 获取子组织/个人
   * @returns
   */
  getSubTargets(): Promise<ITarget[]>;
  /**
   * 根据名称查询组织/个人
   * @param name 名称
   * @param TypeName 类型
   * @returns
   */
  searchTargetByName(name: string, typeName: TargetType): Promise<model.ResultType<any>>;
  /**
   * 获取加入的组织
   * @param data 请求参数
   * @returns 请求结果
   */
  getjoinedTargets(): Promise<ITarget[]>;
  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  selectAuthorityTree(): Promise<IAuthority | undefined>;
  /**
   * 拉成员加入组织
   * @param ids
   * @param typeName
   * @returns
   */
  pullMember(targets: schema.XTarget[]): Promise<model.ResultType<any>>;
  /**
   * 移除群组成员
   * @param ids 成员Id集合
   * @param typeName 成员类型
   * @returns
   */
  removeMember(ids: string[], typeName: TargetType): Promise<model.ResultType<any>>;
}

/** 市场相关操作方法 */
export interface IMTarget {
  /**
   * 根据编号查询市场
   * @param name 编号、名称
   * @returns
   */
  getMarketByCode(name: string): Promise<model.ResultType<schema.XMarketArray>>;
  /**
   * 查询商店列表
   * @returns 商店列表
   */
  getJoinMarkets(): Promise<Market[]>;
  /**
   * 查询开放市场
   * @returns 市场
   */
  getPublicMarket(): Promise<Market[]>;
  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  getOwnProducts(): Promise<BaseProduct[]>;
  /**
   * 查询购物车列表
   */
  getStaging(): Promise<schema.XStaging[]>;
  /**
   * 查询购买订单
   */
  getBuyOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XOrderArray>>;
  /**
   * 查询售卖订单
   */
  getSellOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XOrderDetailArray>>;
  /**
   * 查询加入市场的审批
   * @returns
   */
  queryJoinMarketApproval(): Promise<model.ResultType<schema.XMarketRelationArray>>;
  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
  getJoinMarketApplys(): Promise<schema.XMarketRelation[]>;
  /**
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  applyJoinMarket(id: string): Promise<model.ResultType<any>>;
  /**
   * 删除发起的加入市场申请
   * @param id 申请Id
   */
  cancelJoinMarketApply(id: string): Promise<model.ResultType<any>>;
  /**
   * 查询应用上架的审批
   * @returns
   */
  queryPublicApproval(): Promise<model.ResultType<schema.XMerchandiseArray>>;
  /**
   * 审批加入市场申请
   * @param id 申请id
   * @param status 审批状态
   * @returns
   */
  approvalJoinMarketApply(id: string, status: number): Promise<model.ResultType<boolean>>;
  /**
   * 审批商品上架申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  approvalPublishApply(id: string, status: number): Promise<model.ResultType<any>>;
  /**
   * 创建市场
   * @param  {model.MarketModel} 市场基础信息
   * @returns
   */
  createMarket(
    // 名称
    name: string,
    // 编号
    code: string,
    // 备注
    remark: string,
    // 监管组织/个人
    samrId: string,
    // 产品类型名
    ispublic: boolean,
  ): Promise<model.ResultType<schema.XMarket>>;
  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  createProduct(
    // 名称
    name: string,
    // 编号
    code: string,
    // 备注
    remark: string,
    // 资源列
    resources: model.ResourceModel[] | undefined,
    // 元数据Id
    thingId: string,
    // 产品类型名
    typeName: string,
  ): Promise<model.ResultType<schema.XProduct>>;
  /**
   * 添加暂存区
   * @param id 商品Id
   */
  stagingMerchandise(id: string): Promise<model.ResultType<any>>;
  /**
   * 删除暂存区
   * @param id 暂存区Id
   */
  deleteStaging(id: string): Promise<model.ResultType<any>>;
  /**
   * 删除市场
   * @param id 市场Id
   * @returns
   */
  deleteMarket(id: string): Promise<model.ResultType<boolean>>;
  /**
   * 删除应用
   * @param id 应用Id
   * @returns
   */
  deleteProduct(id: string): Promise<model.ResultType<boolean>>;

  /**
   * 退出市场
   * @param id 退出的市场Id
   * @returns
   */
  quitMarket(id: string): Promise<model.ResultType<any>>;
}

/** 人员操作 */
export interface IPerson extends ITarget {
  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  getJoinedCohorts(): Promise<Cohort[]>;
  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  getJoinedCompanys(): Promise<Company[]>;
  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  createCohort(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<any>>;
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
  createCompany(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
    type: TargetType,
  ): Promise<model.ResultType<any>>;
  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort(id: string): Promise<model.ResultType<any>>;
  /**
   * 删除单位
   * @param id 单位Id
   * @returns
   */
  deleteCompany(id: string): Promise<model.ResultType<any>>;
  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort(id: string): Promise<model.ResultType<any>>;
  /**
   * 申请加入单位
   * @param id 目标Id
   * @returns
   */
  applyJoinCompany(id: string, typeName: TargetType): Promise<model.ResultType<any>>;
  /**
   * 退出群组
   * @param id 群组Id
   */
  quitCohorts(id: string): Promise<model.ResultType<any>>;
  /**
   * 退出单位
   * @param id 单位Id
   */
  quitCompany(id: string): Promise<model.ResultType<any>>;
  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  getFriends(): Promise<ITarget[]>;
  /**
   * 申请添加好友
   * @param target 目标
   * @returns
   */
  applyFriend(target: schema.XTarget): Promise<model.ResultType<any>>;
  /**
   * 移除好友
   * @param id 好友Id
   */
  removeFriend(ids: string[]): Promise<model.ResultType<any>>;
  /**
   * 审批我的好友申请
   * @param relation 申请
   * @param status 状态
   * @returns
   */
  approvalFriendApply(
    relation: schema.XRelation,
    status: number,
  ): Promise<model.ResultType<any>>;
  /**
   * 取消好友申请
   * @param id 好友Id
   * @returns
   */
  cancelJoinApply(id: string): Promise<model.ResultType<any>>;
}

export interface ICompany extends ITarget {
  /**
   * 创建集团
   * @param name 集团名称
   * @param code 集团代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 集团简介
   * @returns 是否成功
   */
  createGroup(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>>;
  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  createCohort(
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<any>>;
  /**
   * 删除集团
   * @param id 集团Id
   * @returns
   */
  deleteGroup(id: string): Promise<model.ResultType<any>>;
  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort(id: string): Promise<model.ResultType<any>>;
  /**
   * 退出群组
   * @param id 群组Id
   */
  quitCohorts(id: string): Promise<model.ResultType<any>>;
  /**
   *  退出集团
   * @param id 集团Id
   * @returns
   */
  quitGroup(id: string): Promise<model.ResultType<any>>;
  /**
   * 获取单位下的人员
   * @returns
   */
  getPersons(): Promise<ITarget[]>;
  /**
   * 获取单位下的部门（单位、部门）
   * @returns
   */
  getDepartments(): Promise<Department[]>;
  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns 返回好友列表
   */
  getWorkings(): Promise<Working[]>;
  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  getJoinedCohorts(): Promise<Cohort[]>;
  /**
   * @description: 查询我加入的集团
   * @return {*} 查询到的群组
   */
  getJoinedGroups(): Promise<Group[]>;
  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort(id: string): Promise<model.ResultType<any>>;
  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup(id: string): Promise<model.ResultType<any>>;
}

export interface IGroup extends ITarget {
  /**
   * 查询加入的集团
   * @returns
   */
  getJoinedGroups(): Promise<Group[]>;
  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup(id: string): Promise<model.ResultType<any>>;
  /**
   * 删除子集团
   * @param id 集团Id
   * @returns
   */
  deleteSubTarget(id: string): Promise<model.ResultType<any>>;
  /**
   * 获取集团下的人员（单位、集团）
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getPersons(): Promise<ITarget[]>;
  /**
   * 获取集团下的单位
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getCompanys(): Promise<ITarget[]>;
  /**
   * 获取集团下的集团
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getSubGroups(): Promise<Group[]>;
}
