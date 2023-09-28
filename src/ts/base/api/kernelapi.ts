import StoreHub from './storehub';
import * as model from '../model';
import type * as schema from '../schema';
import axios from 'axios';
import { Emitter, logger } from '../common';
import { command } from '../common/command';
/**
 * 资产共享云内核api
 */
export default class KernelApi {
  // 当前用户
  userId: string = '';
  // 存储集线器
  private _storeHub: StoreHub;
  // axios实例
  private readonly _axiosInstance = axios.create({});
  // 单例
  private static _instance: KernelApi;
  // 必达消息缓存
  private _cacheData: any = {};
  // 监听方法
  private _methods: { [name: string]: ((...args: any[]) => void)[] };
  // 订阅方法
  private _subMethods: {
    [name: string]: {
      keys: string[];
      operation: (...args: any[]) => void;
    }[];
  };
  // 上下线提醒
  onlineNotify = new Emitter();
  // 在线的连接
  onlineIds: string[] = [];
  // 获取accessToken
  public get accessToken(): string {
    return sessionStorage.getItem('accessToken') || '';
  }
  // 设置accessToken
  private set accessToken(val: string) {
    sessionStorage.setItem('accessToken', val);
  }
  /**
   * 私有构造方法
   * @param url 远端地址
   */
  private constructor(url: string) {
    this._methods = {};
    this._subMethods = {};
    this._storeHub = new StoreHub(url, 'txt');
    this._storeHub.on('Receive', (res) => this._receive(res));
    this._storeHub.onConnected(() => {
      if (this.accessToken.length > 0) {
        this._storeHub
          .invoke('TokenAuth', this.accessToken)
          .then((res: model.ResultType<any>) => {
            if (res.success) {
              logger.info('连接到内核成功!');
            }
          })
          .catch((err) => {
            logger.error(err);
          });
      }
    });
    this._storeHub.start();
  }

