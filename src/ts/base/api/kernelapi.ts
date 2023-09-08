import StoreHub from './storehub';
import * as model from '../model';
import type * as schema from '../schema';
import axios from 'axios';
import {
  Emitter,
  blobToDataUrl,
  encodeKey,
  generateUuid,
  logger,
  sliceFile,
} from '../common';
import { command } from '../common/command';
/**
 * 资产共享云内核api
 */
export default class KernelApi {
  // 存储集线器
  private _storeHub: StoreHub;
  // axios实例
  private readonly _axiosInstance = axios.create({});
  // 单例
  private static _instance: KernelApi;
  // 订阅方法
  private _methods: { [name: string]: ((...args: any[]) => void)[] };
  // 订阅回调字典
  private _subscribeCallbacks: Record<string, (data: any) => void>;
  // 上下线提醒
  onlineNotity = new Emitter();
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
    this._subscribeCallbacks = {};
    this._storeHub = new StoreHub(url, 'json');
    this._storeHub.on('Receive', (res) => this._receive(res));
    this._storeHub.on('Updated', (belongId, key, data) => {
      this._updated(belongId, key, data);
    });
    this._storeHub.onConnected(() => {
      if (this.accessToken.length > 0) {
        this._storeHub
          .invoke('TokenAuth', this.accessToken)
          .then((res: model.ResultType<any>) => {
            if (res.success) {
              logger.info('连接到内核成功!');
              Object.keys(this._subscribeCallbacks).forEach(async (fullKey) => {
                const key = fullKey.split('|')[0];
                const belongId = fullKey.split('|')[1];
                this.subscribed(belongId, key, this._subscribeCallbacks[fullKey]);
              });
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
          this.onlineNotity.changCallback();
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
  ): Promise<model.ResultType<boolean>> {
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
   * 创建即时消息
   * @param {model.MsgSendModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async createImMsg(
    params: model.MsgSendModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'chat',
      action: 'CreateImMsg',
      params: params,
    });
  }
  /**
   * 创建组织变更消息
   * @param {model.TargetMessageModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async createTargetMsg(
    params: model.TargetMessageModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'chat',
      action: 'CreateTargetMsg',
      params: params,
    });
  }
  /**
   * 创建组织变更消息
   * @param {model.IdentityMessageModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async createIdentityMsg(
    params: model.IdentityMessageModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'chat',
      action: 'CreateIdentityMsg',
      params: params,
    });
  }
  /**
   * 消息撤回
   * @param {model.MsgSaveModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async recallImMsg(
    params: model.MsgSaveModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'chat',
      action: 'RecallImMsg',
      params: params,
    });
  }
  /**
   * 标记消息
   * @param {model.MsgTagModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async tagImMsg(params: model.MsgTagModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'chat',
      action: 'TagImMsg',
      params: params,
    });
  }
  /**
   * 创建目录
   * @param {model.DirectoryModel} params 请求参数
   * @returns {model.ResultType<schema.XDirectory>} 请求结果
   */
  public async createDirectory(
    params: model.DirectoryModel,
  ): Promise<model.ResultType<schema.XDirectory>> {
    return await this.request({
      module: 'thing',
      action: 'CreateDirectory',
      params: params,
    });
  }
  /**
   * 创建元属性
   * @param {model.PropertyModel} params 请求参数
   * @returns {model.ResultType<schema.XProperty>} 请求结果
   */
  public async createProperty(
    params: model.PropertyModel,
  ): Promise<model.ResultType<schema.XProperty>> {
    return await this.request({
      module: 'thing',
      action: 'CreateProperty',
      params: params,
    });
  }
  /**
   * 创建分类
   * @param {model.SpeciesModel} params 请求参数
   * @returns {model.ResultType<schema.XSpecies>} 请求结果
   */
  public async createSpecies(
    params: model.SpeciesModel,
  ): Promise<model.ResultType<schema.XSpecies>> {
    return await this.request({
      module: 'thing',
      action: 'CreateSpecies',
      params: params,
    });
  }
  /**
   * 创建分类
   * @param {model.SpeciesItemModel} params 请求参数
   * @returns {model.ResultType<schema.XSpeciesItem>} 请求结果
   */
  public async createSpeciesItem(
    params: model.SpeciesItemModel,
  ): Promise<model.ResultType<schema.XSpeciesItem>> {
    return await this.request({
      module: 'thing',
      action: 'CreateSpeciesItem',
      params: params,
    });
  }
  /**
   * 创建特性
   * @param {model.AttributeModel} params 请求参数
   * @returns {model.ResultType<schema.XAttribute>} 请求结果
   */
  public async createAttribute(
    params: model.AttributeModel,
  ): Promise<model.ResultType<schema.XAttribute>> {
    return await this.request({
      module: 'thing',
      action: 'CreateAttribute',
      params: params,
    });
  }
  /**
   * 创建表单
   * @param {model.FormModel} params 请求参数
   * @returns {model.ResultType<schema.XForm>} 请求结果
   */
  public async createForm(
    params: model.FormModel,
  ): Promise<model.ResultType<schema.XForm>> {
    return await this.request({
      module: 'thing',
      action: 'CreateForm',
      params: params,
    });
  }
  /**
   * 创建应用
   * @param {model.ApplicationModel} params 请求参数
   * @returns {model.ResultType<schema.XApplication>} 请求结果
   */
  public async createApplication(
    params: model.ApplicationModel,
  ): Promise<model.ResultType<schema.XApplication>> {
    return await this.request({
      module: 'thing',
      action: 'CreateApplication',
      params: params,
    });
  }
  /**
   * 删除目录
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteDirectory(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteDirectory',
      params: params,
    });
  }
  /**
   * 删除元属性
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteProperty(params: model.IdModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteProperty',
      params: params,
    });
  }
  /**
   * 删除分类
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteSpecies(params: model.IdModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteSpecies',
      params: params,
    });
  }
  /**
   * 删除分类类目
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteSpeciesItem(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteSpeciesItem',
      params: params,
    });
  }
  /**
   * 删除度量标准
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteAttribute(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteAttribute',
      params: params,
    });
  }
  /**
   * 删除表单
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteForm(params: model.IdModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteForm',
      params: params,
    });
  }
  /**
   * 删除应用
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteApplication(
    params: model.IdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteApplication',
      params: params,
    });
  }
  /**
   * 删除物
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteThing(params: model.IdModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteThing',
      params: params,
    });
  }
  /**
   * 更新目录
   * @param {model.DirectoryModel} params 请求参数
   * @returns {model.ResultType<schema.XDirectory>} 请求结果
   */
  public async updateDirectory(
    params: model.DirectoryModel,
  ): Promise<model.ResultType<schema.XDirectory>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateDirectory',
      params: params,
    });
  }
  /**
   * 更新元属性
   * @param {model.PropertyModel} params 请求参数
   * @returns {model.ResultType<schema.XProperty>} 请求结果
   */
  public async updateProperty(
    params: model.PropertyModel,
  ): Promise<model.ResultType<schema.XProperty>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateProperty',
      params: params,
    });
  }
  /**
   * 更新分类
   * @param {model.SpeciesModel} params 请求参数
   * @returns {model.ResultType<schema.XSpecies>} 请求结果
   */
  public async updateSpecies(
    params: model.SpeciesModel,
  ): Promise<model.ResultType<schema.XSpecies>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateSpecies',
      params: params,
    });
  }
  /**
   * 更新分类类目
   * @param {model.SpeciesItemModel} params 请求参数
   * @returns {model.ResultType<schema.XSpeciesItem>} 请求结果
   */
  public async updateSpeciesItem(
    params: model.SpeciesItemModel,
  ): Promise<model.ResultType<schema.XSpeciesItem>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateSpeciesItem',
      params: params,
    });
  }
  /**
   * 更新度量标准
   * @param {model.AttributeModel} params 请求参数
   * @returns {model.ResultType<schema.XAttribute>} 请求结果
   */
  public async updateAttribute(
    params: model.AttributeModel,
  ): Promise<model.ResultType<schema.XAttribute>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateAttribute',
      params: params,
    });
  }
  /**
   * 更新表单
   * @param {model.FormModel} params 请求参数
   * @returns {model.ResultType<schema.XForm>} 请求结果
   */
  public async updateForm(
    params: model.FormModel,
  ): Promise<model.ResultType<schema.XForm>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateForm',
      params: params,
    });
  }
  /**
   * 更新应用
   * @param {model.ApplicationModel} params 请求参数
   * @returns {model.ResultType<schema.XApplication>} 请求结果
   */
  public async updateApplication(
    params: model.ApplicationModel,
  ): Promise<model.ResultType<schema.XApplication>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateApplication',
      params: params,
    });
  }
  /**
   * 更新物
   * @param {model.ThingModel} params 请求参数
   * @returns {model.ResultType<schema.XThing>} 请求结果
   */
  public async updateThing(
    params: model.ThingModel,
  ): Promise<model.ResultType<schema.XThing>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateThing',
      params: params,
    });
  }
  /**
   * 完善物的属性数据
   * @param {model.SetPropModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async thingSetProperty(
    params: model.SetPropModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'ThingSetProperty',
      params: params,
    });
  }
  /**
   * 查询用户目录集
   * @param {model.GetDirectoryModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XDirectory>>} 请求结果
   */
  public async queryDirectorys(
    params: model.GetDirectoryModel,
  ): Promise<model.ResultType<model.PageResult<schema.XDirectory>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryDirectorys',
      params: params,
    });
  }
  /**
   * 查询用户属性集
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XProperty>>} 请求结果
   */
  public async queryPropertys(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XProperty>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryPropertys',
      params: params,
    });
  }
  /**
   * 查询用户属性关联的特性
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XAttribute>>} 请求结果
   */
  public async queryPropAttributes(
    params: model.IdModel,
  ): Promise<model.ResultType<model.PageResult<schema.XAttribute>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryPropAttributes',
      params: params,
    });
  }
  /**
   * 查询用户分类集
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XSpecies>>} 请求结果
   */
  public async querySpecies(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XSpecies>>> {
    return await this.request({
      module: 'thing',
      action: 'QuerySpecies',
      params: params,
    });
  }
  /**
   * 查询分类类目
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XSpeciesItem>>} 请求结果
   */
  public async querySpeciesItems(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XSpeciesItem>>> {
    return await this.request({
      module: 'thing',
      action: 'QuerySpeciesItems',
      params: params,
    });
  }
  /**
   * 查询用户的表单
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XForm>>} 请求结果
   */
  public async queryForms(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XForm>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryForms',
      params: params,
    });
  }
  /**
   * 查询用户的应用
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XApplication>>} 请求结果
   */
  public async queryApplications(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XApplication>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryApplications',
      params: params,
    });
  }
  /**
   * 查询分类的度量标准
   * @param {model.GainModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XAttribute>>} 请求结果
   */
  public async queryFormAttributes(
    params: model.GainModel,
  ): Promise<model.ResultType<model.PageResult<schema.XAttribute>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryFormAttributes',
      params: params,
    });
  }
  /**
   * 物的属性值查询
   * @param {model.GiveModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XThingProp>>} 请求结果
   */
  public async queryThingProperty(
    params: model.GiveModel,
  ): Promise<model.ResultType<model.PageResult<schema.XThingProp>>> {
    return await this.request({
      module: 'thing',
      action: 'QueryThingProperty',
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
    console.log(params);
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
   * 查询审批记录
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XWorkRecord>>} 请求结果
   */
  public async queryWorkRecord(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XWorkRecord>>> {
    return await this.request({
      module: 'work',
      action: 'QueryWorkRecord',
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
   * 查询办事实例
   * @param {model.IdModel} params 请求参数
   * @returns {model.ResultType<schema.XWorkInstance>} 请求结果
   */
  public async queryWorkInstanceById(
    params: model.IdModel,
  ): Promise<model.ResultType<schema.XWorkInstance>> {
    return await this.request({
      module: 'work',
      action: 'QueryWorkInstanceById',
      params: params,
    });
  }
  /**
   * 查询我的申请
   * @param {model.IdPageModel} params 请求参数
   * @returns {model.ResultType<model.PageResult<schema.XWorkTask>>} 请求结果
   */
  public async queryMyApply(
    params: model.IdPageModel,
  ): Promise<model.ResultType<model.PageResult<schema.XWorkTask>>> {
    return await this.request({
      module: 'work',
      action: 'QueryMyApply',
      params: params,
    });
  }
  /**
   * 获取对象数据
   * @param {string} belongId 对象所在的归属用户ID
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @returns {model.ResultType<T>} 对象异步结果
   */
  public async objectGet<T>(belongId: string, key: string): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Object',
      action: 'Get',
      belongId,
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
    key: string,
    setData: any,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Object',
      action: 'Set',
      belongId,
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
    key: string,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Object',
      action: 'Delete',
      belongId,
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
    collName: string,
    data: T,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Insert',
      belongId,
      params: { collName, data },
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
    collName: string,
    replace: T,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Replace',
      belongId,
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
    collName: string,
    update: any,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Update',
      belongId,
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
    collName: string,
    match: any,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Remove',
      belongId,
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
    options: any,
  ): Promise<model.LoadResult<T>> {
    options.belongId = belongId;
    const res = await this.dataProxy({
      module: 'Collection',
      action: 'Load',
      belongId,
      params: options,
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
    collName: string,
    options: any,
  ): Promise<model.ResultType<any>> {
    return await this.dataProxy({
      module: 'Collection',
      action: 'Aggregate',
      belongId,
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
    collName: string,
    options: any,
    page: model.PageModel,
  ): Promise<model.ResultType<model.PageResult<T>>> {
    const total = await this.collectionAggregate(belongId, collName, options);
    if (total.data && Array.isArray(total.data) && total.data.length > 0) {
      options.skip = page.offset;
      options.limit = page.limit;
      const res = await this.collectionAggregate(belongId, collName, options);
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
    data: model.BucketOpreateModel,
  ): Promise<model.ResultType<T>> {
    return await this.dataProxy({
      module: 'Bucket',
      action: 'Operate',
      belongId,
      params: data,
    });
  }
  /**
   * 文件上传
   * @param file 文件
   * @param name 名称
   * @param key 路径
   */
  public async fileUpdate(
    belongId: string,
    file: Blob,
    key: string,
    progress: (p: number) => void,
  ): Promise<model.FileItemModel | undefined> {
    const id = generateUuid();
    const data: model.BucketOpreateModel = {
      key: encodeKey(key),
      operate: model.BucketOpreates.Upload,
    };
    progress.apply(this, [0]);
    const slices = sliceFile(file, 1024 * 1024);
    for (let i = 0; i < slices.length; i++) {
      const s = slices[i];
      data.fileItem = {
        index: i,
        uploadId: id,
        size: file.size,
        data: [],
        dataUrl: await blobToDataUrl(s),
      };
      const res = await this.bucketOpreate<model.FileItemModel>(belongId, data);
      if (!res.success) {
        data.operate = model.BucketOpreates.AbortUpload;
        await this.bucketOpreate<boolean>(belongId, data);
        progress.apply(this, [-1]);
        return;
      }
      const finished = i * 1024 * 1024 + s.size;
      progress.apply(this, [finished]);
      if (finished === file.size && res.data) {
        return res.data;
      }
    }
  }
  /**
   * 加载物
   * @param  过滤参数
   * @returns {model.ResultType<T>} 移除异步结果
   */
  public async loadThing<T>(
    belongId: string,
    options: any,
  ): Promise<model.ResultType<T>> {
    options.belongId = belongId;
    return await this.dataProxy({
      module: 'Thing',
      action: 'Load',
      belongId,
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
    name: string,
  ): Promise<model.ResultType<model.AnyThingModel>> {
    return await this.dataProxy({
      module: 'Thing',
      action: 'Create',
      belongId,
      params: name,
    });
  }
  /**
   * 订阅对象变更
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @param {(data:any)=>void} callback 变更回调，默认回调一次
   * @returns {void} 无返回值
   */
  public subscribed<T>(belongId: string, key: string, callback: (data: T) => void): void {
    if (callback) {
      const fullKey = key + '|' + belongId;
      this._subscribeCallbacks[fullKey] = callback;
      if (this._storeHub.isConnected) {
        this._storeHub
          .invoke('Subscribed', belongId, key)
          .then((res: model.ResultType<T>) => {
            if (res.success && res.data) {
              callback.apply(this, [res.data]);
            }
          })
          .catch((err) => {
            logger.error(err);
          });
      }
    }
  }
  /**
   * 取消订阅对象变更
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {void} 无返回值
   */
  public unSubscribed(belongId: string, key: string): void {
    const fullKey = key + '|' + belongId;
    if (this._subscribeCallbacks[fullKey] && this._storeHub.isConnected) {
      this._storeHub
        .invoke('UnSubscribed', belongId, key)
        .then(() => {
          console.debug(`${key}取消订阅成功.`);
        })
        .catch((err) => {
          logger.error(err);
        });
    }
    delete this._subscribeCallbacks[fullKey];
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
              this.onlineNotity.changCallback();
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
   * 对象变更通知
   * @param key 主键
   * @param data 数据
   * @returns {void} 无返回值
   */
  private _updated(belongId: string, key: string, data: any): void {
    const lfullkey = key + '|' + belongId;
    Object.keys(this._subscribeCallbacks).forEach((fullKey) => {
      if (fullKey === lfullkey) {
        const callback: (data: any) => void = this._subscribeCallbacks[fullKey];
        if (callback) {
          callback.call(callback, data);
        }
      }
    });
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
