import { IPerson, ITarget, UserProvider } from '@/ts/core';
import { common } from '@/ts/base';
import { IWorkProvider } from '../core/work/provider';
import { IChatProvider } from '../core/chat/provider';

/** 控制器基类 */
export class Controller extends common.Emitter {
  public currentKey: string;
  constructor(key: string) {
    super();
    this.currentKey = key;
  }
}
/**
 * 设置控制器
 */
class IndexController extends Controller {
  private _provider: UserProvider;
  constructor() {
    super('');
    this._provider = new UserProvider(this);
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

  /** 所有相关的用户 */
  get targets(): ITarget[] {
    return this._provider.targets;
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
