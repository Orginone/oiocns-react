import StoreHub from './storehub';
import * as model from '../model';
import type * as schema from '../schema';
import { logger } from '../common';
/**
 * 资产共享云内核api
 */
export default class KernelApi {
  // 当前用户
  user: schema.XTarget | undefined;
  // 存储集线器
  private _storeHub: StoreHub;
  // 单例
  private static _instance: KernelApi;
  // 必达消息缓存
  private _cacheData: any = {};
  // 当前连接ID
  private _connectionId: string = '';
  // 监听方法
  private _methods: { [name: string]: ((...args: any[]) => void)[] };
  // 订阅方法
  private _subMethods: {
    [name: string]: {
      keys: string[];
      operation: (...args: any[]) => void;
    }[];
  };
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
      this._storeHub.send<string>('GetConnectionId').then((id) => {
        if (id && id.length > 0) {
          this._connectionId = id;
        }
      });
      this.tokenAuth().then((success) => {
        if (success) {
          logger.info('连接到内核成功!');
        }
      });
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
   * 链接ID
   * @returns {string} 链接ID
   */
  public get connectionId(): string {
    return this._connectionId;
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
    const result = await this._storeHub.invoke('Online');
    if (result.success && result.data) {
      return result.data;
    }
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
   * 创建节点网关信息
   * @param {model.WorkGatewayModel} params 请求参数
   * @returns {model.ResultType<schema.XWorkGateway>} 请求结果
   */
  public async createWorkGeteway(
    params: model.WorkGatewayModel,
  ): Promise<model.ResultType<schema.XWorkGateway>> {
    return await this.request({
      module: 'work',
      action: 'CreateWorkGeteway',
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
   * 删除节点网关
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteWorkGateway(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'work',
      action: 'DeleteWorkGateway',
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
   * 查询办事网关节点信息
   * @param {model.GetWorkGatewaysModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XWorkGateway>>} 请求结果
   */
  public async queryWorkGateways(
    params: model.GetWorkGatewaysModel,
  ): Promise<model.ResultType<model.PageResult<schema.XWorkGateway>>> {
    return await this.request({
      module: 'work',
      action: 'QueryWorkGateways',
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
   * 根据ID查询流程实例
   * @param  过滤参数
   * @returns {schema.XWorkInstance | undefined} 流程实例对象
   */
  public async findInstance(
    belongId: string,
    instanceId: string,
  ): Promise<schema.XWorkInstance | undefined> {
    const res = await this.dataProxy({
      module: 'Collection',
      action: 'Load',
      belongId,
      params: {
        options: {
          match: {
            id: instanceId,
          },
          limit: 1,
          lookup: {
            from: 'work-task',
            localField: 'id',
            foreignField: 'instanceId',
            as: 'tasks',
          },
        },
        collName: 'work-instance',
      },
      relations: [],
      flag: '-work-instance-',
    });
    if (res.success && res.data && res.data.data) {
      if (Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data[0];
      }
    }
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
      flag: 'diskInfo',
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
      flag: key,
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
      flag: key,
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
      flag: key,
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
      flag: collName,
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
      flag: collName,
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
      flag: collName,
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
      flag: collName,
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
      flag: collName,
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
    collName: string,
    options: any,
  ): Promise<model.LoadResult<T>> {
    options.belongId = belongId;
    const res = await this.dataProxy({
      module: 'Collection',
      action: 'Load',
      belongId,
      params: {
        ...options,
        collName: collName,
      },
      relations,
      flag: `-${collName}`,
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
      flag: collName,
      belongId,
      relations,
      params: { collName, options },
    });
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
      flag: 'bucketOpreate',
      params: data,
    });
  }
  /**
   * 加载物
   * @param  过滤参数
   * @returns {model.LoadResult<T>} 移除异步结果
   */
  public async loadThing(
    belongId: string,
    relations: string[],
    options: any,
  ): Promise<model.LoadResult<schema.XThing[]>> {
    options.belongId = belongId;
    const res = await this.dataProxy({
      module: 'Thing',
      action: 'Load',
      belongId,
      relations,
      flag: 'loadThing',
      params: options,
    });
    return { ...res, ...res.data };
  }
  /**
   * 创建物
   * @param name 物的名称
   * @returns {model.ResultType<schema.XThing>} 移除异步结果
   */
  public async createThing(
    belongId: string,
    relations: string[],
    name: string,
  ): Promise<model.ResultType<schema.XThing>> {
    return await this.dataProxy({
      module: 'Thing',
      action: 'Create',
      flag: 'createThing',
      belongId,
      relations,
      params: name,
    });
  }
  /**
   * 请求一个内核授权方法
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async auth<T>(action: string, params: any): Promise<model.ResultType<T>> {
    const res = await this._storeHub.invoke('Auth', {
      module: 'auth',
      action: action,
      params: params,
    });
    if (
      res.success &&
      res.data &&
      typeof res.data === 'object' &&
      'accessToken' in res.data
    ) {
      this.accessToken = res.data.accessToken;
      await this.tokenAuth();
    }
    return res;
  }
  /**
   * 根据token获取用户信息
   */
  public async tokenAuth(): Promise<boolean> {
    if (this.accessToken?.length > 0) {
      const res = await this._storeHub.invoke('TokenAuth', this.accessToken);
      if (res.success) {
        this.user = res.data;
        return true;
      }
    }
    return false;
  }
  /**
   * 由内核代理一个http请求
   * @param {model.HttpRequestType} reqs 请求体
   * @returns 异步结果
   */
  public async httpForward(
    req: model.HttpRequestType,
  ): Promise<model.ResultType<model.HttpResponseType>> {
    return await this._storeHub.invoke('HttpForward', req);
  }
  /**
   * 请求一个数据核方法
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async dataProxy(req: model.DataProxyType): Promise<model.ResultType<any>> {
    return await this._storeHub.invoke('DataProxy', req);
  }
  /**
   * 数据变更通知
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async dataNotify(req: model.DataNotityType): Promise<model.ResultType<boolean>> {
    if (req.ignoreSelf && this._storeHub.isConnected && this._connectionId.length > 0) {
      req.ignoreConnectionId = this._connectionId;
    }
    return await this._storeHub.invoke('DataNotify', req);
  }
  /**
   * 请求一个内核方法
   * @param {ReqestType} reqs 请求体
   * @returns 异步结果
   */
  public async request(req: model.ReqestType): Promise<model.ResultType<any>> {
    return await this._storeHub.invoke('Request', req);
  }
  /**
   * 请求多个内核方法,使用同一个事务
   * @param {model.ResultType<any>[]} reqs 请求体
   * @returns 异步结果
   */
  public async requests(reqs: model.ReqestType[]): Promise<model.ResultType<any>> {
    return await this._storeHub.invoke('Requests', reqs);
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
          if (data.ignoreConnectionId === this._connectionId) {
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
            const _cache = this._cacheData[flag] || [];
            this._cacheData[flag] = [..._cache, data.data];
          }
        }
        break;
      case 'QrAuth':
        this.accessToken = res.data;
        logger.qrauthed();
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
}
