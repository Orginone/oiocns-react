import { kernel, model } from '../../base';
import { TargetType } from '../public/enums';
import { IPerson } from '../target/person';
import { IMsgChat } from './message/msgchat';
export interface IChatProvider {
  /** 当前用户 */
  user: IPerson;
  /** 所有会话 */
  chats: IMsgChat[];
  /** 挂起消息 */
  PreMessage(): void;
  /** 加载消息 */
  loadPreMessage(): void;
}

export class ChatProvider implements IChatProvider {
  private _preMessage: boolean = true;
  private _preMessages: model.MsgSaveModel[] = [];
  constructor(_user: IPerson) {
    this.user = _user;
    kernel.on('RecvMsg', (data) => {
      if (!this._preMessage) {
        this._recvMessage(data);
      } else {
        this._preMessages.push(data);
      }
    });
  }
  user: IPerson;
  PreMessage(): void {
    this._preMessage = true;
  }
  /** 加载挂起的消息 */
  loadPreMessage(): void {
    this._preMessages = this._preMessages
      .sort((a, b) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      })
      .filter((item) => {
        this._recvMessage(item);
        return false;
      });
    this._preMessage = false;
  }
  get chats(): IMsgChat[] {
    const chats: IMsgChat[] = [...this.user.chats];
    for (const company of this.user.companys) {
      chats.push(...company.chats);
    }
    return chats;
  }
  /**
   * 接收到新信息
   * @param data 新消息
   * @param cache 是否缓存
   */
  private _recvMessage(data: model.MsgSaveModel): void {
    for (const c of this.chats) {
      let isMatch = data.sessionId === c.chatId;
      if (
        (c.share.typeName === TargetType.Person || c.share.typeName === '权限') &&
        isMatch
      ) {
        isMatch = data.belongId == c.belongId;
      }
      if (isMatch) {
        c.receiveMessage(data);
      }
    }
  }
}
