import { generateUuid } from '../base/common';
/**
 * 控制器基类
 */
export default class BaseController {
  private _refreshCallback: { [name: string]: Function } = {};
  private _Callback: Map<string, Function> = new Map();
  constructor() {
    this._refreshCallback = {};
  }
  /**
   * 订阅变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribe(callback: Function): string {
    const id = generateUuid();
    if (callback) {
      callback();
      this._refreshCallback[id] = callback;
    }
    return id;
  }

  /**
   * 取消订阅
   * @param id 订阅ID
   */
  public unsubscribe(id: string): void {
    delete this._refreshCallback[id];
  }

  /**
   * 变更回调
   */
  public changCallback() {
    Object.keys(this._refreshCallback).forEach((id) => {
      this._refreshCallback[id].apply(this, []);
    });
  }

  /**
   * 订阅局部变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribePart(FunKey: string, callback: Function) {
    // const id = generateUuid();
    if (callback) {
      // callback();
      this._Callback.set(FunKey, callback);
    }
  }

  /**
   * 取消局部订阅
   * @param {string} FunKey 订阅方法名称
   */
  public unsubscribePart(FunKey: string): void {
    if (this._Callback.has(FunKey)) {
      this._Callback.delete(FunKey);
    }
  }

  /**
   * 局部变更回调
   * @param {string} FunKey 订阅方法名称
   * @param {any} params 订阅回调犯法 参数
   */
  public changCallbackPart(FunKey: string, params: any) {
    if (this._Callback.has(FunKey)) {
      const Fun = this._Callback.get(FunKey);
      Fun!(params);
    }
  }
}
