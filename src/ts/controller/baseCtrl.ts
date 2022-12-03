import { generateUuid } from '../base/common';
/**
 * 控制器基类
 */
export default class BaseController {
  private _refreshCallback: { [name: string]: Function } = {};
  private _partRefreshCallback: {
    [name: string]: { [p: string]: Function };
  } = {};
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
   * 订阅局部变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribePart(p: string | string[], callback: Function): string {
    const id = generateUuid();
    if (p.length > 0) {
      callback();
      this._partRefreshCallback[id] = {};
      if (typeof p === 'string') {
        this._partRefreshCallback[id][p] = callback;
      } else {
        for (const i of p) {
          this._partRefreshCallback[id][i] = callback;
        }
      }
    }
    return id;
  }

  /**
   * 取消订阅
   * @param id 订阅ID
   */
  public unsubscribe(id: string): void {
    delete this._refreshCallback[id];
    delete this._partRefreshCallback[id];
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
   * 局部变更回调
   * @param {string} p 订阅方法名称
   */
  public changCallbackPart(p: string, params?: any): void {
    this.changCallback();
    Object.keys(this._partRefreshCallback).forEach((id) => {
      const callback = this._partRefreshCallback[id][p];
      if (callback) {
        params ? callback(params) : callback.apply(this, []);
      }
    });
  }
}
