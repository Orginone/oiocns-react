import { IPerson, Person } from './target/person';
import { common, kernel, model, schema } from '../base';
import { IChatProvider, ChatProvider } from './chat/provider';
import { IWorkProvider, WorkProvider } from './work/provider';
import { OperateType } from './public/enums';
import { logger } from '../base/common';
import { msgChatNotify } from './chat/message/msgchat';
const sessionUserName = 'sessionUser';

export class UserProvider {
  private _user: IPerson | undefined;
  private _work: IWorkProvider | undefined;
  private _chat: IChatProvider | undefined;
  private _inited: boolean = false;
  private _emiter: common.Emitter;
  constructor(emiter: common.Emitter) {
    this._emiter = emiter;
    const userJson = sessionStorage.getItem(sessionUserName);
    if (userJson && userJson.length > 0) {
      this._loadUser(JSON.parse(userJson));
    }
    kernel.on('RecvTarget', (data) => {
      if (this._inited) {
        this._updateTarget(data);
      }
    });
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
    this.refresh();
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
    this._emiter.changCallback();
  }

  async _updateTarget(recvData: string) {
    const data: model.TargetOperateModel = JSON.parse(recvData);
    if (!this.user || !data) return;
    let allTarget = this.user.targets;
    this.user.companys.forEach((a) => {
      allTarget.push(...a.cohorts);
    });
    let message = '';
    switch (data.operate) {
      case OperateType.Delete:
        message = `${data.operater?.name}将${data.target.name}删除.`;
        allTarget.filter((i) => i.id === data.target.id).forEach((i) => i.delete(true));
        break;
      case OperateType.Update:
        message = `${data.operater?.name}将${data.target.name}信息更新.`;
        this.user.updateMetadata(data.target);
        break;
      case OperateType.Remove:
        if (data.subTarget) {
          let operated = false;
          for (const item of [this.user, ...this.user.companys]) {
            if (item.id === data.subTarget.id) {
              message = `${item.id === this.user.id ? '您' : item.name}已被${
                data.operater?.name
              }从${data.target.name}移除.`;
              item.parentTarget
                .filter((i) => i.id === data.target.id)
                .forEach((i) => i.delete(true));
              operated = true;
            }
          }
          if (!operated) {
            message = `${data.operater?.name}把${data.subTarget.name}从${data.target.name}移除.`;
            allTarget
              .filter(
                (i) => i.id === data.target.id || data.target.id === data.subTarget!.id,
              )
              .forEach((i) => i.removeMembers([data.subTarget!], true));
          }
        }
        break;
      case OperateType.Add:
        if (data.subTarget) {
          let operated = false;
          message = `${data.operater?.name}把${data.subTarget.name}与${data.target.name}建立关系.`;
          for (const item of [this.user, ...this.user.companys]) {
            if (
              item.id === data.subTarget.id &&
              (await item.teamChangedNotity(data.target))
            ) {
              operated = true;
            }
          }
          if (!operated) {
            for (const item of allTarget) {
              if (item.id === data.target.id) {
                await item.teamChangedNotity(data.subTarget);
              }
            }
          }
        }
    }
    if (message.length > 0) {
      if (data.operater?.id != this.user.id) {
        logger.info(message);
      }
      msgChatNotify.changCallback();
      this._emiter.changCallback();
    }
  }
}
