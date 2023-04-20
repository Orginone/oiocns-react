import UserProvider from '@/ts/core/user';
import { Emitter } from '../base/common';
import { IPerson } from '../core';
/**
 * 设置控制器
 */
class IndexController extends Emitter {
  public currentKey: string = '';
  private _inited: boolean = false;
  private _provider: UserProvider;
  constructor() {
    super();
    this._provider = new UserProvider();
    this._provider.subscribe(async () => {
      await this._provider.refresh();
      this._inited = true;
      this.changCallback();
    });
  }
  /** 是否完成初始化 */
  get inited(): boolean {
    return this._inited;
  }
  /** 是否已登录 */
  get logined(): boolean {
    return this._provider.user != undefined;
  }
  /** 数据提供者 */
  get provider(): UserProvider {
    return this._provider;
  }
  /** 当前用户 */
  get user(): IPerson {
    return this._provider.user!;
  }
}

export default new IndexController();
