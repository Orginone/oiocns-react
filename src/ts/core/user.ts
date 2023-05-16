import { common, kernel, model, schema } from '../base';
import { XTarget } from '../base/schema';
import { IPerson, Person } from './target/person';
import { IChatProvider, ChatProvider } from './chat/provider';
import { IWorkProvider, WorkProvider } from './work/provider';
const sessionUserName = 'sessionUser';

export class UserProvider extends common.Emitter {
  private _user: IPerson | undefined;
  private _work: IWorkProvider | undefined;
  private _chat: IChatProvider | undefined;
  private _inited: boolean = false;
  constructor() {
    super();
    kernel.on('RecvTarget', (data) => {
      if (this._inited) {
        this._recvTarget(data);
      }
    });
    kernel.on(
      'RecvTags',
      (data: { id: string; belongId: string; ids: string[]; tags: string[] }) => {
        const currentChat = this._user?.chats.find(
          (v) => v.chatId === data.id && v.belongId === data.belongId,
        );
        //TODO: 单位下同事之间聊天，tag反馈无法匹配到自己发出消息后，对方读取tag后，无法匹配到对应聊天会话
        // console.log(
        //   data,
        //   this._user?.chats,
        //   currentChat,
        //   'currentChat----------',
        //   this._user?.chats.filter((v) => v.chatId === data.id),
        // );
        currentChat?.overwriteMessagesTags(data);
      },
    );
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
  /** 会话 */
  get chat(): IChatProvider | undefined {
    return this._chat;
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
  private _loadUser(person: schema.XTarget) {
    sessionStorage.setItem(sessionUserName, JSON.stringify(person));
    this._user = new Person(person);
    this._chat = new ChatProvider(this._user);
    this._work = new WorkProvider(this._user);
    this.changCallback();
  }
  /** 更新用户 */
  public update(person: schema.XTarget) {
    sessionStorage.setItem(sessionUserName, JSON.stringify(person));
  }
  /** 重载数据 */
  public async refresh(): Promise<void> {
    this._inited = false;
    this._chat?.PreMessage();
    await this._user?.deepLoad(true);
    await this.work?.loadTodos(true);
    this._inited = true;
    this._chat?.loadPreMessage();
  }
  /**
   * 接收到用户信息
   * @param data 新消息
   * @param cache 是否缓存
   */
  private _recvTarget(data: any): void {
    switch (data['TypeName']) {
      case 'Relation':
        {
          let subTarget = data['SubTarget'] as XTarget;
          let target = [this._user!, ...this.user!.targets].find(
            (a) => a.metadata.id == (data['Target'] as XTarget).id,
          );
          if (target) {
            switch (data['Operate']) {
              case 'Add':
                target.members.push(subTarget);
                target.loadMemberChats([subTarget], true);
                break;
              case 'Remove':
                target.members = target.members.filter((a) => a.id != subTarget.id);
                target.loadMemberChats([subTarget], false);
                break;
              default:
                break;
            }
          }
        }
        break;
      default:
        break;
    }
  }
}
