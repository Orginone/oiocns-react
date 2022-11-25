import { model, schema } from '@/ts/base';
import { ResultType } from '@/ts/base/model';
import { TargetType } from '../enum';
import { Market, BaseProduct } from '../market';
import { IAuthority } from './authority/iauthority';

/** 市场相关操作方法 */
export interface IMTarget {
  /**
   * 根据编号查询市场
   * @param name 编号、名称
   * @returns
   */
  getMarketByCode(name: string): Promise<ResultType<schema.XMarketArray>>;
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
  ): Promise<ResultType<schema.XMarket>>;
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
  ): Promise<ResultType<schema.XProduct>>;
  /**
   * 添加暂存区
   * @param id 商品Id
   */
  stagingMerchandise(id: string): Promise<ResultType<any>>;
  /**
   * 删除暂存区
   * @param id 暂存区Id
   */
  deleteStaging(id: string): Promise<ResultType<any>>;
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
}
/** 群组操作 */
export interface ICohort {
  /** 群组实体对象 */
  target: schema.XTarget;
  /** 职权树 */
  authorityTree: IAuthority | undefined;
  /** 群组成员 */
  children: schema.XTarget[];

  /**
   * 更新群组信息
   * @param name 群组名称
   * @param code 群组编号
   * @param remark 群组备注
   */
  update(name: string, code: string, remark: string): Promise<ResultType<any>>;
  /** 获取群成员列表 */
  getMember(): Promise<schema.XTarget[]>;
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
  /** 获取职权树 */
  selectAuthorityTree(): Promise<IAuthority | undefined>;
}
/** 人员操作 */
export interface IPerson {
  /** 人员实体 */
  target: schema.XTarget;
  /** 职权树 */
  authorityTree: IAuthority | undefined;
  /** 我的好友 */
  joinedFriend: schema.XTarget[];
  /** 我加入的群组 */
  joinedCohort: ICohort[];
  /** 我加入的单位 */
  joinedCompany: ICompany[];
  /** 我加入的市场 */
  joinedMarkets: Market[];
  /** 开放市场 */
  publicMarkets: Market[];
  /** 拥有的产品/应用 */
  ownProducts: BaseProduct[];
  /** 我的购物车 */
  stagings: schema.XStaging[];
  /** 我发起的加入市场的申请 */
  joinMarketApplys: schema.XMarketRelation[];
  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  getJoinedCohorts(): Promise<ICohort[]>;
  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  getJoinedCompanys(): Promise<ICompany[]>;
  /** 获取职权树 */
  selectAuthorityTree(): Promise<IAuthority | undefined>;
  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  createCohort(name: string, code: string, remark: string): Promise<ResultType<any>>;
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
  ): Promise<ResultType<any>>;
  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort(id: string): Promise<ResultType<any>>;
  /**
   * 删除单位
   * @param id 单位Id
   * @returns
   */
  deleteCompany(id: string): Promise<ResultType<any>>;
  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort(id: string): Promise<ResultType<any>>;
  /**
   * 申请加入单位
   * @param id 目标Id
   * @returns
   */
  applyJoinCompany(id: string, typeName: TargetType): Promise<ResultType<any>>;
  /**
   * 退出群组
   * @param id 群组Id
   */
  quitCohorts(id: string): Promise<ResultType<any>>;
  /**
   * 退出单位
   * @param id 单位Id
   */
  quitCompany(id: string): Promise<ResultType<any>>;
  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  getFriends(): Promise<schema.XTarget[]>;
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
   * 根据编号查询市场
   * @param code 编号
   */
  getMarketByCode(code: string): Promise<ResultType<schema.XMarketArray>>;
  /**
   * 查询我拥有的应用
   */
  getOwnProducts(): Promise<BaseProduct[]>;
  /** 查询我加入的市场 */
  getJoinMarkets(): Promise<Market[]>;
  /** 查询开放的市场 */
  getPublicMarket(): Promise<Market[]>;
  /** 查询购物车 */
  getStaging(): Promise<schema.XStaging[]>;
  /**
   * 查询我购买的订单列表
   * @param status 订单状态 0:不过滤状态
   * @param page 分页参数
   */
  getBuyOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderArray>>;
  /**
   * 查询我卖出的订单列表
   * @param status 订单状态 0:不过滤状态
   * @param page 分页参数
   */
  getSellOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderDetailArray>>;
  /**
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  applyJoinMarket(id: string): Promise<ResultType<any>>;
  /**
   * 取消加入市场申请
   * @param id 申请Id
   */
  cancelJoinMarketApply(id: string): Promise<ResultType<any>>;
  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
  getJoinMarketApplys(): Promise<schema.XMarketRelation[]>;
  /**
   * 查询加入市场审批
   */
  queryJoinMarketApproval(): Promise<ResultType<schema.XMarketRelationArray>>;
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
    // 是否开放
    ispublic: boolean,
  ): Promise<ResultType<schema.XMarket>>;
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
  ): Promise<ResultType<schema.XProduct>>;
  /**
   * 加入购物车
   * @param id 商品Id
   */
  stagingMerchandise(id: string): Promise<ResultType<any>>;
  /**
   * 删除购物车
   * @param id
   */
  deleteStaging(id: string): Promise<ResultType<any>>;
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
}
/** 单位操作 */
export interface ICompany {
  /** 单位实体 */
  target: schema.XTarget;
  /** 职权树 */
  authorityTree: IAuthority | undefined;
  /** 单位人员 */
  person: schema.XTarget[];
  /** 我的子部门 */
  departments: IDepartment[];
  /** 我的子工作组 */
  workings: IWorking[];
  /** 我加入的集团 */
  joinedGroup: IGroup[];
  /** 我加入的群组 */
  joinedCohort: ICohort[];
  /** 我加入的市场 */
  joinedMarkets: Market[];
  /** 开放市场 */
  publicMarkets: Market[];
  /** 拥有的产品/应用 */
  ownProducts: BaseProduct[];
  /** 我的购物车 */
  stagings: schema.XStaging[];
  /** 我发起的加入市场的申请 */
  joinMarketApplys: schema.XMarketRelation[];
  /**
   * 更新单位
   * @param name 单位名称
   * @param code 单位信用代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 单位简介
   * @param type 单位类型,默认'单位',可选:'大学','医院','单位'
   * @returns 是否成功
   */
  update(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<ResultType<schema.XTarget>>;
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
  ): Promise<ResultType<any>>;
  /**
   * 创建群组
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns 是否创建成功
   */
  createCohort(name: string, code: string, remark: string): Promise<ResultType<any>>;
  /**
   * 删除集团
   * @param id 集团Id
   * @returns
   */
  deleteGroup(id: string): Promise<ResultType<any>>;
  /**
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort(id: string): Promise<ResultType<any>>;
  /**
   * 退出群组
   * @param id 群组Id
   */
  quitCohorts(id: string): Promise<ResultType<any>>;
  /**
   *  退出集团
   * @param id 集团Id
   * @returns
   */
  quitGroup(id: string): Promise<ResultType<any>>;
  /**
   * 获取单位下的人员
   * @returns
   */
  getPersons(): Promise<schema.XTarget[]>;
  /** 获取职权树 */
  selectAuthorityTree(): Promise<IAuthority | undefined>;
  /**
   * 获取单位下的部门（单位、部门）
   * @returns
   */
  getDepartments(): Promise<IDepartment[]>;
  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param id 组织Id 默认为当前单位
   * @returns 返回好友列表
   */
  getWorkings(): Promise<IWorking[]>;
  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  getJoinedCohorts(): Promise<ICohort[]>;
  /**
   * @description: 查询我加入的集团
   * @return {*} 查询到的群组
   */
  getJoinedGroups(): Promise<IGroup[]>;
  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort(id: string): Promise<ResultType<any>>;
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
   * 根据编号查询市场
   * @param code 编号
   */
  getMarketByCode(code: string): Promise<ResultType<schema.XMarketArray>>;
  /**
   * 查询我拥有的应用
   */
  getOwnProducts(): Promise<BaseProduct[]>;
  /** 查询我加入的市场 */
  getJoinMarkets(): Promise<Market[]>;
  /** 查询开放的市场 */
  getPublicMarket(): Promise<Market[]>;
  /** 查询购物车 */
  getStaging(): Promise<schema.XStaging[]>;
  /**
   * 查询我购买的订单列表
   * @param status 订单状态 0:不过滤状态
   * @param page 分页参数
   */
  getBuyOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderArray>>;
  /**
   * 查询我卖出的订单列表
   * @param status 订单状态 0:不过滤状态
   * @param page 分页参数
   */
  getSellOrders(
    status: number,
    page: model.PageRequest,
  ): Promise<ResultType<schema.XOrderDetailArray>>;
  /**
   * 申请加入市场
   * @param id 市场ID
   * @returns
   */
  applyJoinMarket(id: string): Promise<ResultType<any>>;
  /**
   * 取消加入市场申请
   * @param id 申请Id
   */
  cancelJoinMarketApply(id: string): Promise<ResultType<any>>;
  /**
   * 查询我发起的加入市场申请
   * @param page 分页参数
   * @returns
   */
  getJoinMarketApplys(): Promise<schema.XMarketRelation[]>;
  /**
   * 查询加入市场审批
   */
  queryJoinMarketApproval(): Promise<ResultType<schema.XMarketRelationArray>>;
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
    // 是否开放
    ispublic: boolean,
  ): Promise<ResultType<schema.XMarket>>;
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
  ): Promise<ResultType<schema.XProduct>>;
  /**
   * 加入购物车
   * @param id 商品Id
   */
  stagingMerchandise(id: string): Promise<ResultType<any>>;
  /**
   * 删除购物车
   * @param id
   */
  deleteStaging(id: string): Promise<ResultType<any>>;
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
}
/** 集团操作 */
export interface IGroup {
  /** 集团实体 */
  target: schema.XTarget;
  /** 职权树 */
  authorityTree: IAuthority | undefined;
  /** 加入的父集团 */
  joinedGroup: schema.XTarget[];
  /** 子单位 */
  companys: schema.XTarget[];
  /** 子集团 */
  subGroup: IGroup[];
  /**
   * 查询加入的集团
   * @returns
   */
  getJoinedGroups(): Promise<schema.XTarget[]>;
  /** 获取职权树 */
  selectAuthorityTree(): Promise<IAuthority | undefined>;
  /**
   * 申请加入集团
   * @param id 目标Id
   * @returns
   */
  applyJoinGroup(id: string): Promise<ResultType<any>>;
  /**
   * 创建子集团
   * @param name 子集团名称
   * @param code 子集团编号
   * @param teamName 团队名称
   * @param teamCode 团队编号
   * @param remark 备注
   */
  createSubGroup(
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<ResultType<any>>;
  /**
   * 删除子集团
   * @param id 集团Id
   * @returns
   */
  deleteSubGroup(id: string): Promise<ResultType<any>>;
  /**
   * 获取集团下的单位
   * @returns
   */
  getCompanys(): Promise<schema.XTarget[]>;
  /**
   * 获取子集团
   * @param id 组织Id 默认为当前集团
   * @returns
   */
  getSubGroups(): Promise<IGroup[]>;
}

export interface IDepartment {}

export interface IWorking {}
