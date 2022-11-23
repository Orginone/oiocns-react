import { model, schema } from '../../base';
import { TargetType } from '../enum';
import { IIdentity } from './authority/iidentity';
import { IAuthority } from './authority/iauthority';
import { AppStore, Product } from '../market';

export interface ITarget {
  /** 可以创建的组织类型 */
  createTargetType: TargetType[];
  /** 可以加入的组织类型 */
  joinTargetType: TargetType[];
  /** 可以查询的组织类型 */
  searchTargetType: TargetType[];
  /** 当前组织/个人实体对象 */
  target: schema.XTarget;
  /** 拥有的身份 */
  ownIdentitys: IIdentity[];
  /** 所有的身份 */
  allIdentitys: IIdentity[];
  /** 拥有的职权 */
  ownAuthoritys: IAuthority[];
  /** 所有的职权 */
  allAuthoritys: IAuthority[];
  /** 组织职权树 */
  authorityTree: IAuthority | undefined;

  /**
   * 根据名称查询组织/个人
   * @param name 名称
   * @param TypeName 类型
   * @returns
   */
  searchTargetByName(name: string, typeName: TargetType): Promise<model.ResultType<any>>;
  /**
   * 创建职权
   * @param name 名称
   * @param code 编号
   * @param ispublic 是否公开
   * @param parentId 父类别ID
   * @param remark 备注
   * @returns
   */
  createAuthority(
    name: string,
    code: string,
    ispublic: boolean,
    parentId: string,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>>;
  /**
   * 创建身份
   * @param name 名称
   * @param code 编号
   * @param authId 职权Id
   * @param remark 备注
   * @returns
   */
  createIdentity(
    name: string,
    code: string,
    authId: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>>;
  /**
   * 删除职权
   * @param id 职权Id
   * @returns
   */
  deleteAuthority(id: string): Promise<model.ResultType<any>>;
  /**
   * 删除身份
   * @param id 身份Id
   * @returns
   */
  deleteIdentity(id: string): Promise<model.ResultType<any>>;
  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  selectAuthorityTree(): Promise<IAuthority | undefined>;
  /**
   * 查询当前空间赋予我该角色的组织
   * @param id
   * @returns
   */
  queryTargetsByAuthority(id: string): Promise<model.ResultType<schema.XTargetArray>>;
  /**
   * 查询组织所有职权
   * @returns
   */
  getAllAuthoritys(): Promise<IAuthority[]>;
  /**
   * 查询组织所有身份
   * @returns
   */
  getAllIdentitys(): Promise<IIdentity[]>;
  /**
   * 查询当前空间下拥有的身份
   * @returns
   */
  getOwnIdentitys(): Promise<IIdentity[]>;
}

/** 群组 */
export interface ICohort extends ITarget {
  /**
   * 拉成员加入组织
   * @param ids
   * @param typeName
   * @returns
   */
  pullMember(ids: string[], typeName: TargetType): Promise<model.ResultType<any>>;
  /**
   * 移除群组成员
   * @param ids 成员Id集合
   * @param typeName 成员类型
   * @returns
   */
  removeMember(ids: string[], typeName: TargetType): Promise<model.ResultType<any>>;
  /**
   * 获得成员列表
   * @returns
   */
  getMember(): Promise<model.ResultType<schema.XTargetArray>>;
}

/** 市场相关操作方法 */
export interface IMTarget extends ICohort {
  /** 我的加入市场申请 */
  joinMarketApplys: schema.XMarketRelation[];
  /** 加入的市场 */
  joinedMarkets: AppStore[];
  /** 拥有的产品 */
  owdProducts: Product[];
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
  getJoinMarkets(): Promise<AppStore[]>;
  /**
   * 查询开放市场
   * @returns 市场
   */
  getPublicMarket(): Promise<model.ResultType<schema.XMarket>>;
  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  getOwnProducts(): Promise<Product[]>;
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
export interface IPerson extends IMTarget {
  /**
   * @description: 查询我加入的群
   * @return {*} 查询到的群组
   */
  getJoinedCohorts(): Promise<ICohort[]>;
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
   * 解散群组
   * @param id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort(id: string): Promise<model.ResultType<any>>;
  /**
   * 申请加入群组
   * @param id 目标Id
   * @returns
   */
  applyJoinCohort(id: string): Promise<model.ResultType<any>>;
  /**
   * 退出群组
   * @param id 群组Id
   */
  quitCohorts(id: string): Promise<model.ResultType<any>>;
  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  getJoinedCompanys(): Promise<ICompany[]>;
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
   * 更新单位
   * @deprecated 该方法已弃用
   * @param id 单位Id
   * @param name 单位名称
   * @param code 单位信用代码
   * @param teamName 团队名称
   * @param teamCode 团队代码
   * @param remark 单位简介
   * @param type 单位类型,默认'单位',可选:'大学','医院','单位'
   * @returns 是否成功
   */
  updateCompany(
    id: string,
    name: string,
    code: string,
    teamName: string,
    teamCode: string,
    remark: string,
  ): Promise<model.ResultType<any>>;
  /**
   * 删除单位
   * @param id 单位Id
   * @returns
   */
  deleteCompany(id: string): Promise<model.ResultType<any>>;
  /**
   * 申请加入单位
   * @param id 目标Id
   * @returns
   */
  applyJoinCompany(id: string, typeName: TargetType): Promise<model.ResultType<any>>;
  /**
   * 退出单位
   * @param id 单位Id
   */
  quitCompany(id: string): Promise<model.ResultType<any>>;
  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  getFriends(): Promise<schema.XTarget[]>;
  /**
   * 申请添加好友
   * @param id 目标Id
   * @returns
   */
  applyFriend(id: string): Promise<model.ResultType<any>>;
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

/** 拥有对子组织操作 */
export interface ISubTarget extends ICohort {
  /** 可以创建的子类类型 */
  subTypes: TargetType[];
  /** 子组织集合 */
  subTargets: ISubTarget[];
  /** 父组织集合 */
  parentTargets: ISubTarget[];
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
}

export interface ICompany extends IMTarget {}
