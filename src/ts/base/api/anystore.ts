/* eslint-disable no-unused-vars */
import { ResultType } from '../model';
import StoreHub from './storehub';

/**
 * 任意数据存储类
 */
export default class AnyStore {
  // 存储集线器
  private _storeHub: StoreHub;
  // 单例
  private static _instance: AnyStore;
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
  private constructor(accessToken: string, url: string) {
    this.accessToken = accessToken;
    this._subscribeCallbacks = {};
    this._storeHub = new StoreHub(url);
    this._storeHub.on('updated', (key: string, domain: string, data: any) => {
      this._updated(key, domain, data);
    });
    this._storeHub.onConnected(() => {
      this._storeHub
        .invoke('TokenAuth', this.accessToken, 'user')
        .then(() => {
          Object.keys(this._subscribeCallbacks).forEach(async (fullKey) => {
            const key = fullKey.split('|')[0];
            const domain = fullKey.split('|')[1];
            this.subscribed(key, domain, this._subscribeCallbacks[fullKey]);
          });
        })
        .catch((err) => {
          console.log(err);
        });
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
  public static getInstance(
    accessToken: string,
    url: string = '/orginone/anydata/hub',
  ): AnyStore {
    if (this._instance == null) {
      this._instance = new AnyStore(accessToken, url);
    } else {
      this._instance.updateToken(accessToken);
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
  public subscribed(key: string, domain: string, callback: (data: any) => void): void {
    if (callback) {
      const fullKey = key + '|' + domain;
      this._subscribeCallbacks[fullKey] = callback;
      if (this._storeHub.isConnected) {
        this._storeHub
          .invoke('Subscribed', key, domain)
          .then((res: ResultType) => {
            if (res.success) {
              callback.apply(this, [res.data]);
            }
          })
          .catch((err) => {
            console.log(err);
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
          console.log(err);
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
  public async get(key: string, domain: string): Promise<ResultType> {
    return await this._storeHub.invoke('Get', key, domain);
  }
  /**
   * 修改对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {any} setData 对象新的值
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 变更异步结果
   */
  public async set(key: string, setData: any, domain: string): Promise<ResultType> {
    return await this._storeHub.invoke('Set', key, setData, domain);
  }
  /**
   * 删除对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 删除异步结果
   */
  public async delete(key: string, domain: string): Promise<ResultType> {
    return await this._storeHub.invoke('Delete', key, domain);
  }
  /**
   * 添加数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} data 要添加的数据，对象/数组
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 添加异步结果
   */
  public async insert(collName: string, data: any, domain: string): Promise<ResultType> {
    return await this._storeHub.invoke('Insert', collName, data, domain);
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
  ): Promise<ResultType> {
    return await this._storeHub.invoke('Update', collName, update, domain);
  }
  /**
   * 从数据集移除数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} match 匹配信息
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async remove(collName: string, match: any, domain: string): Promise<ResultType> {
    return await this._storeHub.invoke('Remove', collName, match, domain);
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
  ): Promise<ResultType> {
    return await this._storeHub.invoke('Aggregate', collName, options, domain);
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
}
