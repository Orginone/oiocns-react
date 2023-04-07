import { badRequest, BucketOpreateModel, ResultType } from '../model';
import StoreHub from './storehub';
import { logger } from '../common';
import axios from 'axios';

/**
 * 任意数据存储类
 */
export default class AnyStore {
  // 存储集线器
  private _storeHub: StoreHub;
  // 单例
  private static _instance: AnyStore;
  // axios实例
  private readonly _axiosInstance = axios.create({});
  // 订阅回调字典
  private _subscribeCallbacks: Record<string, (data: any) => void>;
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
   * @param {string} accessToken 远端地址
   * @param {string} url 远端地址
   */
  private constructor(url: string) {
    this._subscribeCallbacks = {};
    this._storeHub = new StoreHub(url);
    this._storeHub.on('updated', (key: string, domain: string, data: any) => {
      this._updated(key, domain, data);
    });
    this._storeHub.onConnected(() => {
      if (this.accessToken.length > 0) {
        this._storeHub
          .invoke('TokenAuth', this.accessToken, 'user')
          .then(() => {
            // logger.info('连接到私有存储成功!');
            Object.keys(this._subscribeCallbacks).forEach(async (fullKey) => {
              const key = fullKey.split('|')[0];
              const domain = fullKey.split('|')[1];
              this.subscribed(key, domain, this._subscribeCallbacks[fullKey]);
            });
          })
          .catch((err) => {
            logger.error(err);
          });
      }
    });
    this._storeHub.on('Updated', (key, domain, data) => {
      this._updated(key, domain, data);
    });
    this._storeHub.start();
  }
  /**
   * 获取任意数据存储单例
   * @param {string} accessToken 远端地址
   * @param {string} url 远端地址,默认为 "/orginone/anydata/hub"
   * @returns {AnyStore} 数据存储单例
   */
  public static getInstance(url: string = '/orginone/anydata/hub'): AnyStore {
    if (this._instance == null) {
      this._instance = new AnyStore(url);
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
  /**
   * 更新token
   * @param accessToken token
   */
  public updateToken(accessToken: string): void {
    if (this.accessToken != accessToken) {
      this.accessToken = accessToken;
      this._storeHub.restart();
    }
  }
  /**
   * 订阅对象变更
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @param {(data:any)=>void} callback 变更回调，默认回调一次
   * @returns {void} 无返回值
   */
  // eslint-disable-next-line no-unused-vars
  public subscribed<T>(key: string, domain: string, callback: (data: T) => void): void {
    if (callback) {
      const fullKey = key + '|' + domain;
      this._subscribeCallbacks[fullKey] = callback;
      if (this._storeHub.isConnected) {
        this._storeHub
          .invoke('Subscribed', key, domain)
          .then((res: ResultType<T>) => {
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
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {void} 无返回值
   */
  public unSubscribed(key: string, domain: string): void {
    const fullKey = key + '|' + domain;
    if (this._subscribeCallbacks[fullKey] && this._storeHub.isConnected) {
      this._storeHub
        .invoke('UnSubscribed', key, domain)
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
   * 查询对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 对象异步结果
   */
  public async get<T>(key: string, domain: string): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Get', key, domain);
    }
    return await this._restRequest(
      'Object',
      'Get/' + key,
      {
        shareDomain: domain,
      },
      {},
    );
  }
  /**
   * 修改对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {any} setData 对象新的值
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 变更异步结果
   */
  public async set(key: string, setData: any, domain: string): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Set', key, setData, domain);
    }
    return await this._restRequest(
      'Object',
      'Set/' + key,
      {
        shareDomain: domain,
      },
      setData,
    );
  }
  /**
   * 删除对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 删除异步结果
   */
  public async delete(key: string, domain: string): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Delete', key, domain);
    }
    return await this._restRequest(
      'Object',
      'Delete/' + key,
      {
        shareDomain: domain,
      },
      {},
    );
  }
  /**
   * 添加数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} data 要添加的数据，对象/数组
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 添加异步结果
   */
  public async insert(
    collName: string,
    data: any,
    domain: string,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Insert', collName, data, domain);
    }
    return await this._restRequest(
      'Collection',
      'Update/' + collName,
      {
        shareDomain: domain,
      },
      data,
    );
  }
  /**
   * 更新数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} update 更新操作（match匹配，update变更,options参数）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 更新异步结果
   */
  public async update(
    collName: string,
    update: any,
    domain: string,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Update', collName, update, domain);
    }
    return await this._restRequest(
      'Collection',
      'Update/' + collName,
      {
        shareDomain: domain,
      },
      update,
    );
  }
  /**
   * 从数据集移除数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} match 匹配信息
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async remove(
    collName: string,
    match: any,
    domain: string,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Remove', collName, match, domain);
    }
    return await this._restRequest(
      'Collection',
      'Remove/' + collName,
      {
        shareDomain: domain,
      },
      match,
    );
  }
  /**
   * 从数据集查询数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async aggregate(
    collName: string,
    options: any,
    domain: string,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Aggregate', collName, options, domain);
    }
    return await this._restRequest(
      'Collection',
      'Aggregate/' + collName,
      {
        shareDomain: domain,
      },
      options,
    );
  }
  /**
   * 桶操作
   * @param data 操作携带的数据
   * @returns {ResultType<T>} 移除异步结果
   */
  public async bucketOpreate<T>(data: BucketOpreateModel): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('BucketOpreate', data);
    }
    return await this._restRequest('Bucket', 'Operate', {}, data);
  }
  /**
   * 加载物
   * @param  过滤参数
   * @returns {ResultType<T>} 移除异步结果
   */
  public async loadThing<T>(options: any, domain: string): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Load', options, domain);
    }
    options.shareDomain = domain;
    return await this._restRequest('Thing', 'Load', options, {});
  }
  /**
   * 加载物的归档信息
   * @param  过滤参数
   * @returns {ResultType<T>} 移除异步结果
   */
  public async loadThingArchives<T>(
    options: any,
    domain: string,
  ): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('LoadArchives', options, domain);
    }
    options.shareDomain = domain;
    return await this._restRequest('Thing', 'LoadArchives', options, {});
  }
  /**
   * 创建物
   * @param  创建数量
   * @returns {ResultType<T>} 移除异步结果
   */
  public async createThing<T>(number: number, domain: string): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Create', number, domain);
    }
    return await this._restRequest(
      'Thing',
      'Create',
      {
        shareDomain: domain,
      },
      number,
    );
  }
  /**
   * 对象变更通知
   * @param key 主键
   * @param data 数据
   * @returns {void} 无返回值
   */
  private _updated(key: string, domain: string, data: any): void {
    const lfullkey = key + '|' + domain;
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
   * @param controller 控制器
   * @param methodName 方法
   * @param data 内容体数据
   * @param params 查询参数
   * @returns 返回结果
   */
  private async _restRequest(
    controller: string,
    methodName: string,
    params: any,
    data: any,
  ): Promise<ResultType<any>> {
    const res = await this._axiosInstance({
      method: 'post',
      timeout: 2 * 1000,
      url: '/orginone/anydata/' + controller + '/' + methodName,
      headers: {
        Authorization: this.accessToken,
      },
      data: data,
      params: params,
    });
    if (res.data && (res.data as ResultType<any>)) {
      return res.data as ResultType<any>;
    }
    return badRequest();
  }
}
