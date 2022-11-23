import { generateUuid } from '../base/common';
/**
 * 控制器基类
 */
export default class BaseController {
  private _refreshCallback: { [name: string]: () => void } = {};
  constructor() {
    this._refreshCallback = {};
  }
  /**
   * 订阅变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribe(callback: () => void): string {
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
}
