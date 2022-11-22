import { AppStore, Product } from '../market';
import { schema, model } from '../../base';
import { TargetType } from '../enum';
import consts from '../consts';
import Cohort from './cohort';
import Company from './company';
import { XRelation } from '../../base/schema';

/**
 * 组织接口
 */
export default abstract class SpaceTarget {
  readonly target: schema.XTarget;

  constructor(target: schema.XTarget) {
    this.target = target;
  }

  /**
   * 根据名称查询组织/个人
   * @param name 名称
   * @param TypeName 类型
   * @returns
   */
  abstract searchTargetByName(
    name: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>>;

  /**
   * 申请加入组织/个人 (好友申请除外)
   * @param destId 加入的组织/个人id
   * @param typeName 对象
   * @returns
   */
  abstract applyJoin(
    destId: string,
    typeName: TargetType,
  ): Promise<model.ResultType<any>>;

  /**
   * 创建职权
   * @param name 名称
   * @param code 编号
   * @param is 是否公开
   * @param parentId 父类别ID
   * @param remark 备注
   * @returns
   */
  abstract createAuthority(
    name: string,
    code: string,
    is: boolean,
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
  abstract createIdentity(
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
  abstract deleteAuthority(id: string): Promise<model.ResultType<any>>;

  /**
   * 删除身份
   * @param id 身份Id
   * @returns
   */
  abstract deleteIdentity(id: string): Promise<model.ResultType<any>>;

  /**
   * 更新职权
   * @param id 唯一ID
   * @param name 名称
   * @param code 编号
   * @param is 公开的
   * @param remark 备注
   * @returns
   */
  abstract updateAuthority(
    id: string,
    name: string,
    code: string,
    is: boolean,
    remark: string,
  ): Promise<model.ResultType<schema.XAuthority>>;

  /**
   * 更新身份
   * @param id 唯一ID
   * @param name 名称
   * @param code 编号
   * @param remark 备注
   * @returns
   */
  abstract updateIdentity(
    id: string,
    name: string,
    code: string,
    remark: string,
  ): Promise<model.ResultType<schema.XIdentity>>;

  /**
   * 赋予组织个人身份
   * @param id 身份Id
   * @param targetIds 组织/个人Id集合
   * @returns
   */
  abstract giveIdentity(id: string, targetIds: string[]): Promise<model.ResultType<any>>;

  /**
   * 移除赋予给组织/个人的身份
   * @param id 身份Id
   * @param targetIds 组织/个人Id集合
   * @returns
   */
  abstract removeIdentity(
    id: string,
    targetIds: string[],
  ): Promise<model.ResultType<any>>;

  /**
   * 查询组织职权树
   * @param id
   * @returns
   */
  abstract selectAuthorityTree(id: string): Promise<model.ResultType<schema.XAuthority>>;

  /**
   * 查询我的申请
   * @returns
   */
  abstract queryJoinApply(): Promise<model.ResultType<schema.XRelationArray>>;

  /**
   * 查询我的审批
   * @returns
   */
  abstract queryjoinApproval(): Promise<model.ResultType<schema.XRelationArray>>;

  /**
   * 审批我的申请
   * @param id
   * @param status
   * @returns
   */
  abstract approvalJoinApply(id: string, status: number): Promise<model.ResultType<any>>;

  /**
   * 查询指定职权下的身份列表
   * @param id
   * @returns
   */
  abstract queryAuthorityIdentity(
    id: string,
  ): Promise<model.ResultType<schema.XIdentityArray>>;

  /**
   * 查询当前空间赋予我该角色的组织
   * @param id
   * @returns
   */
  abstract queryTargetsByAuthority(id: string): Promise<model.ResultType<any>>;

  /**
   * 查询组织所有职权
   * @returns
   */
  abstract getAllAuthoritys(): Promise<schema.XAuthority[]>;

  /**
   * 查询组织所有身份
   * @returns
   */
  abstract getAllIdentitys(): Promise<schema.XIdentity[]>;

  /**
   * 查询指定身份赋予的组织/人员
   * @param id
   * @param targetType
   * @returns
   */
  abstract getIdentityTargets(
    id: string,
    targetType: TargetType,
  ): Promise<model.ResultType<schema.XTargetArray>>;

  /**
   * 查询当前空间下拥有的身份
   * @returns
   */
  abstract getOwnIdentitys(): Promise<schema.XIdentity[]>;

  /**
   * 查询职权子职权
   * @param id
   * @returns
   */
  abstract getSubAuthoritys(
    id: string,
    page: model.PageRequest,
  ): Promise<model.ResultType<schema.XAuthorityArray>>;

  /**---------------------------------------------市场---------------------------------------------------- */

  /**
   * 创建群组
   * @param _name 名称
   * @param _code 编号
   * @param _remark 备注
   * @returns 是否创建成功
   */
  createCohort = async (
    _name: string,
    _code: string,
    _remark: string,
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 解散群组
   * @param _id 群组id
   * @param belongId 群组归属id
   * @returns
   */
  deleteCohort = async (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * @description: 查询我加入的群
   * @return >{*} 查询到的群组
   */
  getJoinedCohorts = async (): Promise<Cohort[]> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 退出群组
   * @param _id 群组Id
   */
  quitCohorts = async (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**---------------------------------------------市场---------------------------------------------------- */

  /**
   * 根据编号查询市场
   * @param _page 分页参数
   * @returns
   */
  getMarketByCode = async (
    _page: model.PageRequest,
  ): Promise<model.ResultType<schema.XMarketArray>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 查询我发起的加入市场申请
   * @param _page 分页参数
   * @returns
   */
  getJoinMarketApplys = async (
    _page: model.PageRequest,
  ): Promise<schema.XMarketRelation[]> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 删除发起的加入市场申请
   * @param _id 申请Id
   */
  cancelJoinMarketApply = async (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 查询商店列表
   * @returns 商店列表
   */
  getJoinMarkets = async (): Promise<AppStore[]> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 查询开放市场
   * @returns 市场
   */
  getMarket = async (): Promise<model.ResultType<schema.XMarket>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 查询我的产品/应用
   * @param params
   * @returns
   */
  getOwnProducts = async (): Promise<Product[]> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 申请加入市场
   * @param _id 市场ID
   * @returns
   */
  applyJoinMarket = async (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 审批加入市场申请
   * @param _id 申请id
   * @param _status 审批状态
   * @returns
   */
  ApprovalJoinApply = async (
    _id: string,
    _status: number,
  ): Promise<model.ResultType<boolean>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 退出市场
   * @param _id 退出的市场Id
   * @returns
   */
  quitMarket = async (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 创建市场
   * @param  >{Promise<model.MarketPromise<Model} 市场基础信息
   * @returns
   */
  createMarket = async (
    _name: string,
    _code: string,
    _remark: string,
    _samrId: string,
    _is: boolean,
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 创建应用
   * @param  {model.Product} 产品基础信息
   */
  createProduct = async (
    // 名称
    _name: string,
    // 编号
    _code: string,
    // 备注
    _remark: string,
    // 资源列
    _resources: schema.XResource[] | undefined,
    // 元数据Id
    _thingId: string,
    // 产品类型名
    _typeName: string,
  ): Promise<model.ResultType<schema.XProduct>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 删除市场
   * @param _market 市场
   * @returns
   */
  deleteMarket = async (_market: AppStore): Promise<model.ResultType<boolean>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 删除应用
   * @param _product 应用
   * @returns
   */
  deleteProduct = async (_product: Product): Promise<model.ResultType<boolean>> => {
    throw consts.FunctionNotFoundError;
  };

  /**---------------------------------------------个人空间---------------------------------------------------- */

  /**
   * 设立单位
   * @param _name 单位名称
   * @param _code 单位信用代码
   * @param _teamName 团队名称
   * @param _teamCode 团队代码
   * @param _remark 单位简介
   * @param _type 单位类型,默认'单位',可选:'大学','医院','单位'
   * @returns 是否成功
   */
  createCompany(
    _name: string,
    _code: string,
    _teamName: string,
    _teamCode: string,
    _remark: string,
    _type: TargetType = TargetType.Company,
  ): Promise<model.ResultType<any>> {
    throw consts.FunctionNotFoundError;
  }

  /**
   * 删除单位
   * @param _id 单位Id
   * @returns
   */
  deleteCompany = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 退出单位
   * @param _id 单位Id
   */
  quitCompany = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 获取单位列表
   * @return 加入的单位列表
   */
  getJoinedCompanys = (): Promise<Company[]> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 获取好友列表
   * @returns 返回好友列表
   */
  getFriends = (): Promise<schema.XTarget[]> => {
    throw consts.FunctionNotFoundError;
  };
  /**
   * 申请加入单位
   * @param _id 目标Id
   * @returns
   */
  applyJoinCompany = (
    _id: string,
    _typeName: TargetType,
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 申请加入群组
   * @param _id 目标Id
   * @returns
   */
  applyJoinCohort = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 申请添加好友
   * @param _id 目标Id
   * @returns
   */
  applyFriend = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 审批我的好友申请
   * @param _relation 申请
   * @param _status 状态
   * @returns
   */
  approvalFriendApply = (
    _relation: XRelation,
    _status: number,
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 取消好友申请
   * @param _id 好友Id
   * @returns
   */
  cancelJoinApply = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 移除好友
   * @param id 好友Id
   */
  removeFriend = (_ids: string[]): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**---------------------------------------------单位空间---------------------------------------------------- */

  /**
   * 创建集团
   * @param _name 集团名称
   * @param _code 集团代码
   * @param _teamName 团队名称
   * @param _teamCode 团队代码
   * @param _remark 集团简介
   * @returns 是否成功
   */
  createGroup = async (
    _name: string,
    _code: string,
    _teamName: string,
    _teamCode: string,
    _remark: string,
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 删除集团
   * @param _id 集团Id
   * @returns
   */
  deleteGroup = async (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 创建部门/工作组
   * @param _name 名称
   * @param _code 编号
   * @param _teamName 团队名称
   * @param _teamCode 团队编号
   * @param _remark 简介
   * @param _parentId 上级组织Id 默认公司 公司、部门
   * @returns
   */
  createDepartmentOrWoking = (
    _name: string,
    _code: string,
    _teamName: string,
    _teamCode: string,
    _remark: string,
    _parentId: string = '0',
    _targetType: TargetType.Working | TargetType.Department,
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 删除工作组
   * @param _id 工作组Id
   * @returns
   */
  deleteWoking = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 删除部门
   * @param _id 部门Id
   * @returns
   */
  deleteDepartment = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 拉人进入单位
   * @param _personIds 人员id数组
   * @returns 是否成功
   */
  pullPerson = (_personIds: string[]): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 拉人进入部门
   * @param _id 部门Id
   * @param _personIds 人员id数组
   * @returns 是否成功
   */
  pullPersonInDepartment = (
    _id: string,
    _personIds: string[],
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 拉人进入工作组
   * @param _id 工作组Id
   * @param _personIds 人员id数组
   * @returns 是否成功
   */
  pullPersonInWorking = (
    _id: string,
    _personIds: string[],
  ): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 获取组织下的工作组（单位、部门、工作组）
   * @param _id 组织Id 默认为当前单位
   * @returns 返回好友列表
   */
  getWorkings = (_id: string = '0'): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 获取组织下的人员（单位、部门、工作组）
   * @param _id 组织Id 默认为当前单位
   * @returns
   */
  getPersons = (_id: string = '0'): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 获取组织下的部门（单位、部门）
   * @param _id 组织Id 默认为当前单位
   * @returns
   */
  getDepartments = (_id: string = '0'): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   * 申请加入集团
   * @param _id 目标Id
   * @returns
   */
  applyJoinGroup = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };

  /**
   *  退出集团
   * @param _id 集团Id
   * @returns
   */
  quitGroup = (_id: string): Promise<model.ResultType<any>> => {
    throw consts.FunctionNotFoundError;
  };
}
