import AnyStore from './anystore';
import StoreHub from './storehub';
import * as model from '../model';
import type * as schema from '../schema';
import axios from 'axios';
import { logger } from '../common';
import { kernel } from '..';
/**
 * 奥集能内核api
 */
export default class KernelApi {
  // 存储集线器
  private _storeHub: StoreHub;
  // axios实例
  private readonly _axiosInstance = axios.create({});
  // 单例
  private static _instance: KernelApi;
  // 任意数据存储对象
  private _anystore: AnyStore;
  // 订阅方法
  private _methods: { [name: string]: ((...args: any[]) => void)[] };
  /**
   * 私有构造方法
   * @param url 远端地址
   */
  private constructor(url: string) {
    this._methods = {};
    this._anystore = AnyStore.getInstance();
    this._storeHub = new StoreHub(url, 'json');
    this._storeHub.on('Receive', (res: model.ReceiveType) => {
      const methods = this._methods[res.target.toLowerCase()];
      if (methods) {
        try {
          methods.forEach((m) => m.apply(this, [res.data]));
        } catch (e) {
          logger.error(e as Error);
        }
      }
    });
    this._storeHub.onConnected(() => {
      if (this._anystore.accessToken.length > 0) {
        this._storeHub
          .invoke('TokenAuth', this._anystore.accessToken)
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
   * 任意数据存储对象
   * @returns {AnyStore | undefined} 可能为空的存储对象
   */
  public get anystore(): AnyStore {
    return this._anystore;
  }
  /**
   * 是否在线
   * @returns {boolean} 在线状态
   */
  public get isOnline(): boolean {
    return this._storeHub.isConnected;
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
      this._anystore.updateToken(res.data.accessToken);
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
      this._anystore.updateToken(res.data.accessToken);
    }
    return res;
  }
  /**
   * 生成单位token
   * @param comapnyId 单位id
   * @returns 生成后的token
   */
  public async genToken(comapnyId: string): Promise<model.ResultType<string>> {
    var res: model.ResultType<any>;
    if (this._storeHub.isConnected) {
      res = await this._storeHub.invoke('GenToken', comapnyId);
    } else {
      res = await this._restRequest('gentoken', comapnyId);
    }
    if (res.success) {
      kernel._anystore.updateToken(res.data);
    }
    return res;
  }
  /**
   * 创建字典类型
   * @param {model.DictModel} params 请求参数
   * @returns {model.ResultType<schema.XDict>} 请求结果
   */
  public async createDict(
    params: model.DictModel,
  ): Promise<model.ResultType<schema.XDict>> {
    return await this.request({
      module: 'thing',
      action: 'CreateDict',
      params: params,
    });
  }
  /**
   * 创建字典项
   * @param {model.DictItemModel} params 请求参数
   * @returns {model.ResultType<schema.XDictItem>} 请求结果
   */
  public async createDictItem(
    params: model.DictItemModel,
  ): Promise<model.ResultType<schema.XDictItem>> {
    return await this.request({
      module: 'thing',
      action: 'CreateDictItem',
      params: params,
    });
  }
  /**
   * 删除字典类型
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteDict(params: model.IdReqModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteDict',
      params: params,
    });
  }
  /**
   * 删除字典项
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteDictItem(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteDictItem',
      params: params,
    });
  }
  /**
   * 更新字典类型
   * @param {model.DictModel} params 请求参数
   * @returns {model.ResultType<schema.XDict>} 请求结果
   */
  public async updateDict(
    params: model.DictModel,
  ): Promise<model.ResultType<schema.XDict>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateDict',
      params: params,
    });
  }
  /**
   * 更新字典项
   * @param {model.DictItemModel} params 请求参数
   * @returns {model.ResultType<schema.XDictItem>} 请求结果
   */
  public async updateDictItem(
    params: model.DictItemModel,
  ): Promise<model.ResultType<schema.XDictItem>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateDictItem',
      params: params,
    });
  }
  /**
   * 创建类别
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
   * 创建度量标准
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
   * 创建业务标准
   * @param {model.OperationModel} params 请求参数
   * @returns {model.ResultType<schema.XOperation>} 请求结果
   */
  public async createOperation(
    params: model.OperationModel,
  ): Promise<model.ResultType<schema.XOperation>> {
    return await this.request({
      module: 'thing',
      action: 'CreateOperation',
      params: params,
    });
  }
  /**
   * 创建业务标准项
   * @param {model.OperationModel} params 请求参数
   * @returns {model.ResultType<schema.XOperation>} 请求结果
   */
  public async createOperationItem(
    params: model.OperationItemModel,
  ): Promise<model.ResultType<schema.XOperationItem>> {
    return await this.request({
      module: 'thing',
      action: 'CreateOperationItem',
      params: params,
    });
  }
  /**
   * 创建物
   * @param {model.ThingModel} params 请求参数
   * @returns {model.ResultType<schema.XThing>} 请求结果
   */
  public async createThing(
    params: model.ThingModel,
  ): Promise<model.ResultType<schema.XThing>> {
    return await this.request({
      module: 'thing',
      action: 'CreateThing',
      params: params,
    });
  }
  /**
   * 删除类别
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteSpecies(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteSpecies',
      params: params,
    });
  }
  /**
   * 删除度量标准
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteAttribute(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteAttribute',
      params: params,
    });
  }
  /**
   * 删除业务标准
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteOperation(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteOperation',
      params: params,
    });
  }
  /**
   * 删除业务标准项
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteOperationItem(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteOperationItem',
      params: params,
    });
  }
  /**
   * 删除物
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteThing(params: model.IdReqModel): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'DeleteThing',
      params: params,
    });
  }
  /**
   * 更新类别
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
   * 更新业务标准
   * @param {model.OperationModel} params 请求参数
   * @returns {model.ResultType<schema.XOperation>} 请求结果
   */
  public async updateOperation(
    params: model.OperationModel,
  ): Promise<model.ResultType<schema.XOperation>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateOperation',
      params: params,
    });
  }
  /**
   * 更新业务标准项
   * @param {model.OperationModel} params 请求参数
   * @returns {model.ResultType<schema.XOperationItem>} 请求结果
   */
  public async updateOperationItem(
    params: model.OperationItemModel,
  ): Promise<model.ResultType<schema.XOperationItem>> {
    return await this.request({
      module: 'thing',
      action: 'UpdateOperationItem',
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
   * 物添加类别
   * @param {model.ThingSpeciesModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async thingAddSpecies(
    params: model.ThingSpeciesModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'ThingAddSpecies',
      params: params,
    });
  }
  /**
   * 物添加度量数据
   * @param {model.ThingAttrModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async thingAddAttribute(
    params: model.ThingAttrModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'ThingAddAttribute',
      params: params,
    });
  }
  /**
   * 物移除类别
   * @param {model.ThingSpeciesModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async thingRemoveSpecies(
    params: model.ThingSpeciesModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'ThingRemoveSpecies',
      params: params,
    });
  }
  /**
   * 物移除度量数据
   * @param {model.ThingAttrModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async thingRemoveAttribute(
    params: model.ThingAttrModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'thing',
      action: 'ThingRemoveAttribute',
      params: params,
    });
  }
  /**
   * 查询分类树
   * @param {string} targetId 组织ID
   * @returns {model.ResultType<schema.XSpecies>} 请求结果
   */
  public async querySpeciesTree(
    targetId: string,
    filter: string,
  ): Promise<model.ResultType<schema.XSpecies>> {
    return await this.request({
      module: 'thing',
      action: 'QuerySpeciesTree',
      params: {
        id: targetId,
        page: {
          filter: filter,
        },
      },
    });
  }
  /**
   * 查询分类的度量标准
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XAttributeArray>} 请求结果
   */
  public async querySpeciesAttrs(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XAttributeArray>> {
    return await this.request({
      module: 'thing',
      action: 'QuerySpeciesAttrs',
      params: params,
    });
  }

  /**
   * 查询分类的业务标准
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XOperationArray>} 请求结果
   */
  public async querySpeciesOperation(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XOperationArray>> {
    return await this.request({
      module: 'thing',
      action: 'QuerySpeciesOperation',
      params: params,
    });
  }
  /**
   * 查询分类的业务标准项
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XOperationItemArray>} 请求结果
   */
  public async queryOperationItems(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XOperationItemArray>> {
    return await this.request({
      module: 'thing',
      action: 'QueryOperationItems',
      params: params,
    });
  }
  /**
   * 查询分类字典
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XDictArray>} 请求结果
   */
  public async querySpeciesDict(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XDictArray>> {
    return await this.request({
      module: 'thing',
      action: 'QuerySpeciesDict',
      params: params,
    });
  }
  /**
   * 查询字典项
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XDictItemArray>} 请求结果
   */
  public async queryDictItems(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XDictItemArray>> {
    return await this.request({
      module: 'thing',
      action: 'QueryDictItems',
      params: params,
    });
  }
  /**
   * 物的元数据查询
   * @param {model.ThingAttrReq} params 请求参数
   * @returns {model.ResultType<schema.XThingAttrArray>} 请求结果
   */
  public async queryThingData(
    params: model.ThingAttrReq,
  ): Promise<model.ResultType<schema.XThingAttrArray>> {
    return await this.request({
      module: 'thing',
      action: 'QueryThingData',
      params: params,
    });
  }
  /**
   * 物的历史元数据查询
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XThingAttrHistroyArray>} 请求结果
   */
  public async queryThingHistroyData(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XThingAttrHistroyArray>> {
    return await this.request({
      module: 'thing',
      action: 'QueryThingHistroyData',
      params: params,
    });
  }
  /**
   * 物的关系元数据查询
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XRelationArray>} 请求结果
   */
  public async queryThingRelationData(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XRelationArray>> {
    return await this.request({
      module: 'thing',
      action: 'QueryThingRelationData',
      params: params,
    });
  }
  /**
   * 创建职权
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
   * 创建组织/个人
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
   * 创建标准规则
   * @param {model.RuleStdModel} params 请求参数
   * @returns {model.ResultType<schema.XRuleStd>} 请求结果
   */
  public async createRuleStd(
    params: model.RuleStdModel,
  ): Promise<model.ResultType<schema.XRuleStd>> {
    return await this.request({
      module: 'target',
      action: 'CreateRuleStd',
      params: params,
    });
  }
  /**
   * 删除职权
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteAuthority(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteAuthority',
      params: params,
    });
  }
  /**
   * 删除身份
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteIdentity(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteIdentity',
      params: params,
    });
  }
  /**
   * 删除组织/个人
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteTarget(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteTarget',
      params: params,
    });
  }
  /**
   * 删除标准规则
   * @param {model.RuleStdModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteRuleStd(
    params: model.RuleStdModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'DeleteRuleStd',
      params: params,
    });
  }
  /**
   * 递归删除组织/个人
   * @param {model.RecursiveReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async recursiveDeleteTarget(
    params: model.RecursiveReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RecursiveDeleteTarget',
      params: params,
    });
  }
  /**
   * 更新职权
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
   * 更新组织/个人
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
   * 更新标准规则
   * @param {model.RuleStdModel} params 请求参数
   * @returns {model.ResultType<schema.XRuleStd>} 请求结果
   */
  public async updateRuleStd(
    params: model.RuleStdModel,
  ): Promise<model.ResultType<schema.XRuleStd>> {
    return await this.request({
      module: 'target',
      action: 'UpdateRuleStd',
      params: params,
    });
  }
  /**
   * 分配身份
   * @param {model.GiveIdentityModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async giveIdentity(
    params: model.GiveIdentityModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'GiveIdentity',
      params: params,
    });
  }
  /**
   * 移除身份
   * @param {model.GiveIdentityModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeIdentity(
    params: model.GiveIdentityModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RemoveIdentity',
      params: params,
    });
  }
  /**
   * 申请加入组织/个人
   * @param {model.JoinTeamModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async applyJoinTeam(
    params: model.JoinTeamModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'ApplyJoinTeam',
      params: params,
    });
  }
  /**
   * 加入组织/个人申请审批
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<schema.XRelation>} 请求结果
   */
  public async joinTeamApproval(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<schema.XRelation>> {
    return await this.request({
      module: 'target',
      action: 'JoinTeamApproval',
      params: params,
    });
  }
  /**
   * 拉组织/个人加入组织/个人的团队
   * @param {model.TeamPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async pullAnyToTeam(
    params: model.TeamPullModel,
  ): Promise<model.ResultType<schema.XRelationArray>> {
    return await this.request({
      module: 'target',
      action: 'PullAnyToTeam',
      params: params,
    });
  }
  /**
   * 拉身份加入组织
   * @param {model.TeamPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async PullIdentityToTeam(
    params: model.TeamPullModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'PullIdentityToTeam',
      params: params,
    });
  }
  /**
   * 取消申请加入组织/个人
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async cancelJoinTeam(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'CancelJoinTeam',
      params: params,
    });
  }
  /**
   * 从组织/个人移除组织/个人的团队
   * @param {model.TeamPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeAnyOfTeam(
    params: model.TeamPullModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RemoveAnyOfTeam',
      params: params,
    });
  }
  /**
   * 从组织身份集中剔除身份
   * @param {model.GiveIdentityModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeTeamIdentity(
    params: model.GiveIdentityModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RemoveTeamIdentity',
      params: params,
    });
  }
  /**
   * 递归从组织及子组织/个人移除组织/个人的团队
   * @param {model.TeamPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async recursiveRemoveAnyOfTeam(
    params: model.TeamPullModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RecursiveRemoveAnyOfTeam',
      params: params,
    });
  }
  /**
   * 从组织/个人及归属组织移除组织/个人的团队
   * @param {model.TeamPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeAnyOfTeamAndBelong(
    params: model.TeamPullModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RemoveAnyOfTeamAndBelong',
      params: params,
    });
  }
  /**
   * 退出组织
   * @param {model.ExitTeamModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async exitAnyOfTeam(
    params: model.ExitTeamModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'ExitAnyOfTeam',
      params: params,
    });
  }
  /**
   * 递归退出组织
   * @param {model.ExitTeamModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async recursiveExitAnyOfTeam(
    params: model.ExitTeamModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'RecursiveExitAnyOfTeam',
      params: params,
    });
  }
  /**
   * 退出组织及退出组织归属的组织
   * @param {model.ExitTeamModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async exitAnyOfTeamAndBelong(
    params: model.ExitTeamModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'target',
      action: 'ExitAnyOfTeamAndBelong',
      params: params,
    });
  }
  /**
   * 根据ID查询组织/个人信息
   * @param {model.IdArrayReq} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async queryTargetById(
    params: model.IdArrayReq,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetById',
      params: params,
    });
  }
  /**
   * 查询加入关系
   * @param {model.RelationReq} params 请求参数
   * @returns {model.ResultType<schema.XRelationArray>} 请求结果
   */
  public async queryRelationById(
    params: model.RelationReq,
  ): Promise<model.ResultType<schema.XRelationArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryRelationById',
      params: params,
    });
  }
  /**
   * 根据名称和类型查询组织/个人
   * @param {model.NameTypeModel} params 请求参数
   * @returns {model.ResultType<schema.XTarget>} 请求结果
   */
  public async queryTargetByName(
    params: model.NameTypeModel,
  ): Promise<model.ResultType<schema.XTarget>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetByName',
      params: params,
    });
  }
  /**
   * 模糊查找组织/个人根据名称和类型
   * @param {model.NameTypeModel} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async searchTargetByName(
    params: model.NameTypeModel,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'SearchTargetByName',
      params: params,
    });
  }
  /**
   * 查询组织制定的标准
   * @param {model.IDBelongTargetReq} params 请求参数
   * @returns {model.ResultType<schema.XAttributeArray>} 请求结果
   */
  public async queryTeamRuleAttrs(
    params: model.IDBelongTargetReq,
  ): Promise<model.ResultType<schema.XAttributeArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTeamRuleAttrs',
      params: params,
    });
  }
  /**
   * 根据ID查询子组织/个人
   * @param {model.IDReqSubModel} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async querySubTargetById(
    params: model.IDReqSubModel,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'QuerySubTargetById',
      params: params,
    });
  }
  /**
   * 根据ID查询归属的组织/个人
   * @param {model.IDReqSubModel} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async queryBelongTargetById(
    params: model.IDReqSubModel,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryBelongTargetById',
      params: params,
    });
  }
  /**
   * 查询组织/个人加入的组织/个人
   * @param {model.IDReqJoinedModel} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async queryJoinedTargetById(
    params: model.IDReqJoinedModel,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryJoinedTargetById',
      params: params,
    });
  }
  /**
   * 查询加入组织/个人申请
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XRelationArray>} 请求结果
   */
  public async queryJoinTeamApply(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XRelationArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryJoinTeamApply',
      params: params,
    });
  }
  /**
   * 查询组织/个人加入审批
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XRelationArray>} 请求结果
   */
  public async queryTeamJoinApproval(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XRelationArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTeamJoinApproval',
      params: params,
    });
  }
  /**
   * 查询组织职权树
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XAuthority>} 请求结果
   */
  public async queryAuthorityTree(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XAuthority>> {
    return await this.request({
      module: 'target',
      action: 'QueryAuthorityTree',
      params: params,
    });
  }
  /**
   * 查询职权子职权
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XAuthorityArray>} 请求结果
   */
  public async querySubAuthoritys(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XAuthorityArray>> {
    return await this.request({
      module: 'target',
      action: 'QuerySubAuthoritys',
      params: params,
    });
  }
  /**
   * 查询组织职权
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XAuthorityArray>} 请求结果
   */
  public async queryTargetAuthoritys(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XAuthorityArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetAuthoritys',
      params: params,
    });
  }
  /**
   * 查询组织身份
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XIdentityArray>} 请求结果
   */
  public async queryTargetIdentitys(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XIdentityArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetIdentitys',
      params: params,
    });
  }
  /**
   * 查询组织容器下的身份集
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XIdentityArray>} 请求结果
   */
  public async queryTeamIdentitys(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XIdentityArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTeamIdentitys',
      params: params,
    });
  }
  /**
   * 查询职权身份
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XIdentityArray>} 请求结果
   */
  public async queryAuthorityIdentitys(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XIdentityArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryAuthorityIdentitys',
      params: params,
    });
  }
  /**
   * 查询赋予身份的组织/个人
   * @param {model.IDBelongTargetReq} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async queryIdentityTargets(
    params: model.IDBelongTargetReq,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryIdentityTargets',
      params: params,
    });
  }
  /**
   * 查询在当前空间拥有角色的组织
   * @param {model.SpaceAuthReq} params 请求参数
   * @returns {model.ResultType<schema.XTargetArray>} 请求结果
   */
  public async queryTargetsByAuthority(
    params: model.SpaceAuthReq,
  ): Promise<model.ResultType<schema.XTargetArray>> {
    return await this.request({
      module: 'target',
      action: 'QueryTargetsByAuthority',
      params: params,
    });
  }
  /**
   * 查询在当前空间拥有的身份
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<schema.XIdentityArray>} 请求结果
   */
  public async querySpaceIdentitys(
    params: model.IdReq,
  ): Promise<model.ResultType<schema.XIdentityArray>> {
    return await this.request({
      module: 'target',
      action: 'QuerySpaceIdentitys',
      params: params,
    });
  }
  /**
   * 创建即使消息
   * @param {model.ImMsgModel} params 请求参数
   * @returns {model.ResultType<schema.XImMsg>} 请求结果
   */
  public async createImMsg(
    params: model.ImMsgModel,
  ): Promise<model.ResultType<schema.XImMsg>> {
    return await this.request({
      module: 'chat',
      action: 'CreateImMsg',
      params: params,
    });
  }
  /**
   * 消息撤回
   * @param {schema.XImMsg} params 请求参数
   * @returns {model.ResultType<schema.XImMsg>} 请求结果
   */
  public async recallImMsg(
    params: schema.XImMsg,
  ): Promise<model.ResultType<schema.XImMsg>> {
    return await this.request({
      module: 'chat',
      action: 'RecallImMsg',
      params: params,
    });
  }
  /**
   * 查询聊天会话
   * @param {model.ChatsReqModel} params 请求参数
   * @returns {model.ResultType<model.ChatResponse>} 请求结果
   */
  public async queryImChats(
    params: model.ChatsReqModel,
  ): Promise<model.ResultType<model.ChatResponse>> {
    return await this.request({
      module: 'chat',
      action: 'QueryImChats',
      params: params,
    });
  }
  /**
   * 查询群历史消息
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XImMsgArray>} 请求结果
   */
  public async queryCohortImMsgs(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XImMsgArray>> {
    return await this.request({
      module: 'chat',
      action: 'QueryCohortImMsgs',
      params: params,
    });
  }
  /**
   * 查询好友聊天消息
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XImMsgArray>} 请求结果
   */
  public async queryFriendImMsgs(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XImMsgArray>> {
    return await this.request({
      module: 'chat',
      action: 'QueryFriendImMsgs',
      params: params,
    });
  }
  /**
   * 根据ID查询名称
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<model.NameModel>} 请求结果
   */
  public async queryNameBySnowId(
    snowId: string,
  ): Promise<model.ResultType<model.NameModel>> {
    return await this.request({
      module: 'chat',
      action: 'QueryNameBySnowId',
      params: {
        id: snowId,
      },
    });
  }
  /**
   * 创建市场
   * @param {model.MarketModel} params 请求参数
   * @returns {model.ResultType<schema.XMarket>} 请求结果
   */
  public async createMarket(
    params: model.MarketModel,
  ): Promise<model.ResultType<schema.XMarket>> {
    return await this.request({
      module: 'market',
      action: 'CreateMarket',
      params: params,
    });
  }
  /**
   * 产品上架:产品所有者
   * @param {model.MerchandiseModel} params 请求参数
   * @returns {model.ResultType<schema.XMerchandise>} 请求结果
   */
  public async createMerchandise(
    params: model.MerchandiseModel,
  ): Promise<model.ResultType<schema.XMerchandise>> {
    return await this.request({
      module: 'market',
      action: 'CreateMerchandise',
      params: params,
    });
  }
  /**
   * 创建产品
   * @param {model.ProductModel} params 请求参数
   * @returns {model.ResultType<schema.XProduct>} 请求结果
   */
  public async createProduct(
    params: model.ProductModel,
  ): Promise<model.ResultType<schema.XProduct>> {
    return await this.request({
      module: 'market',
      action: 'CreateProduct',
      params: params,
    });
  }
  /**
   * 创建产品资源
   * @param {model.ResourceModel} params 请求参数
   * @returns {model.ResultType<schema.XResource>} 请求结果
   */
  public async createProductResource(
    params: model.ResourceModel,
  ): Promise<model.ResultType<schema.XResource>> {
    return await this.request({
      module: 'market',
      action: 'CreateProductResource',
      params: params,
    });
  }
  /**
   * 商品加入暂存区
   * @param {model.StagingModel} params 请求参数
   * @returns {model.ResultType<schema.XStaging>} 请求结果
   */
  public async createStaging(
    params: model.StagingModel,
  ): Promise<model.ResultType<schema.XStaging>> {
    return await this.request({
      module: 'market',
      action: 'CreateStaging',
      params: params,
    });
  }
  /**
   * 创建订单:商品直接购买
   * @param {model.OrderModel} params 请求参数
   * @returns {model.ResultType<schema.XOrder>} 请求结果
   */
  public async createOrder(
    params: model.OrderModel,
  ): Promise<model.ResultType<schema.XOrder>> {
    return await this.request({
      module: 'market',
      action: 'CreateOrder',
      params: params,
    });
  }
  /**
   * 创建订单:暂存区下单
   * @param {model.OrderModelByStags} params 请求参数
   * @returns {model.ResultType<schema.XOrder>} 请求结果
   */
  public async createOrderByStags(
    params: model.OrderModelByStags,
  ): Promise<model.ResultType<schema.XOrder>> {
    return await this.request({
      module: 'market',
      action: 'CreateOrderByStags',
      params: params,
    });
  }
  /**
   * 创建订单支付
   * @param {model.OrderPayModel} params 请求参数
   * @returns {model.ResultType<schema.XOrderPay>} 请求结果
   */
  public async createOrderPay(
    params: model.OrderPayModel,
  ): Promise<model.ResultType<schema.XOrderPay>> {
    return await this.request({
      module: 'market',
      action: 'CreateOrderPay',
      params: params,
    });
  }
  /**
   * 创建对象拓展操作
   * @param {model.SourceExtendModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async createSourceExtend(
    params: model.SourceExtendModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'CreateSourceExtend',
      params: params,
    });
  }
  /**
   * 删除市场
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteMarket(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteMarket',
      params: params,
    });
  }
  /**
   * 下架商品:商品所有者
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteMerchandise(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteMerchandise',
      params: params,
    });
  }
  /**
   * 下架商品:市场管理员
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteMerchandiseByManager(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteMerchandiseByManager',
      params: params,
    });
  }
  /**
   * 删除产品
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteProduct(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteProduct',
      params: params,
    });
  }
  /**
   * 删除产品资源(产品所属者可以操作)
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteProductResource(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteProductResource',
      params: params,
    });
  }
  /**
   * 移除暂存区商品
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteStaging(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteStaging',
      params: params,
    });
  }
  /**
   * 创建对象拓展操作
   * @param {model.SourceExtendModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteSourceExtend(
    params: model.SourceExtendModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeleteSourceExtend',
      params: params,
    });
  }
  /**
   * 根据Code查询市场
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketArray>} 请求结果
   */
  public async queryMarketByCode(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryMarketByCode',
      params: params,
    });
  }
  /**
   * 查询拥有的市场
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketArray>} 请求结果
   */
  public async queryOwnMarket(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryOwnMarket',
      params: params,
    });
  }
  /**
   * 查询管理的市场
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketArray>} 请求结果
   */
  public async queryManageMarket(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryManageMarket',
      params: params,
    });
  }
  /**
   * 查询软件共享仓库的市场
   * @returns {model.ResultType<schema.XMarket>} 请求结果
   */
  public async getPublicMarket(): Promise<model.ResultType<schema.XMarketArray>> {
    return await this.request({
      module: 'market',
      action: 'GetPublicMarket',
      params: {},
    });
  }
  /**
   * 查询市场成员集合
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketRelationArray>} 请求结果
   */
  public async queryMarketMember(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryMarketMember',
      params: params,
    });
  }
  /**
   * 查询市场对应的暂存区
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XStagingArray>} 请求结果
   */
  public async queryStaging(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XStagingArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryStaging',
      params: params,
    });
  }
  /**
   * 根据ID查询订单信息
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<schema.XOrder>} 请求结果
   */
  public async getOrderInfo(
    params: model.IdReq,
  ): Promise<model.ResultType<schema.XOrder>> {
    return await this.request({
      module: 'market',
      action: 'GetOrderInfo',
      params: params,
    });
  }
  /**
   * 根据ID查询订单详情项
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XOrderDetail>} 请求结果
   */
  public async getOrderDetailById(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<schema.XOrderDetail>> {
    return await this.request({
      module: 'market',
      action: 'GetOrderDetailById',
      params: params,
    });
  }
  /**
   * 卖方:查询出售商品的订单列表
   * @param {model.IDStatusPageReq} params 请求参数
   * @returns {model.ResultType<schema.XOrderDetailArray>} 请求结果
   */
  public async querySellOrderList(
    params: model.IDStatusPageReq,
  ): Promise<model.ResultType<schema.XOrderDetailArray>> {
    return await this.request({
      module: 'market',
      action: 'QuerySellOrderList',
      params: params,
    });
  }
  /**
   * 卖方:查询指定商品的订单列表
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XOrderDetailArray>} 请求结果
   */
  public async querySellOrderListByMerchandise(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XOrderDetailArray>> {
    return await this.request({
      module: 'market',
      action: 'QuerySellOrderListByMerchandise',
      params: params,
    });
  }
  /**
   * 买方:查询购买订单列表
   * @param {model.IDStatusPageReq} params 请求参数
   * @returns {model.ResultType<schema.XOrderArray>} 请求结果
   */
  public async queryBuyOrderList(
    params: model.IDStatusPageReq,
  ): Promise<model.ResultType<schema.XOrderArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryBuyOrderList',
      params: params,
    });
  }
  /**
   * 查询订单支付信息
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XOrderPayArray>} 请求结果
   */
  public async queryPayList(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XOrderPayArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryPayList',
      params: params,
    });
  }
  /**
   * 申请者:查询加入市场申请
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketRelationArray>} 请求结果
   */
  public async queryJoinMarketApply(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryJoinMarketApply',
      params: params,
    });
  }
  /**
   * 管理者:查询加入市场申请
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketRelationArray>} 请求结果
   */
  public async queryJoinMarketApplyByManager(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryJoinMarketApplyByManager',
      params: params,
    });
  }
  /**
   * 申请者:查询商品上架申请
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMerchandiseArray>} 请求结果
   */
  public async queryMerchandiseApply(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryMerchandiseApply',
      params: params,
    });
  }
  /**
   * 市场:查询商品上架申请
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMerchandiseArray>} 请求结果
   */
  public async queryMerchandiesApplyByManager(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryMerchandiesApplyByManager',
      params: params,
    });
  }
  /**
   * 查询市场中所有商品
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMerchandiseArray>} 请求结果
   */
  public async searchMerchandise(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await this.request({
      module: 'market',
      action: 'SearchMerchandise',
      params: params,
    });
  }
  /**
   * 查询产品详细信息
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XProduct>} 请求结果
   */
  public async getProductInfo(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<schema.XProduct>> {
    return await this.request({
      module: 'market',
      action: 'GetProductInfo',
      params: params,
    });
  }
  /**
   * 查询产品资源列表
   * @param {model.IDWithBelongPageReq} params 请求参数
   * @returns {model.ResultType<schema.XResourceArray>} 请求结果
   */
  public async queryProductResource(
    params: model.IDWithBelongPageReq,
  ): Promise<model.ResultType<schema.XResourceArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryProductResource',
      params: params,
    });
  }
  /**
   * 查询组织/个人产品
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XProductArray>} 请求结果
   */
  public async querySelfProduct(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XProductArray>> {
    return await this.request({
      module: 'market',
      action: 'QuerySelfProduct',
      params: params,
    });
  }
  /**
   * 根据产品查询商品上架信息
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMerchandiseArray>} 请求结果
   */
  public async queryMerchandiseListByProduct(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryMerchandiseListByProduct',
      params: params,
    });
  }
  /**
   * 查询指定产品/资源的拓展信息
   * @param {model.SearchExtendReq} params 请求参数
   * @returns {model.ResultType<model.IdNameArray>} 请求结果
   */
  public async queryExtendBySource(
    params: model.SearchExtendReq,
  ): Promise<model.ResultType<model.IdNameArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryExtendBySource',
      params: params,
    });
  }
  /**
   * 查询可用产品
   * @param {model.UsefulProductReq} params 请求参数
   * @returns {model.ResultType<schema.XProductArray>} 请求结果
   */
  public async queryUsefulProduct(
    params: model.UsefulProductReq,
  ): Promise<model.ResultType<schema.XProductArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryUsefulProduct',
      params: params,
    });
  }
  /**
   * 查询可用资源列表
   * @param {model.UsefulResourceReq} params 请求参数
   * @returns {model.ResultType<schema.XResourceArray>} 请求结果
   */
  public async queryUsefulResource(
    params: model.UsefulResourceReq,
  ): Promise<model.ResultType<schema.XResourceArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryUsefulResource',
      params: params,
    });
  }
  /**
   * 更新市场
   * @param {model.MarketModel} params 请求参数
   * @returns {model.ResultType<schema.XMarket>} 请求结果
   */
  public async updateMarket(
    params: model.MarketModel,
  ): Promise<model.ResultType<schema.XMarket>> {
    return await this.request({
      module: 'market',
      action: 'UpdateMarket',
      params: params,
    });
  }
  /**
   * 更新商品信息
   * @param {model.MerchandiseModel} params 请求参数
   * @returns {model.ResultType<schema.XMerchandise>} 请求结果
   */
  public async updateMerchandise(
    params: model.MerchandiseModel,
  ): Promise<model.ResultType<schema.XMerchandise>> {
    return await this.request({
      module: 'market',
      action: 'UpdateMerchandise',
      params: params,
    });
  }
  /**
   * 更新产品
   * @param {model.ProductModel} params 请求参数
   * @returns {model.ResultType<schema.XProduct>} 请求结果
   */
  public async updateProduct(
    params: model.ProductModel,
  ): Promise<model.ResultType<schema.XProduct>> {
    return await this.request({
      module: 'market',
      action: 'UpdateProduct',
      params: params,
    });
  }
  /**
   * 更新产品资源
   * @param {model.ResourceModel} params 请求参数
   * @returns {model.ResultType<schema.XResource>} 请求结果
   */
  public async updateProductResource(
    params: model.ResourceModel,
  ): Promise<model.ResultType<schema.XResource>> {
    return await this.request({
      module: 'market',
      action: 'UpdateProductResource',
      params: params,
    });
  }
  /**
   * 更新订单
   * @param {model.OrderModel} params 请求参数
   * @returns {model.ResultType<schema.XOrder>} 请求结果
   */
  public async updateOrder(
    params: model.OrderModel,
  ): Promise<model.ResultType<schema.XOrder>> {
    return await this.request({
      module: 'market',
      action: 'UpdateOrder',
      params: params,
    });
  }
  /**
   * 更新订单项
   * @param {model.OrderDetailModel} params 请求参数
   * @returns {model.ResultType<schema.XOrderDetail>} 请求结果
   */
  public async updateOrderDetail(
    params: model.OrderDetailModel,
  ): Promise<model.ResultType<schema.XOrderDetail>> {
    return await this.request({
      module: 'market',
      action: 'UpdateOrderDetail',
      params: params,
    });
  }
  /**
   * 退出市场
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async quitMarket(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'QuitMarket',
      params: params,
    });
  }
  /**
   * 申请加入市场
   * @param {model.IDWithBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketRelation>} 请求结果
   */
  public async applyJoinMarket(
    params: model.IDWithBelongReq,
  ): Promise<model.ResultType<schema.XMarketRelation>> {
    return await this.request({
      module: 'market',
      action: 'ApplyJoinMarket',
      params: params,
    });
  }
  /**
   * 拉组织/个人加入市场
   * @param {model.MarketPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async pullAnyToMarket(
    params: model.MarketPullModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'PullAnyToMarket',
      params: params,
    });
  }
  /**
   * 取消加入市场
   * @param {model.IdReqModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async cancelJoinMarket(
    params: model.IdReqModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'CancelJoinMarket',
      params: params,
    });
  }
  /**
   * 取消订单
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async cancelOrder(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'CancelOrder',
      params: params,
    });
  }
  /**
   * 取消订单详情
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async cancelOrderDetail(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'CancelOrderDetail',
      params: params,
    });
  }
  /**
   * 移除市场成员
   * @param {model.MarketPullModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async removeMarketMember(
    params: model.MarketPullModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'RemoveMarketMember',
      params: params,
    });
  }
  /**
   * 交付订单详情中的商品
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deliverMerchandise(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'DeliverMerchandise',
      params: params,
    });
  }
  /**
   * 退还商品
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async rejectMerchandise(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'RejectMerchandise',
      params: params,
    });
  }
  /**
   * 查询我的加入商店审批
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMarketRelationArray>} 请求结果
   */
  public async queryJoinApproval(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMarketRelationArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryJoinApproval',
      params: params,
    });
  }
  /**
   * 查询我的商品上架审批
   * @param {model.IDBelongReq} params 请求参数
   * @returns {model.ResultType<schema.XMerchandiseArray>} 请求结果
   */
  public async queryPublicApproval(
    params: model.IDBelongReq,
  ): Promise<model.ResultType<schema.XMerchandiseArray>> {
    return await this.request({
      module: 'market',
      action: 'QueryPublicApproval',
      params: params,
    });
  }
  /**
   * 审核加入市场申请
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async approvalJoinApply(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'ApprovalJoinApply',
      params: params,
    });
  }
  /**
   * 审核商品上架申请
   * @param {model.ApprovalModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async approvalMerchandise(
    params: model.ApprovalModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'market',
      action: 'ApprovalMerchandise',
      params: params,
    });
  }
  /**
   * 产品上架:市场拥有者
   * @param {model.MerchandiseModel} params 请求参数
   * @returns {model.ResultType<schema.XMerchandise>} 请求结果
   */
  public async pullProductToMarket(
    params: model.MerchandiseModel,
  ): Promise<model.ResultType<schema.XMerchandise>> {
    return await this.request({
      module: 'market',
      action: 'PullProductToMarket',
      params: params,
    });
  }
  /**
   * 创建流程定义
   * @param {schema.XFlowDefine} params 请求参数
   * @returns {model.ResultType<schema.XFlowDefine>} 请求结果
   */
  public async createDefine(
    params: schema.XFlowDefine,
  ): Promise<model.ResultType<schema.XFlowDefine>> {
    return await this.request({
      module: 'flow',
      action: 'CreateDefine',
      params: params,
    });
  }
  /**
   * 发布流程定义（包括创建、更新操作）
   * @param {model.CreateDefineReq} params 请求参数
   * @returns {model.ResultType<schema.XFlowDefine>} 请求结果
   */
  public async publishDefine(
    params: model.CreateDefineReq,
  ): Promise<model.ResultType<schema.XFlowDefine>> {
    return await this.request({
      module: 'flow',
      action: 'PublishDefine',
      params: params,
    });
  }
  /**
   * 创建流程实例(启动流程)
   * @param {model.FlowInstanceModel} params 请求参数
   * @returns {model.ResultType<schema.XFlowInstance>} 请求结果
   */
  public async createInstance(
    params: model.FlowInstanceModel,
  ): Promise<model.ResultType<schema.XFlowInstance>> {
    return await this.request({
      module: 'flow',
      action: 'CreateInstance',
      params: params,
    });
  }
  /**
   * 创建流程绑定
   * @param {model.FlowRelationModel} params 请求参数
   * @returns {model.ResultType<schema.XFlowRelation>} 请求结果
   */
  public async createFlowRelation(
    params: model.FlowRelationModel,
  ): Promise<model.ResultType<schema.XFlowRelation>> {
    return await this.request({
      module: 'flow',
      action: 'CreateFlowRelation',
      params: params,
    });
  }
  /**
   * 删除流程定义
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteDefine(params: model.IdReq): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'flow',
      action: 'DeleteDefine',
      params: params,
    });
  }
  /**
   * 删除流程实例(发起人撤回)
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteInstance(params: model.IdReq): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'flow',
      action: 'DeleteInstance',
      params: params,
    });
  }
  /**
   * 删除流程绑定
   * @param {model.FlowRelationModel} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async deleteFlowRelation(
    params: model.FlowRelationModel,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'flow',
      action: 'DeleteFlowRelation',
      params: params,
    });
  }
  /**
   * 查询流程有关应用
   * @returns {model.ResultType<model.IdWithNameModel[]>} 请求结果
   */
  public async queryApprovalProduct(): Promise<
    model.ResultType<model.IdWithNameModel[]>
  > {
    return await this.request({
      module: 'flow',
      action: 'QueryApprovalProduct',
      params: {},
    });
  }
  /**
   * 查询流程定义
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<schema.XFlowDefineArray>} 请求结果
   */
  public async queryDefine(
    params: model.IdReq,
  ): Promise<model.ResultType<schema.XFlowDefineArray>> {
    return await this.request({
      module: 'flow',
      action: 'QueryDefine',
      params: params,
    });
  }
  /**
   * 查询应用业务与定义的绑定关系
   * @param {model.IdReq} params 请求参数
   * @returns {model.ResultType<schema.XFlowRelationArray>} 请求结果
   */
  public async queryDefineRelation(
    params: model.IdReq,
  ): Promise<model.ResultType<schema.XFlowRelationArray>> {
    return await this.request({
      module: 'flow',
      action: 'QueryDefineRelation',
      params: params,
    });
  }
  /**
   * 查询发起的流程实例
   * @param {model.FlowReq} params 请求参数
   * @returns {model.ResultType<schema.XFlowInstanceArray>} 请求结果
   */
  public async queryInstance(
    params: model.FlowReq,
  ): Promise<model.ResultType<schema.XFlowInstanceArray>> {
    return await this.request({
      module: 'flow',
      action: 'QueryInstance',
      params: params,
    });
  }
  /**
   * 查询待审批任务
   * @param {model.IdReq} params 查询参数
   * @returns {model.ResultType<schema.XFlowTaskArray>} 请求结果
   */
  public async queryApproveTask(
    params: model.IdReq,
  ): Promise<model.ResultType<schema.XFlowTaskArray>> {
    return await this.request({
      module: 'flow',
      action: 'QueryApproveTask',
      params: params,
    });
  }
  /**
   * 查询待审阅抄送
   * @returns {model.ResultType<schema.XFlowTaskHistoryArray>} 请求结果
   */
  public async queryNoticeTask(
    params: model.IdReq,
  ): Promise<model.ResultType<schema.XFlowTaskHistoryArray>> {
    return await this.request({
      module: 'flow',
      action: 'QueryNoticeTask',
      params: params,
    });
  }
  /**
   * 查询审批记录
   * @param {model.IdSpaceReq} params 请求参数
   * @returns {model.ResultType<schema.XFlowTaskHistoryArray>} 请求结果
   */
  public async queryRecord(
    params: model.IdSpaceReq,
  ): Promise<model.ResultType<schema.XFlowTaskHistoryArray>> {
    return await this.request({
      module: 'flow',
      action: 'QueryRecord',
      params: params,
    });
  }
  /**
   * 流程节点审批
   * @param {model.ApprovalTaskReq} params 请求参数
   * @returns {model.ResultType<boolean>} 请求结果
   */
  public async approvalTask(
    params: model.ApprovalTaskReq,
  ): Promise<model.ResultType<boolean>> {
    return await this.request({
      module: 'flow',
      action: 'ApprovalTask',
      params: params,
    });
  }
  /**
   * 重置流程定义
   * @param {schema.XFlowDefine} params 请求参数
   * @returns {model.ResultType<schema.XFlowDefine>} 请求结果
   */
  public async resetDefine(
    params: schema.XFlowDefine,
  ): Promise<model.ResultType<schema.XFlowDefine>> {
    return await this.request({
      module: 'flow',
      action: 'ResetDefine',
      params: params,
    });
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
  /**
   * 使用rest请求后端
   * @param methodName 方法
   * @param data 参数
   * @returns 返回结果
   */
  private async _restRequest(
    methodName: string,
    args: any,
  ): Promise<model.ResultType<any>> {
    const res = await this._axiosInstance({
      method: 'post',
      timeout: 2 * 1000,
      url: '/orginone/kernel/rest/' + methodName,
      headers: {
        Authorization: this._anystore.accessToken,
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
