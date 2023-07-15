import {
  badRequest,
  BucketOpreateModel,
  BucketOpreates,
  FileItemModel,
  PageModel,
  PageResult,
  ResultType,
} from '../model';
import StoreHub from './storehub';
import { blobToDataUrl, encodeKey, generateUuid, logger, sliceFile } from '../common';
import axios from 'axios';
import { model } from '..';

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
    this._storeHub.on('updated', (belongId, key, data) => {
      this._updated(belongId, key, data);
    });
    this._storeHub.onConnected(() => {
      if (this.accessToken.length > 0) {
        this._storeHub
          .invoke('TokenAuth', this.accessToken)
          .then(() => {
            logger.info('连接到存储成功!');
            Object.keys(this._subscribeCallbacks).forEach(async (fullKey) => {
              const key = fullKey.split('|')[0];
              const belongId = fullKey.split('|')[1];
              this.subscribed(belongId, key, this._subscribeCallbacks[fullKey]);
            });
          })
          .catch((err) => {
            logger.error(err);
          });
      }
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
  public async updateToken(accessToken: string): Promise<void> {
    if (this.accessToken != accessToken) {
      this.accessToken = accessToken;
      await this._storeHub.restart();
    }
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
   * 查询对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 对象异步结果
   */
  public async get<T>(belongId: string, key: string): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Get', belongId, key);
    }
    return await this._restRequest(
      'Object',
      'Get/' + key,
      {
        belongId: belongId,
      },
      {},
    );
  }
  /**
   * 修改对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {any} setData 对象新的值
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 变更异步结果
   */
  public async set(
    belongId: string,
    key: string,
    setData: any,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Set', belongId, key, setData);
    }
    return await this._restRequest(
      'Object',
      'Set/' + key,
      {
        belongId: belongId,
      },
      setData,
    );
  }
  /**
   * 删除对象
   * @param {string} key 对象名称（eg: rootName.person.name）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 删除异步结果
   */
  public async delete(belongId: string, key: string): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Delete', belongId, key);
    }
    return await this._restRequest(
      'Object',
      'Delete/' + key,
      {
        belongId: belongId,
      },
      {},
    );
  }
  /**
   * 添加数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} data 要添加的数据，对象/数组
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 添加异步结果
   */
  public async insert(
    belongId: string,
    collName: string,
    data: any,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Insert', belongId, collName, data);
    }
    return await this._restRequest(
      'Collection',
      'Update/' + collName,
      {
        belongId: belongId,
      },
      data,
    );
  }
  /**
   * 更新数据到数据集
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} update 更新操作（match匹配，update变更,options参数）
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 更新异步结果
   */
  public async update(
    belongId: string,
    collName: string,
    update: any,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Update', belongId, collName, update);
    }
    return await this._restRequest(
      'Collection',
      'Update/' + collName,
      {
        belongId: belongId,
      },
      update,
    );
  }
  /**
   * 从数据集移除数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} match 匹配信息
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async remove(
    belongId: string,
    collName: string,
    match: any,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Remove', belongId, collName, match);
    }
    return await this._restRequest(
      'Collection',
      'Remove/' + collName,
      {
        belongId: belongId,
      },
      match,
    );
  }
  /**
   * 从数据集查询数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async aggregate(
    belongId: string,
    collName: string,
    options: any,
  ): Promise<ResultType<any>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Aggregate', belongId, collName, options);
    }
    return await this._restRequest(
      'Collection',
      'Aggregate/' + collName,
      {
        belongId: belongId,
      },
      options,
    );
  }
  /**
   * 从数据集查询数据
   * @param {string} collName 数据集名称（eg: history-message）
   * @param {any} options 聚合管道(eg: {match:{a:1},skip:10,limit:10})
   * @param {string} belongId 对象所在域, 个人域(user),单位域(company),开放域(all)
   * @returns {ResultType} 移除异步结果
   */
  public async pageRequest<T>(
    belongId: string,
    collName: string,
    options: any,
    page: PageModel,
  ): Promise<ResultType<PageResult<T>>> {
    const total = await this.aggregate(belongId, collName, options);
    if (total.data && Array.isArray(total.data) && total.data.length > 0) {
      options.skip = page.offset;
      options.limit = page.limit;
      const res = await this.aggregate(belongId, collName, options);
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
    data: BucketOpreateModel,
  ): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('BucketOpreate', belongId, data);
    }
    return await this._restRequest(
      'Bucket',
      'Operate',
      {
        belongId: belongId,
      },
      data,
    );
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
  ): Promise<FileItemModel | undefined> {
    const id = generateUuid();
    const data: BucketOpreateModel = {
      key: encodeKey(key),
      operate: BucketOpreates.Upload,
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
      const res = await this.bucketOpreate<FileItemModel>(belongId, data);
      if (!res.success) {
        data.operate = BucketOpreates.AbortUpload;
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
   * @returns {ResultType<T>} 移除异步结果
   */
  public async loadThing<T>(belongId: string, options: any): Promise<ResultType<T>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Load', belongId, options);
    }
    options.belongId = belongId;
    return await this._restRequest('Thing', 'Load', options, {});
  }
  /**
   * 创建物
   * @param name 物的名称
   * @returns {ResultType<model.AnyThingModel>} 移除异步结果
   */
  public async createThing(
    belongId: string,
    name: string,
  ): Promise<ResultType<model.AnyThingModel>> {
    if (this._storeHub.isConnected) {
      return await this._storeHub.invoke('Create', belongId, name);
    }
    return await this._restRequest(
      'Thing',
      'Create',
      {
        belongId: belongId,
      },
      name,
    );
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
