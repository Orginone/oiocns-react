import { common, kernel, model } from '@/ts/base';
import { IBelong } from '../../target/base/belong';
import { storeCollName } from '../../public/consts';
/** 归属会话消息 */
export interface IChatMessage {
  /** 归属用户 */
  belong: IBelong;
  /** 会话的历史消息 */
  messages: model.MsgSaveModel[];
  /** 加载更多历史消息 */
  moreMessage(before: boolean, members?: string[]): Promise<number>;
  /** 禁用通知 */
  unMessage(): void;
  /** 消息变更通知 */
  onMessage(callback: (messages: model.MsgSaveModel[]) => void): void;
}

export class ChatMessage implements IChatMessage {
  constructor(_belong: IBelong) {
    this.belong = _belong;
  }
  belong: IBelong;
  messages: model.MsgSaveModel[] = [];
  private messageNotify?: (messages: model.MsgSaveModel[]) => void;
  unMessage(): void {
    this.messageNotify = undefined;
  }
  onMessage(callback: (messages: model.MsgSaveModel[]) => void): void {
    this.messageNotify = callback;
    if (this.messages.length < 10) {
      this.moreMessage();
    }
  }
  async moreMessage(before: boolean = true, members?: string[]): Promise<any> {
    let minTime = '2023-05-03 09:00:00.000';
    let maxTime = 'sysdate()';
    if (this.messages.length > 0) {
      if (before) {
        maxTime = this.messages[0].createTime;
      } else {
        minTime = this.messages[this.messages.length].createTime;
      }
    }
    const res = await kernel.collectionAggregate(
      this.belong.id,
      storeCollName.ChatMessage,
      {
        match: {
          belongId: this.belong.id,
          createTime: {
            _gt_: minTime,
            _lt_: maxTime,
          },
          _or_: [
            {
              fromId: {
                _in_: members,
              },
            },
            {
              toId: {
                _in_: members,
              },
            },
          ],
        },
        sort: {
          createTime: -1,
        },
        limit: 100000,
      },
    );
    if (res && res.success && Array.isArray(res.data)) {
      this.loadMessages(res.data, before);
      return res.data;
    }
    return 0;
  }
  private loadMessages(msgs: model.MsgSaveModel[], before: boolean): void {
    msgs.forEach((item: any) => {
      if (item.chatId) {
        item.id = item.chatId;
      }
      item.showTxt = common.StringPako.inflate(item.msgBody);
      if (before) {
        this.messages.unshift(item);
      } else {
        this.messages.push(item);
      }
    });
    this.messageNotify?.apply(this, [this.messages]);
  }
}
