/* eslint-disable no-unused-vars */
import * as signalR from '@microsoft/signalr';

// import router from '@/router';
import api from '@/services';
export const BadRequst: ResultType = { success: false, data: {}, code: 400, msg: '' };
/**
 * 数据集数据存储类工具
 * 支持订阅变更
 */
export default class AnyStore extends Object {
  private stoped: boolean;
  private closed: boolean;
  private accessToken: string | undefined;
  public userId: string;
  public spaceId: string;
  private authed: boolean;
  private isconnecting: boolean;
  private connection: signalR.HubConnection;
  private static anyStore: AnyStore | null = null;
  private _connectedCallbacks: (() => void)[];
  private _subscribeCallbacks: Record<string, (data: any) => void>;
  /**
   * 私有构造方法，禁止外部实例化
   */
  private constructor() {
    super();
    this.closed = false;
    this.stoped = false;
    this.userId = '';
    this.spaceId = '';
    this.isconnecting = false;
    this.authed = false;
    this._connectedCallbacks = [];
    this._subscribeCallbacks = {};
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/orginone/anydata/hub')
      .build();
    this.connection.serverTimeoutInMilliseconds = 8000;
    this.connection.keepAliveIntervalInMilliseconds = 3000;
    this.connection.onclose(() => {
      this.authed = false;
      this.reconnect('disconnected from anydata, await 5s reconnect.');
    });
    this.connection.on('Insert', (collName: string, data: any) => {
      this._insert(collName, data);
    });
    this.connection.on('Update', (collName: string, data: any) => {
      this._update(collName, data);
    });
    this.connection.on('Remove', (collName: string, data: any) => {
      this._remove(collName, data);
    });
    this.connection.on('Updated', (key: string, data: any) => {
      this._updated(key, data);
    });
  }
  /** 获取单例 */
  public static getInstance() {
    if (this.anyStore == null) {
      this.anyStore = new AnyStore();
    }
    return this.anyStore;
  }
  /**
   * 启动连接
   * @param {string} accessToken 授权token
   */
  public async start(accessToken: string) {
    if (this.accessToken != accessToken) {
      await this.stop();
      let res = await api.person.tokenInfo({});
      if (res.success) {
        this.userId = res.data.userId;
        this.spaceId = res.data.spaceId;
      } else {
        // router.push('/login');
      }
    }
    this.stoped = false;
    this.accessToken = accessToken;
    if (
      !this.isconnecting &&
      this.connection.state != signalR.HubConnectionState.Connected
    ) {
      this.isconnecting = true;
      this.connection
        .start()
        .then(() => {
          this.isconnecting = false;
          this.connection.invoke('TokenAuth', accessToken, 'user').then(() => {
            this.authed = true;
            this._resubscribed();
          });
        })
        .catch(() => {
          this.authed = false;
          this.isconnecting = false;
          this.reconnect('connecting to anydata failed, await 5s reconnect.');
        });
    }
  }
  /**
   * 停止连接
   */
  public async stop() {
    this.stoped = true;
    this.accessToken = '';
    this.authed = false;
    await this.connection.stop();
  }
  /** 短线重连 */
  private async reconnect(err: string) {
    if (!this.closed) {
      this.closed = true;
      if (!this.stoped) {
        console.error(err);
        setTimeout(() => {
          this.closed = false;
          this.start(this.accessToken as string);
        }, 5000);
      }
    }
  }
  /**
   * 连接成功hook
   * @param callback 回调
   */
  public onConnected(callback: () => void) {
    if (callback) {
      this._connectedCallbacks.push(callback);
    }
  }
  /**
   * 订阅对象变更
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @param {(data:any)=>void} callback 变更回调，默认回调一次
   */
  public subscribed(key: string, domain: string, callback: (data: any) => void) {
    if (callback) {
      let fullKey = key + '|' + domain;
      this._subscribeCallbacks[fullKey] = callback;
      if (this.authed) {
        this.connection
          .invoke<ResultType>('Subscribed', key, domain)
          .then((res: { success: any; data: any }) => {
            if (res.success) {
              callback.call(callback, res.data);
            }
          });
      }
    }
  }
  /**
   * 取消订阅对象变更
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   */
  public unSubscribed(key: string, domain: string) {
    let fullKey = key + '|' + domain;
    if (this._subscribeCallbacks[fullKey] && this.authed) {
      this.connection.invoke('UnSubscribed', key, domain);
    }
    delete this._subscribeCallbacks[fullKey];
  }
  /**
   * 查询对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 对象结果
   */
  public async get(key: string, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>('Get', key, domain);
    }
    return BadRequst;
  }
  /**
   * 修改对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {any} setData 对象新的值
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 变更结果
   */
  public async set(key: string, setData: any, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>('Set', key, setData, domain);
    }
    return BadRequst;
  }
  /**
   * 删除对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 删除结果
   */
  public async delete(key: string, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>('Delete', key, domain);
    }
    return BadRequst;
  }
  /**
   * 添加数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} data 要添加的数据，对象/数组
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 添加结果
   */
  public async insert(collName: string, data: any, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>('Insert', collName, data, domain);
    }
    return BadRequst;
  }
  /**
   * 更新数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} update 更新操作（match匹配，update变更,options参数）
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 更新结果
   */
  public async update(collName: string, update: any, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>('Update', collName, update, domain);
    }
    return BadRequst;
  }
  /**
   * 从数据集移除数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} match 匹配信息
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除结果
   */
  public async remove(collName: string, match: any, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>('Remove', collName, match, domain);
    }
    return BadRequst;
  }
  /**
   * 从数据集查询数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
   * @param {string} domain 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除结果
   */
  public async aggregate(collName: string, options: any, domain: string) {
    if (this.authed) {
      return await this.connection.invoke<ResultType>(
        'Aggregate',
        collName,
        options,
        domain,
      );
    }
    return BadRequst;
  }
  private _insert(collName: string, data: any) {}
  private _update(collName: string, data: any) {}
  private _remove(collName: string, data: any) {}
  private _updated(key: string, data: any) {
    Object.keys(this._subscribeCallbacks).forEach((fullKey) => {
      if (fullKey.split('|')[0] === key) {
        const callback: (data: any) => void = this._subscribeCallbacks[fullKey];
        if (callback) {
          callback.call(callback, data);
        }
      }
    });
  }
  private _resubscribed() {
    if (this.authed) {
      Object.keys(this._subscribeCallbacks).forEach(async (fullKey) => {
        let key = fullKey.split('|')[0];
        let domain = fullKey.split('|')[1];
        let { success, data } = await this.connection.invoke<ResultType>(
          'Subscribed',
          key,
          domain,
        );
        if (success) {
          let callback = this._subscribeCallbacks[fullKey];
          callback.call(callback, data);
        }
      });
    }
  }
}

export const anystore = AnyStore.getInstance();
