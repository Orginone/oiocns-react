import { kernel, model } from '../../base';
import { storeCollName } from '../public/consts';
import { TargetType } from '../public/enums';
import { IPerson } from '../target/person';
import { IMsgChat, MsgChatData, msgChatNotify } from './message/msgchat';
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
  private _preTags: model.MsgTagModel[] = [];
  constructor(_user: IPerson) {
    this.user = _user;
    kernel.on('RecvMsg', (data: model.MsgSaveModel) => {
      if (!this._preMessage) {
        this._chatReceive(data.sessionId, data.belongId, (c) => {
          c.receiveMessage(data);
        });
      } else {
        this._preMessages.push(data);
      }
    });
    kernel.on('RecvTags', (data: model.MsgTagModel) => {
      if (!this._preMessage) {
        this._chatReceive(data.id, data.belongId, (c) => {
          c.receiveTags(data.ids, data.tags);
        });
      } else {
        this._preTags.push(data);
      }
    });
    kernel.subscribed(
      this.user.id,
      storeCollName.ChatMessage + '.Changed',
      (data: MsgChatData) => {
        if (data && data.fullId) {
          const find = this.chats.find((i) => i.chatdata.fullId === data.fullId);
          find?.loadCache(data);
        }
      },
    );
  }
  user: IPerson;
  PreMessage(): void {
    this._preMessage = true;
  }
  /** 加载挂起的消息 */
  loadPreMessage(): void {
    kernel.objectGet<any>(this.user.id, storeCollName.ChatMessage).then((res) => {
      if (res.success) {
        if (typeof res.data === 'object') {
          Object.keys(res.data).forEach((key) => {
            if (key && key.startsWith('T') && 'fullId' in res.data[key]) {
              const fullId = key.substring(1);
              const find = this.chats.find((i) => i.chatdata.fullId === fullId);
              find?.loadCache(res.data[key]);
            }
          });
        }
        this._preMessages = this._preMessages
          .sort((a, b) => {
            return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
          })
          .filter((item) => {
            this._chatReceive(item.sessionId, item.belongId, (c) => {
              c.receiveMessage(item);
            });
            return false;
          });
        this._preTags = this._preTags.filter((item) => {
          this._chatReceive(item.id, item.belongId, (c) => {
            c.receiveTags(item.ids, item.tags);
          });
          return false;
        });
        this._preMessage = false;
        msgChatNotify.changCallback();
      }
    });
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
  private _chatReceive(
    chatId: string,
    belongId: string,
    action: (c: IMsgChat) => void,
  ): void {
    for (const c of this.chats) {
      let isMatch = chatId === c.chatId;
      if ((c.typeName === TargetType.Person || c.typeName === '权限') && isMatch) {
        isMatch = belongId == c.belongId;
      }
      if (isMatch) {
        action.apply(this, [c]);
      }
    }
  }
}
