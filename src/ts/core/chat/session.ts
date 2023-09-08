import { common, kernel, model, schema } from '../../base';
import { MessageType } from '../public';
import { IBelong } from '../target/base/belong';
import { ITarget } from '../target/base/target';
import { Collection } from '../public/collection';
import { IMessage, Message } from './message/message';
import { msgChatNotify } from './message/msgchat';
// 空时间
const nullTime = new Date('2022-07-01').getTime();
/** 会话接口类 */
export interface ISession {
  space: IBelong;
  metadata: schema.XEntity;
  isBelongPerson: boolean;
  /** 会话id */
  sessionId: string;
  /** 会话的用户 */
  target: ITarget;
  /** 消息类会话元数据 */
  chatdata: model.MsgChatData;
  /** 会话描述 */
  information: string;
  /** 会话的历史消息 */
  messages: IMessage[];
  /** 是否为群会话 */
  isGroup: boolean;
  /** 会话的成员 */
  members: schema.XTarget[];
  /** 加载更多历史消息 */
  moreMessage(): Promise<number>;
  /** 禁用通知 */
  unMessage(): void;
  /** 消息变更通知 */
  onMessage(callback: (messages: IMessage[]) => void): void;
  /** 向会话发送消息 */
  sendMessage(
    type: MessageType,
    text: string,
    mentions: string[],
    cite?: IMessage,
  ): Promise<boolean>;
  /** 撤回消息 */
  recallMessage(id: string): Promise<void>;
  /** 标记消息 */
  tagMessage(ids: string[], tag: string): Promise<void>;
  /** 删除消息 */
  deleteMessage(id: string): Promise<boolean>;
  /** 清空历史记录 */
  clearMessage(): Promise<boolean>;
}

