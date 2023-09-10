import { MsgChatData } from '@/ts/base/model';
import { kernel } from '../../base';
import { storeCollName } from '../public/consts';
import { IPerson } from '../target/person';
import { ISession, msgChatNotify } from './session';
export interface IChatProvider {
  /** 当前用户 */
  user: IPerson;
  /** 所有会话 */
  chats: ISession[];
}

export class ChatProvider implements IChatProvider {
  constructor(_user: IPerson) {
    this.user = _user;
    kernel.subscribed(
      this.user.id,
      storeCollName.ChatMessage + '.Changed',
      (data: MsgChatData) => {
        if (data && data.fullId) {
          const find = this.chats.find((i) => i.chatdata.fullId === data.fullId);
          if (find) {
            // find.loadCache(data);
            msgChatNotify.changCallback();
          }
        }
      },
    );
  }
  user: IPerson;
  get chats(): ISession[] {
    const chats: ISession[] = [...this.user.chats];
    for (const company of this.user.companys) {
      chats.push(...company.chats);
    }
    return chats;
  }
}
