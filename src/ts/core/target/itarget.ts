import { model, schema } from '@/ts/base';
import { ResultType, TargetModel } from '@/ts/base/model';
import { TargetType } from '../enum';
import { Market } from '../market';
import IProduct from '../market/iproduct';
import { IAuthority } from './authority/iauthority';
import { IIdentity } from './authority/iidentity';

/** 空间类型数据 */
export type SpaceType = {
  /** 唯一标识 */
  id: string;
  /** 名称 */
  name: string;
  /** 类型 */
  typeName: TargetType;
  /** 图标 */
  icon?: string;
};

export interface ITarget {
  /** 实体对象 */
  target: schema.XTarget;
  /** 职权树 */
  authorityTree: IAuthority | undefined;
  /** 拥有的身份 */
  ownIdentitys: schema.XIdentity[];
  /** 组织的身份 */
  identitys: IIdentity[];
  /**
   * 获取职权树
   * @param reload 是否强制刷新
   */
  selectAuthorityTree(reload?: boolean): Promise<IAuthority | undefined>;
  /**
   * 判断是否拥有该身份
   * @param id 身份id
   */
  judgeHasIdentity(id: string): Promise<boolean>;
  /**
   * 获取身份
   * @return {IIdentity[]} 身份数组
   */
  getIdentitys(): Promise<IIdentity[]>;
  /**
   * 创建身份
   * @param {model.IdentityModel} params 参数
   */
  createIdentity(
    params: Omit<model.IdentityModel, 'id' | 'belongId'>,
  ): Promise<IIdentity | undefined>;
  /**
   * 删除身份
   * @param id 身份ID
   */
  deleteIdentity(id: string): Promise<boolean>;
}