/** 会话实现 */
export class Session implements ISession {
  sessionId: string;
  target: ITarget;
  chatdata: model.MsgChatData;
  messages: IMessage[] = [];
  metadata: schema.XEntity;
  private messageNotify?: (messages: IMessage[]) => void;
  constructor(id: string, target: ITarget, _metadata: schema.XEntity) {
    this.sessionId = id;
    this.target = target;
    this.metadata = _metadata;
    this.chatdata = {
      typeName: _metadata.typeName,
      fullId: `${target.id}_${id}`,
      labels: [],
      chatName: _metadata.name,
      chatRemark: _metadata.remark,
      isToping: false,
      noReadCount: 0,
      lastMsgTime: nullTime,
      mentionMe: false,
    };
    this.subscribe();
  }
  get userId(): string {
    return kernel.userId;
  }
  get space(): IBelong {
    return this.target.space;
  }
  get coll(): Collection<model.ChatMessageType> {
    return this.target.resource.messageColl;
  }
  get members(): schema.XTarget[] {
    return this.isGroup ? this.target.members : [];
  }
  get isGroup(): boolean {
    return this.target.id === this.sessionId && this.sessionId !== this.userId;
  }
  get sessionMatch(): any {
    return this.isGroup
      ? { toId: this.sessionId }
      : {
          formId: { _in_: [this.sessionId, this.userId] },
          toId: { _in_: [this.sessionId, this.userId] },
        };
  }
  get isBelongPerson(): boolean {
    return this.target.id === this.userId;
  }
  get information(): string {
    if (this.chatdata.lastMessage) {
      const msg = new Message(this.chatdata.lastMessage, this);
      return msg.msgTitle;
    }
    return this.metadata.remark.substring(0, 60);
  }
  async moreMessage(): Promise<number> {
    const data = await this.coll.load({
      take: 30,
      skip: this.messages.length,
      options: {
        match: this.sessionMatch,
        sort: {
          createTime: -1,
        },
      },
    });
    if (data && data.length > 0) {
      data.forEach((msg) => {
        this.messages.unshift(new Message(msg, this));
      });
      if (this.chatdata.lastMsgTime === nullTime) {
        this.chatdata.lastMsgTime = new Date(data[0].createTime).getTime();
      }
      return data.length;
    }
    return 0;
  }
  unMessage(): void {
    this.messageNotify = undefined;
  }
  onMessage(callback: (messages: IMessage[]) => void): void {
    this.messageNotify = callback;
    this.moreMessage().then(async () => {
      const ids = this.messages.filter((i) => !i.isReaded).map((i) => i.id);
      if (ids.length > 0) {
        this.tagMessage(ids, '已读');
      }
      this.chatdata.mentionMe = false;
      this.chatdata.noReadCount = 0;
      msgChatNotify.changCallback();
      this.messageNotify?.apply(this, [this.messages]);
    });
  }
  async sendMessage(
    type: MessageType,
    text: string,
    mentions: string[],
    cite?: IMessage | undefined,
  ): Promise<boolean> {
    if (cite) {
      cite.metadata.tags = [];
    }
    const data = await this.coll.insert({
      typeName: type,
      fromId: this.userId,
      toId: this.sessionId,
      comments: [],
      content: common.StringPako.deflate(
        '[obj]' +
          JSON.stringify({
            body: text,
            mentions: mentions,
            cite: cite?.metadata,
          }),
      ),
    } as unknown as model.ChatMessageType);
    if (data) {
      await this.notify('insert', [data]);
    }
    return data !== undefined;
  }
  async recallMessage(id: string): Promise<void> {
    const data = await this.coll.update(id, {
      _set_: { typeName: MessageType.Recall },
    });
    if (data) {
      await this.notify('update', [data]);
    }
  }
  async tagMessage(ids: string[], tag: string): Promise<void> {
    const data = await this.coll.updateMany(ids, {
      _push_: {
        comments: {
          label: tag,
          time: 'sysdate()',
          userId: this.userId,
        },
      },
    });
    if (data) {
      await this.notify('update', data);
    }
  }
  async deleteMessage(id: string): Promise<boolean> {
    if (this.target.id === this.userId) {
      for (const item of this.messages) {
        if (item.id === id) {
          if (await this.coll.delete(item.metadata)) {
            const index = this.messages.findIndex((i) => {
              return i.id === id;
            });
            if (index > -1) {
              this.messages.splice(index, 1);
            }
            this.chatdata.lastMsgTime = new Date().getTime();
            this.messageNotify?.apply(this, [this.messages]);
            return true;
          }
        }
      }
    }
    return false;
  }
  async clearMessage(): Promise<boolean> {
    if (this.target.id === this.userId) {
      const success = await this.coll.deleteMatch(this.sessionMatch);
      if (success) {
        this.messages = [];
        this.chatdata.lastMsgTime = new Date().getTime();
        this.messageNotify?.apply(this, [this.messages]);
        return true;
      }
    }
    return false;
  }

  subscribe(): void {
    if (this.isGroup) {
      this.coll.subscribe((res: { operate: string; data: model.ChatMessageType[] }) => {
        res.data.map((item) => this.receiveMessage(res.operate, item));
      });
    } else {
      this.coll.subscribe((res: { operate: string; data: model.ChatMessageType[] }) => {
        res.data.forEach((item) => {
          if (
            [item.fromId, item.toId].includes(this.sessionId) &&
            [item.fromId, item.toId].includes(this.userId)
          ) {
            this.receiveMessage(res.operate, item);
          }
        });
      }, this.userId);
    }
  }

  receiveMessage(operate: string, data: model.ChatMessageType): void {
    const imsg = new Message(data, this);
    if (operate === 'insert') {
      this.messages.push(imsg);
      if (!this.messageNotify) {
        this.chatdata.noReadCount += imsg.isMySend ? 0 : 1;
        if (!this.chatdata.mentionMe) {
          this.chatdata.mentionMe = imsg.mentions.includes(this.userId);
        }
        msgChatNotify.changCallback();
      } else if (!imsg.isMySend) {
        this.tagMessage([imsg.id], '已读');
      }
      this.chatdata.lastMsgTime = new Date().getTime();
      this.chatdata.lastMessage = data;
    } else {
      const index = this.messages.findIndex((i) => i.id === data.id);
      if (index > -1) {
        this.messages[index] = imsg;
      }
    }
    this.messageNotify?.apply(this, [this.messages]);
  }

  async notify(operate: string, data: model.ChatMessageType[]): Promise<boolean> {
    return await this.coll.notity(
      {
        data,
        operate,
      },
      false,
      this.sessionId,
      true,
    );
  }
}
