import { IPerson, Person } from './target/person';
import { command, common, kernel, model, schema } from '../base';
import { IWorkProvider, WorkProvider } from './work/provider';
import { ITarget } from './target/base/target';

const sessionUserName = 'sessionUser';

/** 当前用户提供层 */
export class UserProvider {
  private _user: IPerson | undefined;
  private _work: IWorkProvider | undefined;
  private _inited: boolean = false;
  private _emiter: common.Emitter;
  constructor(emiter: common.Emitter) {
    this._emiter = emiter;
    const userJson = sessionStorage.getItem(sessionUserName);
    if (userJson && userJson.length > 0) {
      this._loadUser(JSON.parse(userJson));
    }
  }
  /** 当前用户 */
  get user(): IPerson | undefined {
    return this._user;
  }
  /** 办事提供层 */
  get work(): IWorkProvider | undefined {
    return this._work;
  }
  /** 是否完成初始化 */
  get inited(): boolean {
    return this._inited;
  }
  /** 所有相关的用户 */
  get targets(): ITarget[] {
    const targets: ITarget[] = [];
    if (this._user) {
      targets.push(...this._user.targets);
      for (const company of this._user.companys) {
        targets.push(...company.targets);
      }
    }
    return targets;
  }
  /**
   * 登录
   * @param account 账户
   * @param password 密码
   */
  public async login(account: string, password: string): Promise<model.ResultType<any>> {
    let res = await kernel.login(account, password);
    if (res.success) {
      await this._loadUser(res.data.target);
    }
    return res;
  }
  /**
   * 注册用户
   * @param {RegisterType} params 参数
   */
  public async register(params: model.RegisterType): Promise<model.ResultType<any>> {
    let res = await kernel.register(params);
    if (res.success) {
      await this._loadUser(res.data.target);
    }
    return res;
  }
  /**
   * 变更密码
   * @param account 账号
   * @param password 密码
   * @param privateKey 私钥
   * @returns
   */
  public async resetPassword(
    account: string,
    password: string,
    privateKey: string,
  ): Promise<model.ResultType<any>> {
    return await kernel.resetPassword(account, password, privateKey);
  }
  /** 加载用户 */
  private async _loadUser(person: schema.XTarget) {
    sessionStorage.setItem(sessionUserName, JSON.stringify(person));
    kernel.userId = person.id;
    this._user = new Person(person);
    this._work = new WorkProvider(this);
    this.refresh();
  }
  /** 重载数据 */
  public async refresh(): Promise<void> {
    this._inited = false;
    await this._user?.deepLoad(true);
    await this.work?.loadTodos(true);
    this._inited = true;
    this._emiter.changCallback();
    command.emitterFlag('', true);
  }
}
