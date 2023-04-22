import { IPerson, TargetType, createPerson, findTargetShare } from '@/ts/core';
import { schema, model, kernel, common, pageAll } from '@/ts/base';
const sessionUserName = 'sessionUser';
export default class UserProvider extends common.Emitter {
  private _user: IPerson | undefined;
  private _inited: boolean = false;
  private _preMessages: schema.XImMsg[] = [];
  constructor() {
    super();
    kernel.on('ChatRefresh', async () => {
      await this.refresh();
    });
    kernel.on('RecvMsg', (data) => {
      if (this._inited) {
        this._recvMessage(data);
      } else {
        this._preMessages.push(data);
      }
    });
    const userJson = sessionStorage.getItem(sessionUserName);
    if (userJson && userJson.length > 0) {
      this._loadUser(JSON.parse(userJson));
    }
  }
  /** 当前用户 */
  get user(): IPerson | undefined {
    return this._user;
  }
  /** 是否完成初始化 */
  get inited(): boolean {
    return this._inited;
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
  /** 检索用户信息 */
  public findUserById(id: string): model.TargetShare {
    return findTargetShare(id);
  }
  /** 根据ID查询名称 */
  public findNameById(id: string): string {
    return findTargetShare(id).name;
  }
  /** 加载用户 */
  private _loadUser(person: schema.XTarget) {
    sessionStorage.setItem(sessionUserName, JSON.stringify(person));
    this._user = createPerson(person);
    this.changCallback();
  }
  /** 重载数据 */
  public async refresh(): Promise<void> {
    this._inited = false;
    await this._user?.getCohorts();
    await this._user?.loadMembers(pageAll());
    const companys = await this._user?.getJoinedCompanys();
    for (const company of companys || []) {
      await company.deepLoad();
      await company.loadMembers(pageAll());
    }
    this._inited = true;
    this._preMessages = this._preMessages.filter((item) => {
      this._recvMessage(item);
      return false;
    });
  }
  /**
   * 接收到新信息
   * @param data 新消息
   * @param cache 是否缓存
   */
  private _recvMessage(data: schema.XImMsg): void {
    let sessionId = data.toId;
    if (data.toId === this._user!.id) {
      sessionId = data.fromId;
    }
    for (const c of this.user!.allChats()) {
      let isMatch = sessionId === c.chatId;
      if (c.target.typeName == TargetType.Person && isMatch) {
        isMatch = data.belongId == c.spaceId;
      }
      if (isMatch) {
        c.receiveMessage(data);
      }
    }
  }
}
