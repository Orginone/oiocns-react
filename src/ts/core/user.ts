import { IPerson, createPerson } from '@/ts/core';
import { schema, model, kernel, common, pageAll } from '@/ts/base';
const sessionUserName = 'sessionUser';
export default class UserProvider extends common.Emitter {
  private _user: IPerson | undefined;
  constructor() {
    super();
    const userJson = sessionStorage.getItem(sessionUserName);
    if (userJson && userJson.length > 0) {
      this._loadUser(JSON.parse(userJson));
    }
  }
  /** 当前用户 */
  get user(): IPerson | undefined {
    return this._user;
  }
  /**
   * 登录
   * @param account 账户
   * @param password 密码
   */
  public async login(account: string, password: string): Promise<model.ResultType<any>> {
    let res = await kernel.login(account, password);
    if (res.success) {
      await this._loadUser(res.data.person);
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
      await this._loadUser(res.data.person);
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
  public _loadUser(person: schema.XTarget) {
    sessionStorage.setItem(sessionUserName, JSON.stringify(person));
    this._user = createPerson(person);
    this.changCallback();
  }
  /** 重载数据 */
  public async refresh(): Promise<void> {
    await this._user?.loadMembers(pageAll());
    await this._user?.getCohorts();
    const companys = await this._user?.getJoinedCompanys();
    for (const company of companys || []) {
      await company.getCohorts();
      await company.getDepartments();
      await company.getJoinedGroups();
      await company.getStations();
      await company.getWorkings();
      await company.loadMembers(pageAll());
    }
  }
}
