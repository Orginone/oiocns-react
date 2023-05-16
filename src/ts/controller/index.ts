import { IPerson, UserProvider } from '@/ts/core';
import { common } from '@/ts/base';
import { IWorkProvider } from '../core/work/provider';
import { IChatProvider } from '../core/chat/provider';
/**
 * 设置控制器
 */
class IndexController extends common.Emitter {
  public currentKey: string = '';
  private _provider: UserProvider;
  public _screenshot: string = ''; //存放截图文件
  constructor() {
    super();
    this._provider = new UserProvider();
    this._provider.subscribe(async () => {
      await this._provider.refresh();
      this.changCallback();
    });
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
  /** 办事提供者 */
  get work(): IWorkProvider {
    return this._provider.work!;
  }
  /** 会话提供者 */
  get chat(): IChatProvider {
    return this._provider.chat!;
  }
}

export default new IndexController();