  /**
   * 实时获取连接状态
   * @param callback
   */
  public async onConnectedChanged(callback: (res: boolean) => void) {
    callback.apply(this, [this._storeHub.isConnected]);
    this._storeHub.onDisconnected(() => callback.apply(this, [false]));
    this._storeHub.onConnected(() => callback.apply(this, [true]));
  }
  /**
   * 获取单例
   * @param {string} url 集线器地址，默认为 "/orginone/kernel/hub"
   * @returns {KernelApi} 内核api单例
   */
  public static getInstance(url: string = '/orginone/kernel/hub'): KernelApi {
    if (this._instance == null) {
      this._instance = new KernelApi(url);
    }
    return this._instance;
  }
  /**
   * 是否在线
   * @returns {boolean} 在线状态
   */
  public get isOnline(): boolean {
    return this._storeHub.isConnected;
  }
  /** 连接信息 */
  public async onlines(): Promise<model.OnlineSet | undefined> {
    if (this.onlineIds.length > 0) {
      const result = await this._storeHub.invoke('Online');
      if (result.success && result.data) {
        var data: model.OnlineSet = result.data;
        var uids = data?.users?.map((i) => i.connectionId) || [];
        var sids = data?.storages?.map((i) => i.connectionId) || [];
        var ids = [...uids, ...sids];
        if (ids.length != this.onlineIds.length) {
          this.onlineIds = ids;
          this.onlineNotify.changCallback();
        }
        this.onlineIds = ids;
        return result.data;
      }
    }
  }
  /**
   * 登录到后台核心获取accessToken
   * @param userName 用户名
   * @param password 密码
   * @returns {Promise<model.ResultType<any>>} 异步登录结果
   */
  public async login(userName: string, password: string): Promise<model.ResultType<any>> {
    var res: model.ResultType<any>;
    var req = {
      account: userName,
      pwd: password,
    };
    if (this._storeHub.isConnected) {
      res = await this._storeHub.invoke('Login', req);
    } else {
      res = await this._restRequest('login', req);
    }
    if (res.success) {
      this.accessToken = res.data.accessToken;
    }
    return res;
  }
  /**
   * 重置密码
   * @param userName 用户名
   * @param password 密码
   * @returns {Promise<model.ResultType<any>>}
   */
  public async resetPassword(
    userName: string,
    password: string,
    privatekey: string,
  ): Promise<model.ResultType<any>> {
    var res: model.ResultType<any>;
    var req = {
      account: userName,
      password: password,
      privateKey: privatekey,
    };
    if (this._storeHub.isConnected) {
      res = await this._storeHub.invoke('ResetPassword', req);
    } else {
      res = await this._restRequest('resetpassword', req);
    }
    return res;
  }
  /**
   * 注册到后台核心获取accessToken
   * @param name 姓名
   * @param motto 座右铭
   * @param phone 电话
   * @param account 账户
   * @param password 密码
   * @param nickName 昵称
   * @returns {Promise<model.ResultType<any>>} 异步注册结果
   */
  public async register(params: model.RegisterType): Promise<model.ResultType<any>> {
    var res: model.ResultType<any>;
    if (this._storeHub.isConnected) {
      res = await this._storeHub.invoke('Register', params);
    } else {
      res = await this._restRequest('Register', params);
    }
    if (res.success) {
      this.accessToken = res.data.accessToken;
    }
    return res;
  }
  /** 激活存储 */
  public async activateStorage(
    params: model.GainModel,
  ): Promise<model.ResultType<schema.XEntity>> {
    return await this.request({
      module: 'target',
      action: 'ActivateStorage',
      params: params,
    });
  }
  /**
   * 根据ID查询实体信息
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<schema.XEntity>} 请求结果
   */
  public async queryEntityById(
    params: model.IdModel,
  ): Promise<model.ResultType<schema.XEntity>> {
    return await this.request({
      module: 'core',
      action: 'QueryEntityById',
      params: params,
    });
  }
  /**
   * 创建权限
   * @param {model.AuthorityModel} params 请求参数
   * @returns {model.ResultType<schema.XAuthority>} 请求结果
   */
  public async createAuthority(
    params: model.AuthorityModel,
  ): Promise<model.ResultType<schema.XAuthority>> {
    return await this.request({
      module: 'target',
      action: 'CreateAuthority',
      params: params,
    });
  }
  /**
   * 创建身份
   * @param {model.IdentityModel} params 请求参数
   * @returns {model.ResultType<schema.XIdentity>} 请求结果
   */
  public async createIdentity(
    params: model.IdentityModel,
  ): Promise<model.ResultType<schema.XIdentity>> {
    return await this.request({
      module: 'target',
      action: 'CreateIdentity',
      params: params,
    });
  }
  /**
   * 创建用户
   * @param {model.TargetModel} params 请求参数
   * @returns {model.ResultType<schema.XTarget>} 请求结果
   */
  public async createTarget(
    params: model.TargetModel,
  ): Promise<model.ResultType<schema.XTarget>> {
    return await this.request({
      module: 'target',
      action: 'CreateTarget',
      params: params,
    });
  }
  /**
   * 删除权限
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteAuthority(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteAuthority',
      params: params,
    });
  }
  /**
   * 删除身份
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteIdentity(params: model.IdModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteIdentity',
      params: params,
    });
  }
  /**
   * 删除用户
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteTarget(params: model.IdModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteTarget',
      params: params,
    });
  }
  /**
   * 更新权限
   * @param {model.AuthorityModel} params 请求参数
   * @returns {model.ResultType<schema.XAuthority>} 请求结果
   */
  public async updateAuthority(
    params: model.AuthorityModel,
  ): Promise<model.ResultType<schema.XAuthority>> {
    return await this.request({
      module: 'target',
      action: 'UpdateAuthority',
      params: params,
    });
  }
  /**
   * 更新身份
   * @param {model.IdentityModel} params 请求参数
   * @returns {model.ResultType<schema.XIdentity>} 请求结果
   */
  public async updateIdentity(
    params: model.IdentityModel,
  ): Promise<model.ResultType<schema.XIdentity>> {
    return await this.request({
      module: 'target',
      action: 'UpdateIdentity',
      params: params,
    });
  }
  /**
   * 更新用户
   * @param {model.TargetModel} params 请求参数
   * @returns {model.ResultType<schema.XTarget>} 请求结果
   */
  public async updateTarget(
    params: model.TargetModel,
  ): Promise<model.ResultType<schema.XTarget>> {
    return await this.request({
      module: 'target',
      action: 'UpdateTarget',
      params: params,
    });
  }
  /**
   * 分配身份
   * @param {model.GiveModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async giveIdentity(params: model.GiveModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'GiveIdentity',
      params: params,
    });
  }
  /**
   * 移除身份
   * @param {model.GiveModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeIdentity(
    params: model.GiveModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RemoveIdentity',
      params: params,
    });
  }
  /**
   * 申请加入用户
   * @param {model.GainModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async applyJoinTeam(
    params: model.GainModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'ApplyJoinTeam',
      params: params,
    });
  }
  /**
   * 拉入用户的团队
   * @param {model.GiveModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async pullAnyToTeam(
    params: model.GiveModel,
  ): Promise<model.ResultType<string[]>> {
    return await this.request({
      module: 'target',
      action: 'PullAnyToTeam',
      params: params,
    });
  }
  /**
   * 移除或退出用户的团队
   * @param {model.GainModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeOrExitOfTeam(
    params: model.GainModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RemoveOrExitOfTeam',
      params: params,
    });
  }
  /**
   * 根据ID查询用户信息
   * @param {model.IdArrayModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async queryTargetById(
    params: model.IdArrayModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetById',
      params: params,
    });
  }
  /**
   * 模糊查找用户
   * @param {model.SearchModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async searchTargets(
    params: model.SearchModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'SearchTargets',
      params: params,
    });
  }
  /**
   * 根据ID查询子用户
   * @param {model.GetSubsModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async querySubTargetById(
    params: model.GetSubsModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'QuerySubTargetById',
      params: params,
    });
  }
  /**
   * 查询用户加入的用户
   * @param {model.GetJoinedModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async queryJoinedTargetById(
    params: model.GetJoinedModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'QueryJoinedTargetById',
      params: params,
    });
  }
  /**
   * 查询组织权限树
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<schema.XAuthority>} 请求结果
   */
  public async queryAuthorityTree(
    params: model.IdPageModel,
  ): Promise<model.ResultType<schema.XAuthority>> {
    return await this.request({
      module: 'target',
      action: 'QueryAuthorityTree',
      params: params,
    });
  }
  /**
   * 查询拥有权限的成员
   * @param {model.GainModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async queryAuthorityTargets(
    params: model.GainModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'QueryAuthorityTargets',
      params: params,
    });
  }
  /**
   * 查询组织身份
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XIdentity>>} 请求结果
   */
  public async queryTargetIdentitys(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XIdentity>>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetIdentitys',
      params: params,
    });
  }
  /**
   * 查询赋予身份的用户
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async queryIdentityTargets(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'QueryIdentityTargets',
      params: params,
    });
  }
  /**
   * 查询在当前空间拥有权限的组织
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XTarget>>} 请求结果
   */
  public async queryTargetsByAuthority(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XTarget>>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetsByAuthority',
      params: params,
    });
  }
  /**
   * 查询赋予的身份
   * @returns {model.ResultType<model.PageResult<schema.XIdProof>>} 请求结果
   */
  public async queryGivedIdentitys(): Promise<
    model.ResultType<model.PageResult<schema.XIdProof>>
  > {
    return await this.request({
      module: 'target',
      action: 'QueryGivedIdentitys',
      params: {},
    });
  }
  /**
   * 查询组织身份集
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XIdentity>>} 请求结果
   */
  public async queryTeamIdentitys(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XIdentity>>> {
    return await this.request({
      module: 'target',
      action: 'QueryTeamIdentitys',
      params: params,
    });
  }
  /**
   * 创建办事定义
   * @param {model.WorkDefineModel} params 请求参数
   * @returns {model.ResultType<schema.XWorkDefine>} 请求结果
   */
  public async createWorkDefine(
    params: model.WorkDefineModel,
  ): Promise<model.ResultType<schema.XWorkDefine>> {
    return await this.request({
      module: 'work',
      action: 'CreateWorkDefine',
      params: params,
    });
  }
  /**
   * 创建办事实例(启动办事)
   * @param {model.WorkInstanceModel} params 请求参数
   * @returns {model.ResultType<schema.XWorkInstance>} 请求结果
   */
  public async createWorkInstance(
    params: model.WorkInstanceModel,
  ): Promise<model.ResultType<schema.XWorkInstance>> {
    return await this.request({
      module: 'work',
      action: 'CreateWorkInstance',
      params: params,
    });
  }
  /**
   * 删除办事定义
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteWorkDefine(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'work',
      action: 'DeleteWorkDefine',
      params: params,
    });
  }
  /**
   * 删除办事实例(发起人撤回)
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async recallWorkInstance(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'work',
      action: 'RecallWorkInstance',
      params: params,
    });
  }
  /**
   * 查询办事定义
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XWorkDefine>>} 请求结果
   */
  public async queryWorkDefine(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XWorkDefine>>> {
    return await this.request({
      module: 'work',
      action: 'QueryWorkDefine',
      params: params,
    });
  }
  /**
   * 查询办事节点
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<model.WorkNodeModel>} 请求结果
   */
  public async queryWorkNodes(
    params: model.IdModel,
  ): Promise<model.ResultType<model.WorkNodeModel>> {
    return await this.request({
      module: 'work',
      action: 'QueryWorkNodes',
      params: params,
    });
  }
  /**
   * 查询待审批任务、抄送
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XWorkTask>>} 请求结果
   */
  public async queryApproveTask(
    params: model.IdModel,
  ): Promise<model.ResultType<model.PageResult<schema.XWorkTask>>> {
    return await this.request({
      module: 'work',
      action: 'QueryApproveTask',
      params: params,
    });
  }
  /**
   * 办事节点审批
   * @param {model.ApprovalTaskReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async approvalTask(
    params: model.ApprovalTaskReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'work',
      action: 'ApprovalTask',
      params: params,
    });
  }
  /**
   * 获取对象数据
   * @param {string} belongId 对象所在的归属用户ID
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async diskInfo(
    belongId: string,
    relations: string[],
  ): Promise<model.ResultType<model.DiskInfoType>> {
    return await this.dataProxy({
      module: 'Disk',
      action: 'Info',
      belongId,
      relations,
      params: {},
    });
  }
  /**
   * 获取对象数据
   * @param {string} belongId 对象所在的归属用户ID
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async objectGet<T>(
    belongId: string,
    relations: string[],
    key: string,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Object',
      action: 'Get',
      belongId,
      relations,
      params: key,
    });
  }
  /**
   * 变更对象数据
   * @param {string} belongId 对象所在的归属用户ID
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {any} setData 对象新的值
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async objectSet(
    belongId: string,
    relations: string[],
    key: string,
    setData: any,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Object',
      action: 'Set',
      belongId,
      relations,
      params: {
        key,
        setData,
      },
    });
  }
  /**
   * 删除对象数据
   * @param {string} belongId 对象所在的归属用户ID
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async objectDelete(
    belongId: string,
    relations: string[],
    key: string,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Object',
      action: 'Delete',
      belongId,
      relations,
      params: key,
    });
  }
  /**
   * 添加数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {} data 要添加的数据，对象/数组
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionInsert<T>(
    belongId: string,
    relations: string[],
    collName: string,
    data: T,
    copyId?: string,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Insert',
      belongId,
      copyId,
      relations,
      params: { collName, data },
    });
  }
  /**
   * 变更数据集数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {} data 要添加的数据，对象/数组
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionSetFields<T>(
    belongId: string,
    relations: string[],
    collName: string,
    collSet: any,
    copyId?: string,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'SetFields',
      belongId,
      copyId,
      relations,
      params: { collName, collSet },
    });
  }
  /**
   * 替换数据集数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {T} replace 要添加的数据，对象/数组
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionReplace<T>(
    belongId: string,
    relations: string[],
    collName: string,
    replace: T,
    copyId?: string,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Replace',
      belongId,
      copyId,
      relations,
      params: { collName, replace },
    });
  }
  /**
   * 更新数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} update 更新操作（match匹配，update变更,options参数）
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionUpdate(
    belongId: string,
    relations: string[],
    collName: string,
    update: any,
    copyId?: string,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Update',
      belongId,
      copyId,
      relations,
      params: { collName, update },
    });
  }
  /**
   * 从数据集移除数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} match 匹配信息
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionRemove(
    belongId: string,
    relations: string[],
    collName: string,
    match: any,
    copyId?: string,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Remove',
      belongId,
      copyId,
      relations,
      params: { collName, match },
    });
  }
  /**
   * 查询数据集数据
   * @param  过滤参数
   * @returns {model.ResultType<T>} 移除异步结果
   */
  public async collectionLoad<T>(
    belongId: string,
    relations: string[],
    options: any,
  ): Promise<model.LoadResult<T>> {
    options.belongId = belongId;
    const res = await this.dataProxy({
      module: 'Collection',
      action: 'Load',
      belongId,
      params: options,
      relations,
    });
    return { ...res, ...res.data };
  }
  /**
   * 从数据集查询数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionAggregate(
    belongId: string,
    relations: string[],
    collName: string,
    options: any,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Aggregate',
      belongId,
      relations,
      params: { collName, options },
    });
  }
  /**
   * 从数据集查询数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
   * @param {string} belongId 对象所在的归属用户ID
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async collectionPageRequest<T>(
    belongId: string,
    relations: string[],
    collName: string,
    options: any,
    page: model.PageModel,
  ): Promise<model.ResultType<model.PageResult<T>>> {
    const total = await this.collectionAggregate(belongId, relations, collName, options);
    if (total.data && Array.isArray(total.data) && total.data.length > 0) {
      options.skip = page.offset;
      options.limit = page.limit;
      const res = await this.collectionAggregate(belongId, relations, collName, options);
      return {
        ...res,
        data: {
          offset: page.offset,
          limit: page.limit,
          total: total.data[0].count,
          result: res.data,
        },
      };
    }
    return total;
  }
  /**
   * 桶操作
   * @param data 操作携带的数据
   * @returns {ResultType<T>} 移除异步结果
   */
  public async bucketOpreate<T>(
    belongId: string,
    relations: string[],
    data: model.BucketOpreateModel,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Bucket',
      action: 'Operate',
      belongId,
      relations,
      params: data,
    });
  }
  /**
   * 加载物
   * @param  过滤参数
   * @returns {model.ResultType<T>} 移除异步结果
   */
  public async loadThing<T>(
    belongId: string,
    relations: string[],
    options: any,
  ): Promise<model.ResultType<T>> {
    options.belongId = belongId;
    return await this.dataProxy({
      module: 'Thing',
      action: 'Load',
      belongId,
      relations,
      params: options,
    });
  }
  /**
   * 创建物
   * @param name 物的名称
   * @returns {model.ResultType<model.AnyThingModel>} 移除异步结果
   */
  public async createThing(
    belongId: string,
    relations: string[],
    name: string,
  ): Promise<model.ResultType<model.AnyThingModel>> {
    return await this.dataProxy({
      module: 'Thing',
      action: 'Create',
      belongId,
      relations,
      params: name,
    });
  }
  /**
   * 由内核代理一个http请求
   * @param {model.HttpRequestType} reqs 请求体
   * @returns 异步结果
   */
  public async httpForward(
    req: model.HttpRequestType,
  ): Promise<model.ResultType<model.HttpResponseType>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('HttpForward', req);
    } else {
      return await this._restRequest('httpForward', req, 20);
    }
  }
  /**
   * 请求一个数据核方法
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async dataProxy(req: model.DataProxyType): Promise<model.ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('DataProxy', req);
    } else {
      return await this._restRequest('dataProxy', req);
    }
  }
  /**
   * 数据变更通知
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async dataNotify(req: model.DataNotityType): Promise<model.ResultType<boolean>> {
    if (req.ignoreSelf) {
      req.ignoreConnectionId = this._storeHub.connectionId;
    }
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('DataNotify', req);
    } else {
      return await this._restRequest('dataNotify', req);
    }
  }
  /**
   * 请求一个内核方法
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async request(req: model.ReqestType): Promise<model.ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Request', req);
    } else {
      return await this._restRequest('request', req);
    }
  }
  /**
   * 请求多个内核方法,使用同一个事务
   * @param {model.ResultType<any>[]} reqs 请求体
   * @returns 异步结果
   */
  public async requests(reqs: model.ReqestType[]): Promise<model.ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Requests', reqs);
    } else {
      return await this._restRequest('requests', reqs);
    }
  }
  /**
   * 订阅变更
   * @param flag 标识
   * @param keys 唯一标志
   * @param operation 操作
   */
  public subscribe(
    flag: string,
    keys: string[],
    operation: (...args: any[]) => any,
  ): void {
    if (!flag || !operation || keys.length < 1) {
      return;
    }
    flag = flag.toLowerCase();
    if (!this._subMethods[flag]) {
      this._subMethods[flag] = [];
    }
    this._subMethods[flag].push({
      keys,
      operation,
    });
    const data = this._cacheData[flag] || [];
    data.forEach((item: any) => {
      operation.apply(this, [item]);
    });
    this._cacheData[flag] = [];
  }
  /**
   * 取消订阅变更
   * @param flag 标识
   * @param keys 唯一标志
   * @param operation 操作
   */
  public unSubscribe(key: string): void {
    Object.keys(this._subMethods).forEach((flag) => {
      this._subMethods[flag] = this._subMethods[flag].filter(
        (i) => !i.keys.includes(key),
      );
    });
  }
  /**
   * 监听服务端方法
   * @param {string} methodName 方法名
   * @returns {void} 无返回值
   */
  public on(methodName: string, newOperation: (...args: any[]) => any): void {
    if (!methodName || !newOperation) {
      return;
    }
    methodName = methodName.toLowerCase();
    if (!this._methods[methodName]) {
      this._methods[methodName] = [];
    }
    if (this._methods[methodName].indexOf(newOperation) !== -1) {
      return;
    }
    this._methods[methodName].push(newOperation);
  }
  /** 接收服务端消息 */
  private _receive(res: model.ReceiveType) {
    switch (res.target) {
      case 'DataNotify':
        {
          const data: model.DataNotityType = res.data;
          if (data.ignoreConnectionId === this._storeHub.connectionId) {
            return;
          }
          const flag = `${data.belongId}-${data.targetId}-${data.flag}`.toLowerCase();
          const methods = this._subMethods[flag];
          if (methods) {
            try {
              methods.forEach((m) => m.operation.apply(this, [data.data]));
            } catch (e) {
              logger.error(e as Error);
            }
          } else if (!data.onlineOnly) {
            const data = this._cacheData[flag] || [];
            this._cacheData[flag] = [...data, data.data];
          }
        }
        break;
      case 'Online':
      case 'Outline':
        {
          const connectionId = res.data.connectionId;
          if (connectionId && connectionId.length > 0) {
            if (this.onlineIds.length < 1) {
              this.onlineIds.push('');
              this.onlines();
            } else {
              if (res.target === 'Online') {
                if (this.onlineIds.every((i) => i != connectionId)) {
                  this.onlineIds.push(connectionId);
                }
              } else {
                this.onlineIds = this.onlineIds.filter((i) => i != connectionId);
              }
              this.onlineNotify.changCallback();
            }
            command.emitter('_', res.target.toLowerCase(), res.data);
          }
        }
        break;
      default: {
        const methods = this._methods[res.target.toLowerCase()];
        if (methods) {
          try {
            methods.forEach((m) => m.apply(this, [res.data]));
          } catch (e) {
            logger.error(e as Error);
          }
        }
      }
    }
  }
  /**
   * 使用rest请求后端
   * @param methodName 方法
   * @param data 参数
   * @returns 返回结果
   */
  private async _restRequest(
    methodName: string,
    args: any,
    timeout: number = 2,
  ): Promise<model.ResultType<any>> {
    const res = await this._axiosInstance({
      method: 'post',
      timeout: timeout * 1000,
      url: '/orginone/kernel/rest/' + methodName,
      headers: {
        Authorization: this.accessToken,
      },
      data: args,
    });
    if (res.data && (res.data as model.ResultType<any>)) {
      const result = res.data as model.ResultType<any>;
      if (!result.success) {
        if (result.code === 401) {
          logger.unauth();
        } else {
          logger.warn('操作失败,' + result.msg);
        }
      }
      return result;
    }
    return model.badRequest();
  }
}
