import { IApplication, IPerson, ISession, ITarget, UserProvider } from '@/ts/core';
import { common } from '@/ts/base';
import { IWorkProvider } from '../core/work/provider';
import { IPageTemplate } from '../core/thing/standard/page';
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
  static _provider: UserProvider;
  constructor() {
    super('');
  }
  /** 是否已登录 */
  get logined(): boolean {
    return this.provider.user != undefined;
  }
  /** 数据提供者 */
  get provider(): UserProvider {
    if (IndexController._provider === undefined) {
      IndexController._provider = new UserProvider(this);
    }
    return IndexController._provider;
  }
  /** 当前用户 */
  get user(): IPerson {
    return this.provider.user!;
  }
  /** 办事提供者 */
  get work(): IWorkProvider {
    return this.provider.work!;
  }
  /** 所有相关的用户 */
  get targets(): ITarget[] {
    return this.provider.targets;
  }
  async loadApplications(): Promise<IApplication[]> {
    const apps: IApplication[] = [];
    for (const directory of this.targets
      .filter((i) => i.session.isMyChat)
      .map((a) => a.directory)) {
      apps.push(...(await directory.loadAllApplication()));
    }
    return apps;
  }
  /** 所有相关会话 */
  get chats(): ISession[] {
    const chats: ISession[] = [];
    if (this.provider.user) {
      chats.push(...this.provider.user.chats);
      for (const company of this.provider.user.companys) {
        chats.push(...company.chats);
      }
    }
    return chats;
  }
  /** 所有相关页面 */
  async loadPages(): Promise<IPageTemplate[]> {
    const pages: IPageTemplate[] = [];
    for (const directory of this.targets.map((t) => t.directory)) {
      const templates = await directory.loadAllTemplate();
      pages.push(...templates);
    }
    return pages;
  }
}

export default new IndexController();
