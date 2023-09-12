import { common, model, schema } from '../../base';
import { Entity, IEntity, MessageType, TargetType } from '../public';
import { ITarget } from '../target/base/target';
import { XCollection } from '../public/collection';
import { IMessage, Message } from './message';
import { IActivity, Activity } from './activity';
// 空时间
const nullTime = new Date('2022-07-01').getTime();
// 消息变更推送
export const msgChatNotify = new common.Emitter();
/** 会话接口类 */
export interface ISession extends IEntity<schema.XEntity> {
  /** 是否归属人员 */
  isBelongPerson: boolean;
  /** 成员是否有我 */
  isMyChat: boolean;
  /** 是否是好友 */
  isFriend: boolean;
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
  /** 会话动态 */
  activity: IActivity;
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
  /** 缓存会话数据 */
  cacheChatData(): Promise<boolean>;
}

/** 会话实现 */
export class Session extends Entity<schema.XEntity> implements ISession {
  sessionId: string;
  target: ITarget;
  activity: IActivity;
  chatdata: model.MsgChatData;
  messages: IMessage[] = [];
  private messageNotify?: (messages: IMessage[]) => void;
  constructor(id: string, target: ITarget, _metadata: schema.XTarget, tags?: string[]) {
    super(_metadata);
    this.sessionId = id;
    this.target = target;
    if (tags === undefined) {
      tags = [_metadata.belong!.name, _metadata.typeName];
    }
    this.chatdata = {
      fullId: `${target.id}_${id}`,
      chatName: _metadata.name,
      chatRemark: _metadata.remark,
      isToping: false,
      noReadCount: 0,
      lastMsgTime: nullTime,
      mentionMe: false,
      labels: id === this.userId ? ['本人'] : tags,
    };
    this.activity = new Activity(_metadata, this);
    this.subscribeOperations();
    if (this.id != this.userId) {
      this.loadCacheChatData();
    }
  }
  get coll(): XCollection<model.ChatMessageType> {
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
          _or_: [
            { fromId: this.sessionId, toId: this.userId },
            { fromId: this.userId, toId: this.sessionId },
          ],
        };
  }
  get isBelongPerson(): boolean {
    return (
      this.metadata.belongId === this.metadata.createUser && !('stations' in this.target)
    );
  }
  get isMyChat(): boolean {
    return (
      this.metadata.typeName === TargetType.Person ||
      this.members.filter((i) => i.id === this.userId).length > 0
    );
  }
  get isFriend(): boolean {
    return (
      this.metadata.typeName !== TargetType.Person ||
      this.target.user.members.some((i) => i.id === this.sessionId)
    );
  }
  get copyId(): string | undefined {
    if (this.target.id === this.userId && this.sessionId !== this.userId) {
      return this.sessionId;
    }
    return undefined;
  }
  get information(): string {
    if (this.chatdata.lastMessage) {
      const msg = new Message(this.chatdata.lastMessage, this);
      return msg.msgTitle;
    }
    return this.metadata.remark.substring(0, 60);
  }
  async moreMessage(): Promise<number> {
    const data = await this.coll.loadSpace({
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
      this.cacheChatData();
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
      cite.metadata.comments = [];
    }
    const data = await this.coll.insert(
      {
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
      } as unknown as model.ChatMessageType,
      this.copyId,
    );
    if (data) {
      await this.notify('insert', [data], false);
    }
    return data !== undefined;
  }
  async recallMessage(id: string): Promise<void> {
    const data = await this.coll.update(
      id,
      {
        _set_: { typeName: MessageType.Recall },
      },
      this.copyId,
    );
    if (data) {
      await this.notify('replace', [data]);
    }
  }
  async tagMessage(ids: string[], tag: string): Promise<void> {
    const data = await this.coll.updateMany(
      ids,
      {
        _push_: {
          comments: {
            label: tag,
            time: 'sysdate()',
            userId: this.userId,
          },
        },
      },
      this.copyId,
    );
    if (data) {
      await this.notify('replace', data);
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

  async subscribeOperations(): Promise<void> {
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
      }, this.sessionId);
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
      } else if (!imsg.isReaded) {
        this.tagMessage([imsg.id], '已读');
      }
      this.chatdata.lastMsgTime = new Date().getTime();
      this.chatdata.lastMessage = data;
      this.cacheChatData();
    } else {
      const index = this.messages.findIndex((i) => i.id === data.id);
      if (index > -1) {
        this.messages[index] = imsg;
      }
    }
    this.messageNotify?.apply(this, [this.messages]);
  }

  async notify(
    operate: string,
    data: model.ChatMessageType[],
    onlineOnly: boolean = true,
  ): Promise<boolean> {
    return await this.coll.notity(
      {
        data,
        operate,
      },
      false,
      this.sessionId,
      true,
      onlineOnly,
    );
  }

  async loadCacheChatData(): Promise<void> {
    const data = await this.target.user.cacheObj.get<model.MsgChatData>(
      `session.${this.chatdata.fullId}`,
    );
    if (data && data.fullId === this.chatdata.fullId) {
      this.chatdata = data;
      msgChatNotify.changCallback();
    }
  }
  async cacheChatData(): Promise<boolean> {
    return this.target.user.cacheObj.set(`session.${this.chatdata.fullId}`, {
      operation: 'replaceAll',
      data: this.chatdata,
    });
  }
}
