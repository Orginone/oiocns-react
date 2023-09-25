import { generateUuid } from './uuid';

export class Emitter {
  private _refreshCallback: { [name: string]: (key: string, ...args: any) => void } = {};
  private _partRefreshCallback: {
    [name: string]: { [p: string]: (key: string) => void };
  };
  constructor() {
    this._refreshCallback = {};
    this._partRefreshCallback = {};
  }
  /**
   * @desc 订阅变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribe(callback: (key: string, ...args: any) => void): string {
    const id = generateUuid();
    if (callback) {
      callback(id);
      this._refreshCallback[id] = callback;
    }
    return id;
  }

  /**
   * @desc 取消订阅 支持取消多个
   * @param key 订阅ID
   */
  public unsubscribe(key: string | string[]): void {
    if (typeof key == 'string') {
      delete this._refreshCallback[key];
      delete this._partRefreshCallback[key];
    } else {
      key.forEach((id: string) => {
        delete this._refreshCallback[id];
        delete this._partRefreshCallback[id];
      });
    }
  }

  /**
   * @desc 变更回调
   */
  public changCallback(...args: any) {
    Object.keys(this._refreshCallback).forEach((key) => {
      this._refreshCallback[key].apply(this, [generateUuid(), ...args]);
    });
  }

  /** 清空所有订阅 */
  public cleanAll(): void {
    this._refreshCallback = {};
    this._partRefreshCallback = {};
  }
}
