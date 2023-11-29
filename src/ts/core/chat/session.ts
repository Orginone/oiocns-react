import { command, common, model, schema } from '../../base';
import { Entity, IEntity, MessageType, TargetType } from '../public';
import { ITarget } from '../target/base/target';
import { XCollection } from '../public/collection';
import { IMessage, Message } from './message';
import { Activity, IActivity } from './activity';
import { logger } from '@/ts/base/common';
import { sessionOperates, teamOperates } from '../public/operates';
// 空时间
const nullTime = new Date('2022-07-01').getTime();
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
  /** 会话的历史消息 */
  messages: IMessage[];
  /** 是否为群会话 */
  isGroup: boolean;
  /** 会话的成员 */
  members: schema.XTarget[];
  /** 会话动态 */
  activity: IActivity;
  /** 是否可以删除消息 */
  canDeleteMessage: boolean;
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
    forward?: IMessage[],
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
  cacheChatData(notify?: boolean): Promise<boolean>;
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
    super(_metadata, tags ?? []);
    this.sessionId = id;
    this.target = target;
    this.chatdata = {
      fullId: `${target.id}_${id}`,
      chatName: _metadata.name,
      chatRemark: _metadata.remark,
      isToping: false,
      noReadCount: 0,
      lastMsgTime: nullTime,
      mentionMe: false,
      labels: [],
      recently: false,
    };
    this.activity = new Activity(_metadata, this);
    setTimeout(
      async () => {
        await this.loadCacheChatData();
      },
      this.id === this.userId ? 100 : 0,
    );
  }
  get badgeCount(): number {
    return this.chatdata.noReadCount;
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
      ? { toId: this.sessionId, isDeleted: false }
      : {
          _or_: [
            { fromId: this.sessionId, toId: this.userId },
            { fromId: this.userId, toId: this.sessionId },
          ],
          isDeleted: false,
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
      this.members.some((i) => i.id === this.userId) ||
      this.metadata.typeName == TargetType.Group ||
      this.chatdata.noReadCount > 0
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
  get remark(): string {
    if (this.chatdata.lastMessage) {
      const msg = new Message(this.chatdata.lastMessage, this);
      return msg.msgTitle;
    }
    return this.metadata.remark.substring(0, 60);
  }
  get updateTime(): string {
    if (this.chatdata.lastMessage) {
      return this.chatdata.lastMessage.createTime;
    }
    return super.updateTime;
  }
  get cachePath(): string {
    return `session.${this.chatdata.fullId}`;
  }
  get canDeleteMessage(): boolean {
    return this.target.id === this.userId || this.target.hasRelationAuth();
  }
  get groupTags(): string[] {
    const gtags: string[] = [...super.groupTags];
    if (this.id === this.userId) {
      gtags.push('本人');
    } else if (this.isGroup) {
      if (this.target.space.id !== this.userId) {
        gtags.push(this.target.space.name);
      } else {
        gtags.push(this.target.user.findShareById(this.belongId).name);
      }
      gtags.push(this.typeName);
    }
    if (this.chatdata.noReadCount > 0) {
      gtags.push('未读');
    }
    if (this.chatdata.mentionMe) {
      gtags.push('@我');
    }
    if (this.chatdata.isToping) {
      gtags.push('置顶');
    }
    if (this.isGroup) {
      gtags.push('群聊');
    }
    return [...gtags, ...this.chatdata.labels];
  }
  override operates(): model.OperateModel[] {
    const operates: model.OperateModel[] = [];
    if (this.chatdata.isToping) {
      operates.push(sessionOperates.RemoveToping);
    } else {
      operates.push(sessionOperates.SetToping);
    }
    if (!this.isFriend && this.id !== this.userId) {
      operates.push(teamOperates.applyFriend);
    }
    if (this.chatdata.noReadCount > 0) {
      operates.push(sessionOperates.SetReaded);
    } else {
      operates.push(sessionOperates.SetNoReaded);
    }
    operates.push(sessionOperates.RemoveSession);
    return operates;
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
      if (this.chatdata.noReadCount > 0) {
        this.chatdata.noReadCount = 0;
        this.cacheChatData(true);
        command.emitterFlag('session');
      }
      this.messageNotify?.apply(this, [this.messages]);
    });
  }
  async sendMessage(
    type: MessageType,
    text: string,
    mentions: string[],
    cite?: IMessage | undefined,
    forward?: IMessage[] | undefined,
  ): Promise<boolean> {
    if (cite) {
      cite.metadata.comments = [];
    }
    if (forward) {
      forward = forward.map((item: IMessage) => {
        item.metadata.comments = [];
        return item;
      });
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
              forward: forward?.map((item) => item.metadata),
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
    if (this.canDeleteMessage) {
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
    if (this.canDeleteMessage) {
      const success = await this.coll.deleteMatch(this.sessionMatch);
      if (success) {
        this.messages = [];
        this.chatdata.lastMsgTime = new Date().getTime();
        this.messageNotify?.apply(this, [this.messages]);
        this.sendMessage(MessageType.Notify, `${this.target.user.name} 清空了消息`, []);
        return true;
      }
    }
    return false;
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
        if (this.chatdata.noReadCount > 0) {
          logger.msg(`[${this.chatdata.chatName}]:${imsg.msgTitle}`);
        }
        command.emitterFlag('session');
      } else if (!imsg.isReaded) {
        this.tagMessage([imsg.id], '已读');
      }
      this.chatdata.lastMsgTime = new Date().getTime();
      this.chatdata.lastMessage = data;
      this.cacheChatData(this.messageNotify != undefined && !imsg.isMySend);
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
    const data = await this.target.user.cacheObj.get<model.MsgChatData>(this.cachePath);
    if (data && data.fullId === this.chatdata.fullId) {
      data.labels = [];
      this.chatdata = data;
    }
    this.target.user.cacheObj.subscribe(
      this.chatdata.fullId,
      (data: model.MsgChatData) => {
        if (data && data.fullId === this.chatdata.fullId) {
          data.labels = [];
          this.chatdata = data;
          this.target.user.cacheObj.setValue(this.cachePath, data);
          command.emitterFlag('session');
        }
      },
    );
    this._subscribeMessage();
  }

  async cacheChatData(notify: boolean = false): Promise<boolean> {
    const success = await this.target.user.cacheObj.set(this.cachePath, this.chatdata);
    if (success && notify) {
      await this.target.user.cacheObj.notity(
        this.chatdata.fullId,
        this.chatdata,
        true,
        true,
      );
    }
    return success;
  }

  private _subscribeMessage(): void {
    if (this.isGroup) {
      this.coll.subscribe(
        [this.key],
        (res: { operate: string; data: model.ChatMessageType[] }) => {
          res?.data?.map((item) => this.receiveMessage(res.operate, item));
        },
      );
    } else {
      this.coll.subscribe(
        [this.key],
        (res: { operate: string; data: model.ChatMessageType[] }) => {
          res?.data?.forEach((item) => {
            if (
              [item.fromId, item.toId].includes(this.sessionId) &&
              [item.fromId, item.toId].includes(this.userId)
            ) {
              this.receiveMessage(res.operate, item);
            }
          });
        },
        this.sessionId,
      );
    }
  }
}