/** 市场相关操作方法 */
export interface IMTarget {
  /** 我加入的市场 */
  joinedMarkets: Market[];
  /** 开放市场 */
  publicMarkets: Market[];
  /** 拥有的产品/应用 */
  ownProducts: IProduct[];
  /** 我发起的加入市场的申请 */
  joinMarketApplys: schema.XMarketRelation[];
  /** 可使用的应用 */
  usefulProduct: schema.XProduct[];
  /** 可使用的资源 */
  usefulResource: Map<string, schema.XResource[]>;
  /**
   * 根据编号查询市场
   * @param name 编号、名称
   * @returns
   */
  getMarketByCode(name: string): Promise<ResultType<schema.XMarketArray>>;
  /**
   * 查询商店列表
   * @param reload 是否强制刷新
   * @returns 商店列表
   */
  getJoinMarkets(reload?: boolean): Promise<Market[]>;
  /**
   * 查询开放市场
   * @param reload 是否强制刷新
   * @returns 市场
   */
  getPublicMarket(reload: boolean): Promise<Market[]>;
  /**
   * 查询我的产品/应用
   * @param params
   * @param reload 是否强制刷新
   * @returns
   */
  getOwnProducts(reload: boolean): Promise<IProduct[]>;
  /**
   * 查询购买订单
   */
  getBuyOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderArray>>;
  /**
   * 查询售卖订单
   */
  getSellOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderDetailArray>>;
  /**
   * 查询加入市场的审批
   * @returns
   */
  queryJoinMarketApproval(): Promise<ResultType<schema.XMarketRelationArray>>;
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
  applyJoinMarket(id: string): Promise<ResultType<any>>;
  /**
   * 删除发起的加入市场申请
   * @param id 申请Id
   */
  cancelJoinMarketApply(id: string): Promise<ResultType<any>>;
  /**
   * 查询应用上架的审批
   * @returns
   */
  queryPublicApproval(): Promise<ResultType<schema.XMerchandiseArray>>;
  /**
   * 审批加入市场申请
   * @param id 申请id
   * @param status 审批状态
   * @returns
   */
  approvalJoinMarketApply(id: string, status: number): Promise<ResultType<boolean>>;
  /**
   * 审批商品上架申请
   * @param id 申请ID
   * @param status 审批结果
   * @returns 是否成功
   */
  approvalPublishApply(id: string, status: number): Promise<ResultType<any>>;
  /**
   * 创建市场
   * @param  {model.MarketModel} 市场基础信息
   * @param { String } params.name
   * @param
   * @returns
   */
  createMarket({
    name,
    code,
    remark,
    samrId,
    ispublic,
  }: {
    // 名称
    name: string;
    // 编号
    code: string;
    // 备注
    remark: string;
    // 监管组织/个人
    samrId: string;
    // 产品类型名
    ispublic: boolean;
  }): Promise<ResultType<schema.XMarket>>;
  /**
   * 创建应用
   * @param  {model.ProductModel} 产品基础信息
   */
  createProduct({
    name,
    code,
    remark,
    resources,
    thingId,
    typeName,
  }: {
    // 名称
    name: string;
    // 编号
    code: string;
    // 备注
    remark: string;
    // 资源列
    resources: model.ResourceModel[] | undefined;
    // 元数据Id
    thingId?: string;
    // 产品类型名
    typeName: string;
  }): Promise<ResultType<schema.XProduct>>;
  /**
   * 删除市场
   * @param id 市场Id
   * @returns
   */
  deleteMarket(id: string): Promise<ResultType<boolean>>;
  /**
   * 删除应用
   * @param id 应用Id
   * @returns
   */
  deleteProduct(id: string): Promise<ResultType<boolean>>;
  /**
   * 退出市场
   * @param id 退出的市场Id
   * @returns
   */
  quitMarket(id: string): Promise<ResultType<any>>;
  /**
   * 查询可用的应用
   * @param reload 是否强制刷新
   */
  getUsefulProduct(reload: boolean): Promise<schema.XProduct[]>;
  /**
   * 获得可用资源
   * @param id 应用Id
   * @param reload 是否强制刷新
   */
  getUsefulResource(id: string, reload: boolean): Promise<schema.XResource[]>;
}
export interface IFlow {
  /** 流程定义 */
  defines: schema.XFlowDefine[];
  /** 流程绑定关系 */
  defineRelations: schema.XFlowRelation[];
  /**
   * 获取流程定义列表
   * @param reload 是否强制刷新
   */
  getDefines(reload: boolean): Promise<schema.XFlowDefine[]>;
  /**
   * 查询流程定义绑定项
   * @param reload 是否强制刷新
   */
  queryFlowRelation(reload: boolean): Promise<schema.XFlowRelation[]>;
  /**
   * 发布流程定义（包含创建、更新）
   * @param data
   */
  publishDefine(data: model.CreateDefineReq): Promise<ResultType<schema.XFlowDefine>>;
  /**
   * 删除流程定义
   * @param id 流程定义Id
   */
  deleteDefine(id: string): Promise<model.ResultType<boolean>>;
  /**
   * 发起流程实例
   * @param data 流程实例参数
   */
  createInstance(
    data: model.FlowInstanceModel,
  ): Promise<model.ResultType<schema.XFlowInstance>>;
  /**
   * 绑定应用业务与流程定义
   * @param params
   */
  bindingFlowRelation(
    params: model.FlowRelationModel,
  ): Promise<model.ResultType<schema.XFlowRelation>>;
  /**
   * 解绑应用业务与流程定义
   * @param params
   */
  unbindingFlowRelation(
    params: model.FlowRelationModel,
  ): Promise<model.ResultType<boolean>>;
}

export interface ISpace extends IFlow {
  /** 我加入的群组 */
  joinedCohort: ICohort[];
  /** 空间类型数据 */
  spaceData: SpaceType;
  /**空间信息 */
  target: schema.XTarget;

