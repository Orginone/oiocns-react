/* eslint-disable no-unused-vars */
import * as signalR from '@microsoft/signalr';
import { logger } from '../common';
import { IDisposable } from '../common/lifecycle';
import { badRequest, ResultType } from '../model';
import { TxtHubProtocol } from '../protocol';
/**
 * 存储层Hub
 */
export default class StoreHub implements IDisposable {
  // 超时重试时间
  private _timeout: number;
  // 是否已经启动
  private _isStarted: boolean;
  // signalr 连接
  private _connection: signalR.HubConnection;
  // 连接成功回调
  private _connectedCallbacks: (() => void)[];
  // 连接断开回调
  private _disconnectedCallbacks: ((err: Error | undefined) => void)[];
  /**
   * 构造方法
   * @param url signalr服务地址
   * @param timeout 超时检测默认8000ms
   * @param interval 心跳间隔默认3000ms
   */
  constructor(url: string, protocol = 'json', timeout = 8000, interval = 3000) {
    this._isStarted = false;
    this._timeout = timeout;
    this._connectedCallbacks = [];
    this._disconnectedCallbacks = [];
    let hubProtocol: signalR.IHubProtocol = new signalR.JsonHubProtocol();
    if (protocol == 'txt') {
      hubProtocol = new TxtHubProtocol();
    }
    this._connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withHubProtocol(hubProtocol)
      .configureLogging(signalR.LogLevel.None)
      .build();
    this._connection.serverTimeoutInMilliseconds = timeout;
    this._connection.keepAliveIntervalInMilliseconds = interval;
    this._connection.onclose((err) => {
      if (this._isStarted) {
        this._disconnectedCallbacks.forEach((c) => {
          c.apply(this, [err]);
        });
        logger.warn(`连接断开,${this._timeout}ms后重试。` + (err ? err!.message : ''));
        setTimeout(() => {
          this._starting();
        }, this._timeout);
      }
    });
  }
  /**
   * 是否处于连接着的状态
   * @return {boolean} 状态
   */
  public get isConnected(): boolean {
    return (
      this._isStarted && this._connection.state === signalR.HubConnectionState.Connected
    );
  }
  /**
   * 销毁连接
   * @returns {Promise<void>} 异步Promise
   */
  public dispose(): Promise<void> {
    this._isStarted = false;
    this._connectedCallbacks = [];
    this._disconnectedCallbacks = [];
    return this._connection.stop();
  }
  /**
   * 启动链接
   * @returns {void} 无返回值
   */
  public start(): void {
    if (!this._isStarted) {
      this._isStarted = true;
      if (!this.isConnected) {
        this._starting();
      }
    }
  }
  /**
   * 重新建立连接
   * @returns {void} 无返回值
   */
  public async restart(): Promise<void> {
    if (this.isConnected) {
      this._isStarted = false;
      await this._connection.stop();
      setTimeout(() => {
        this.start();
      }, 1000);
    }
  }
  /**
   * 开始连接
   * @returns {void} 无返回值
   */
  private async _starting(): Promise<void> {
    this._connection
      .start()
      .then(() => {
        this._connectedCallbacks.forEach((c) => {
          c.apply(this, []);
        });
      })
      .catch((err) => {
        this._disconnectedCallbacks.forEach((c) => {
          c.apply(this, [err]);
        });
        logger.warn(`连接失败,${this._timeout}ms后重试。` + err.message);
        setTimeout(() => {
          this._starting();
        }, this._timeout);
      });
  }
  /**
   * 连接成功事件
   * @param {Function} callback 回调
   * @returns {void} 无返回值
   */
  public onConnected(callback: () => void): void {
    if (callback) {
      this._connectedCallbacks.push(callback);
    }
  }
  /**
   * 断开连接事件
   * @param {Function} callback 回调
   * @returns {void} 无返回值
   */
  public onDisconnected(callback: (err: Error | undefined) => void): void {
    if (callback) {
      this._disconnectedCallbacks.push(callback);
    }
  }
  /**
   * 监听服务端方法
   * @param {string} methodName 方法名
   * @param {Function} newMethod 回调
   * @returns {void} 无返回值
   */
  public on(methodName: string, newMethod: (...args: any[]) => any): void {
    this._connection.on(methodName, newMethod);
  }
  /**
   * 请求服务端方法
   * @param {string} methodName 方法名
   * @param {any[]} args 参数
   * @returns {Promise<ResultType>} 异步结果
   */
  public invoke(methodName: string, ...args: any[]): Promise<ResultType<any>> {
    return new Promise((resolve) => {
      if (this.isConnected) {
        this._connection
          .invoke(methodName, ...args)
          .then((res: ResultType<any>) => {
            if (!res.success) {
              if (res.code === 401) {
                logger.unauth();
              } else {
                logger.warn('操作失败,' + res.msg);
              }
            }
            resolve(res);
          })
          .catch((err) => {
            let msg = '请求异常';
            if (err && err.Error) {
              msg += ',' + err.Error();
              logger.warn(msg);
            }
            resolve(badRequest(msg));
          });
      } else {
        resolve(badRequest());
      }
    });
  }
}