  /**
   * @description: 查询我加入的群
   * @param reload 是否强制刷新
   * @return {*} 查询到的群组
   */
  getJoinedCohorts(reload?: boolean): Promise<ICohort[]>;
  /**
   * 创建群组
   * @param data 群组基本信息
   */
  createCohort(
    data: Omit<TargetModel, 'id' | 'belongId' | 'teamName' | 'teamCode'>,
  ): Promise<ResultType<any>>;
  /**
   * 退出群组
   * @param id 群组Id
   */
  quitCohorts(id: string): Promise<ResultType<any>>;
  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort(id: string): Promise<ResultType<any>>;
  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort(id: string): Promise<ResultType<any>>;
  /**
   * 查询群组
   * @param code 群组编号
   */
  searchCohort(code: string): Promise<ResultType<schema.XTargetArray>>;
}
/** 群组操作 */
export interface ICohort {
  /** 群组实体对象 */
  target: schema.XTarget;
  /** 职权树 */
  authorityTree: IAuthority | undefined;
  /** 群组成员 */
  children: schema.XTarget[];
  /** 拥有的身份 */
  ownIdentitys: schema.XIdentity[];

  /**
   * 更新群组信息
   * @param name 群组名称
   * @param code 群组编号
   * @param remark 群组备注
   */
  update(
    data: Omit<TargetModel, 'id' | 'teamName' | 'teamCode'>,
  ): Promise<ResultType<any>>;
  /**
   * 获取群成员列表
   * @param reload 是否强制刷新
   */
  getMember(reload: boolean): Promise<schema.XTarget[]>;
  /**
   * 拉取成员加入群组
   * @param targets 成员列表
   */
  pullMember(targets: schema.XTarget[]): Promise<ResultType<any>>;
  /**
   * 移除群成员
   * @param targets
   */
  removeMember(ids: string[], typeName: TargetType): Promise<ResultType<any>>;
  /**
   * 判断是否拥有该身份
   * @param id 身份id
   */
  judgeHasIdentity(id: string): Promise<boolean>;
  /**
   * 获取职权树
   * @param reload 是否强制刷新
   */
  selectAuthorityTree(reload: boolean): Promise<IAuthority | undefined>;
  /**
   * 查询单位
   * @param code 单位的信用代码
   */
  searchCompany(code: string): Promise<ResultType<schema.XTargetArray>>;
  /**
   * 查询人员
   * @param code 人员编号
   */
  searchPerson(code: string): Promise<ResultType<schema.XTargetArray>>;
}
/** 人员操作 */
export interface IPerson extends IMTarget, ISpace, ITarget {
  /** 我的好友 */
  joinedFriend: schema.XTarget[];
  /** 我加入的单位 */
  joinedCompany: ICompany[];
  /**
   * 更新人员
   * @param data 人员基础信息
   * @returns 是否成功
   */
  update(data: Omit<TargetModel, 'id'>): Promise<ResultType<schema.XTarget>>;
  /**
   * 获取单位列表
   * @param reload 是否强制刷新
   * @return 加入的单位列表
   */
  getJoinedCompanys(reload?: boolean): Promise<ICompany[]>;
  /**
   * 设立单位
   * @param data 单位基本信息
   * @returns 是否成功
   */
  createCompany(
    data: Omit<TargetModel, 'id' | 'belongId'>,
  ): Promise<ResultType<schema.XTarget>>;
  /**
   * 删除单位
   * @param id 单位Id
   * @returns
   */
  deleteCompany(id: string): Promise<ResultType<any>>;
  /**
   * 申请加入单位
   * @param id 目标Id
   * @returns
   */
  applyJoinCompany(id: string, typeName: TargetType): Promise<ResultType<any>>;
  /**
   * 退出单位
   * @param id 单位Id
   */
  quitCompany(id: string): Promise<ResultType<any>>;
  /**
   * 获取好友列表
   * @param reload 是否强制刷新
   * @returns 返回好友列表
   */
  getFriends(reload?: boolean): Promise<schema.XTarget[]>;
  /**
   * 申请添加好友
   * @param target 目标
   * @returns
   */
  applyFriend(target: schema.XTarget): Promise<ResultType<any>>;
  /**
   * 移除好友
   * @param id 好友Id
   */
  removeFriend(ids: string[]): Promise<ResultType<any>>;
  /**
   * 审批我的好友申请
   * @param relation 申请
   * @param status 状态
   * @returns
   */
  approvalFriendApply(
    relation: schema.XRelation,
    status: number,
  ): Promise<ResultType<any>>;
  /** 查询我的申请 */
  queryJoinApply(): Promise<ResultType<any>>;
  /** 查询我的审批 */
  queryJoinApproval(): Promise<ResultType<any>>;
  /**
   * 取消加入组织申请
   * @param id 申请Id/好友Id
   * @returns
   */
  cancelJoinApply(id: string): Promise<ResultType<any>>;
  /**
   * 修改密码
   * @param password 新密码
   * @param privateKey 私钥
   */
  resetPassword(password: string, privateKey: string): Promise<ResultType<any>>;
  /**
   * 查询单位
   * @param code 单位的信用代码
   */
  searchCompany(code: string): Promise<ResultType<schema.XTargetArray>>;
  /**
   * 查询人员
   * @param code 人员编号
   */
  searchPerson(code: string): Promise<ResultType<schema.XTargetArray>>;
}
/** 单位操作 */
export interface ICompany extends IMTarget, ISpace, ITarget {
  /** 子组织类型 */
  subTypes: TargetType[];
  /** 单位人员 */
  person: schema.XTarget[];
  /** 我的子部门 */
  departments: IDepartment[];
  /** 我的子工作组 */
  workings: IWorking[];
  /** 我加入的集团 */
  joinedGroup: IGroup[];
  /**
   * 更新单位
   * @param data 单位基础信息
   * @returns 是否成功
   */
  update(data: Omit<TargetModel, 'id' | 'belongId'>): Promise<ResultType<schema.XTarget>>;
  /**
   * 创建集团
   * @param name 集团名称
   * @param code 集团代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 集团简介
   * @returns 是否成功
   */
  createGroup(data: Omit<TargetModel, 'id' | 'belongId'>): Promise<ResultType<any>>;
  /**
   * 移除人员
   * @param ids 人员Id集合
   */
  removePerson(ids: string[]): Promise<ResultType<any>>;
  /**
   * 删除子部门
   * @param id 部门Id
   * @returns
   */
  deleteDepartment(id: string): Promise<ResultType<any>>;
  /**
   * 删除工作组
   * @param id 工作组Id
   * @returns
   */
  deleteWorking(id: string): Promise<ResultType<any>>;
  /**
   *  退出集团
   * @param id 集团Id
   * @returns
   */
  quitGroup(id: string): Promise<ResultType<any>>;
  /**
   * 获取单位下的人员
   * @param reload 是否强制刷新
   * @returns
   */
  getPersons(reload: boolean): Promise<schema.XTarget[]>;
  /**
   * 获取单位下的部门（单位、部门）
   * @param reload 是否强制刷新
   * @returns
   */
  getDepartments(reload?: boolean): Promise<IDepartment[]>;
  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param reload 是否强制刷新
   * @returns 返回好友列表
   */
  getWorkings(reload: boolean): Promise<IWorking[]>;
  /**
   * @description: 查询我加入的集团
   * @param reload 是否强制刷新
   * @return {*} 查询到的群组
   */
  getJoinedGroups(reload?: boolean): Promise<IGroup[]>;
  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup(id: string): Promise<ResultType<any>>;
  /** 查询我的申请 */
  queryJoinApply(): Promise<ResultType<any>>;
  /** 查询我的审批 */
  queryJoinApproval(): Promise<ResultType<any>>;
  /**
   * 取消加入申请
   * @param id 申请Id/目标Id
   * @returns
   */
  cancelJoinApply(id: string): Promise<ResultType<any>>;
  /**
   * 查询集团
   * @param code 集团编号
   */
  searchGroup(code: string): Promise<ResultType<schema.XTargetArray>>;
}
/** 集团操作 */
export interface IGroup extends ITarget {
  /** 加入的父集团 */
  joinedGroup: schema.XTarget[];
  /** 子单位 */
  companys: schema.XTarget[];
  /** 子集团 */
  subGroup: IGroup[];
  /** 子组织类型 */
  subTypes: TargetType[];
  /**
   * 更新集团
   * @param data 集团基本信息
   */
  update(data: Omit<TargetModel, 'id' | 'belongId'>): Promise<ResultType<schema.XTarget>>;
  /**
   * 查询加入的集团
   * @param reload 是否强制刷新
   * @returns
   */
  getJoinedGroups(reload: boolean): Promise<schema.XTarget[]>;
  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup(id: string): Promise<ResultType<any>>;
  /**
   * 创建子集团
   * @param data 子集团基本信息
   */
  createSubGroup(data: Omit<TargetModel, 'id' | 'belongId'>): Promise<ResultType<any>>;
  /**
   * 删除子集团
   * @param id 集团Id
   * @returns
   */
  deleteSubGroup(id: string): Promise<ResultType<any>>;
  /**
   * 获取集团下的单位
   * @param reload 是否强制刷新
   * @returns
   */
  getCompanys(reload: boolean): Promise<schema.XTarget[]>;
  /**
   * 获取子集团
   * @param reload 是否强制刷新
   * @returns
   */
  getSubGroups(reload?: boolean): Promise<IGroup[]>;
}
/** 部门操作 */
export interface IDepartment extends ITarget {
  /** 人员 */
  person: schema.XTarget[];
  /** 工作组 */
  workings: IWorking[];
  /** 子部门 */
  departments: IDepartment[];
  /** 更新部门 */
  update(data: Omit<TargetModel, 'id' | 'belongId'>): Promise<ResultType<schema.XTarget>>;
  /**
   * 获取部门人员
   * @param reload 是否强制刷新
   */
  getPerson(reload: boolean): Promise<schema.XTarget[]>;
  /**
   * 获取子部门
   * @param reload 是否强制刷新
   */
  getDepartments(reload: boolean): Promise<IDepartment[]>;
  /**
   * 获取工作组
   * @param reload 是否强制刷新
   */
  getWorkings(reload: boolean): Promise<IWorking[]>;
  /** 拉人进入部门 */
  pullPerson(person: schema.XTarget[]): Promise<model.ResultType<any>>;
  /** 踢人 */
  removePerson(ids: string[]): Promise<model.ResultType<any>>;
  /** 创建子部门 */
  createDepartment(data: Omit<model.TargetModel, 'id'>): Promise<model.ResultType<any>>;
  /** 删除子部门 */
  deleteDepartment(id: string, spaceId: string): Promise<model.ResultType<any>>;
  /** 创建工作组 */
  createWorking(data: Omit<model.TargetModel, 'id'>): Promise<model.ResultType<any>>;
  /** 删除工作组 */
  deleteWorking(id: string, spaceId: string): Promise<model.ResultType<any>>;
}
/** 工作组 */
export interface IWorking extends ITarget {
  /** 人员 */
  person: schema.XTarget[];
  /** 工作组 */
  workings: IWorking[];
  /** 更新工作组 */
  update(data: Omit<TargetModel, 'id' | 'belongId'>): Promise<ResultType<schema.XTarget>>;
  /**
   * 获取工作组
   * @param reload 是否强制刷新
   */
  getWorkings(reload: boolean): Promise<IWorking[]>;
  /**
   * 获取人员
   * @param reload 是否强制刷新
   */
  getPerson(reload: boolean): Promise<schema.XTarget[]>;
  /** 拉人进入部门 */
  pullPerson(targets: schema.XTarget[]): Promise<model.ResultType<any>>;
  /**
   * 踢人
   * @param ids 人员Id集合
   */
  removePerson(ids: string[]): Promise<model.ResultType<any>>;
  /** 创建工作组 */
  createWorking(data: Omit<model.TargetModel, 'id'>): Promise<model.ResultType<any>>;
  /**
   * 删除工作组
   * @param id 工作组Id
   * @param spaceId 单位Id
   */
  deleteWorking(id: string, spaceId: string): Promise<model.ResultType<any>>;
}
