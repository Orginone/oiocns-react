import { model, common, schema, kernel, List } from '../../../base';
import { IBelong } from '../../target/base/belong';
import { IMessage, Message } from './message';
import { IEntity, Entity, MessageType, TargetType, storeCollName } from '../../public';
import { XTarget } from '@/ts/base/schema';
import { IDirectory } from '../../thing/directory';
// 空时间
const nullTime = new Date('2022-07-01').getTime();
// 消息变更推送
export const msgChatNotify = new common.Emitter();
/** 会话元数据 */
export type MsgChatData = {
  /** 消息类会话完整Id */
  fullId: string;
  /** 会话标签 */
  labels: string[];
  /** 会话名称 */
  chatName: string;
  /** 会话备注 */
  chatRemark: string;
  /** 是否置顶 */
  isToping: boolean;
  /** 会话未读消息数量 */
  noReadCount: number;
  /** 最后一次消息时间 */
  lastMsgTime: number;
  /** 最新消息 */
  lastMessage?: model.MsgSaveModel;
  /** 提及我 */
  mentionMe: boolean;
};

// 消息类会话接口
interface IChat {
  /** 消息类会话元数据 */
  chatdata: MsgChatData;
  /** 回话的标签列表 */
  labels: List<string>;
  /** 会话Id */
  chatId: string;
  /** 当前用户Id */
  userId: string;
  /** 会话归属Id */
  belongId: string;
  /** 加载会话的自归属用户 */
  space: IBelong;
  /** 共享信息 */
  share: model.ShareIcon;
  /** 会话描述 */
  information: string;
  /** 会话的历史消息 */
  messages: IMessage[];
  /** 会话的成员 */
  members: schema.XTarget[];
  /** 会话的成员的会话 */
  memberChats: PersonMsgChat[];
  /** 是否为我的会话 */
  isMyChat: boolean;
  /** 是否归属人员用户 */
  isBelongPerson: boolean;
  /** 是否为我的好友 */
  isFriend: boolean;
  /** 会话的目录 */
  directory: IDirectory;
  /** 禁用通知 */
  unMessage(): void;
  /** 消息变更通知 */
  onMessage(callback: (messages: IMessage[]) => void): void;
  /** 缓存会话 */
  cache(): void;
  /** 加载缓存 */
  loadCache(cache: MsgChatData): void;
  /** 加载更多历史消息 */
  moreMessage(): Promise<number>;
  /** 加载成员用户实体 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
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
  tagMessage(ids: string[], tags: string[]): Promise<void>;
  /** 删除消息 */
  deleteMessage(id: string): Promise<boolean>;
  /** 清空历史记录 */
  clearMessage(): Promise<boolean>;
  /** 会话接收到消息 */
  receiveMessage(msg: model.MsgSaveModel): void;
  /** 会话接收标签 */
  receiveTags(ids: string[], tags: string[]): void;
}

// 消息类会话接口
export interface IMsgChat extends IChat, IEntity<schema.XEntity> {}

export interface IMsgChatT<T extends schema.XEntity> extends IChat, IEntity<T> {}

export abstract class MsgChat<T extends schema.XEntity>
  extends Entity<T>
  implements IMsgChatT<T>
{
  findMe: any;
  constructor(
    _metadata: T,
    _labels: string[],
    _space?: IBelong,
    _belong?: schema.XTarget,
    _isFindMe?: any,
  ) {
    super(_metadata);
    this.chatId = _metadata.id;
    this.space = _space || (this as unknown as IBelong);
    this._belong = _belong || this.space.metadata;
    this.findMe = _isFindMe;
    this.chatdata = {
      noReadCount: 0,
      labels: _labels,
      isToping: _labels.includes('置顶'),
      chatRemark: _metadata.remark,
      chatName: _metadata.name,
      lastMsgTime: nullTime,
      mentionMe: false,
      fullId: `${this._belong.id}-${_metadata.id}`,
    };
    this.labels = new List(_labels);
  }
  space: IBelong;
  chatId: string;
  labels: List<string>;
  messages: IMessage[] = [];
  members: schema.XTarget[] = [];
  chatdata: MsgChatData;
  _belong: schema.XTarget;
  memberChats: PersonMsgChat[] = [];
  abstract directory: IDirectory;
  private messageNotify?: (messages: IMessage[]) => void;
  get userId(): string {
    return this.space.user.id;
  }
  get belongId(): string {
    return this._belong.id;
  }
  get isBelongPerson(): boolean {
    return this._belong.typeName === TargetType.Person;
  }
  get isMyChat(): boolean {
    if (this.chatdata.noReadCount > 0 || this.share.typeName === TargetType.Person) {
      return true;
    }
    return this.members.filter((i) => i.id === this.userId).length > 0;
  }
  get information(): string {
    if (this.chatdata.lastMessage) {
      const msg = new Message(this.chatdata.lastMessage, this);
      return msg.msgTitle;
    }
    return this.remark.substring(0, 60);
  }
  get isFriend(): boolean {
    if (this.typeName === TargetType.Person && this.id != this.userId) {
      if (this.space.user.members.every((i) => i.id != this.id)) {
        return false;
      }
    }
    return true;
  }
  unMessage(): void {
    this.messageNotify = undefined;
  }
  onMessage(callback: (messages: IMessage[]) => void): void {
    this.messageNotify = callback;
    this.moreMessage().then(async () => {
      await this.loadMembers();
      if (this.chatdata.noReadCount > 0) {
        const ids = this.messages.filter((i) => !i.isReaded).map((i) => i.id);
        if (ids.length > 0) {
          this.tagMessage(ids, ['已读']);
        }
        this.chatdata.mentionMe = false;
        this.chatdata.noReadCount = 0;
        msgChatNotify.changCallback();
        this.cache();
      }
      this.messageNotify?.apply(this, [this.messages]);
    });
  }
  cache(): void {
    this.chatdata.labels = this.labels.ToArray();
    kernel.objectSet(
      this.userId,
      storeCollName.ChatMessage + '.T' + this.chatdata.fullId,
      {
        operation: 'replaceAll',
        data: this.chatdata,
      },
    );
    if (this.chatdata.noReadCount === 0) {
      kernel.objectSet(this.userId, storeCollName.ChatMessage + '.Changed', {
        operation: 'replaceAll',
        data: this.chatdata,
      });
    }
  }
  loadCache(cache: MsgChatData): void {
    if (this.chatdata.fullId === cache.fullId) {
      this.labels = this.labels.Union(new List<string>(cache.labels ?? []));
      this.chatdata.chatName = cache.chatName || this.chatdata.chatName;
      this.chatdata.labels = this.labels.ToArray();
      this.chatdata.isToping = this.chatdata.labels.includes('置顶');
      this.share.name = this.chatdata.chatName;
      if (cache.noReadCount === undefined) {
        cache.noReadCount = this.chatdata.noReadCount;
      }
      if (this.chatdata.noReadCount != cache.noReadCount) {
        this.chatdata.noReadCount = cache.noReadCount;
        msgChatNotify.changCallback();
      }
      if (Number.isInteger(cache.lastMsgTime)) {
        this.chatdata.lastMsgTime = cache.lastMsgTime;
      }
      this.chatdata.lastMessage = cache.lastMessage;
    }
  }
  async moreMessage(): Promise<number> {
    const res = await kernel.collectionAggregate(this.userId, storeCollName.ChatMessage, {
      match: {
        sessionId: this.chatId,
        belongId: this.belongId,
      },
      sort: {
        createTime: -1,
      },
      skip: this.messages.length,
      limit: 30,
    });
    if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
      res.data.forEach((msg) => {
        this.messages.unshift(new Message(msg, this));
      });
      if (this.chatdata.lastMsgTime === nullTime) {
        this.chatdata.lastMsgTime = new Date(res.data[0].createTime).getTime();
      }
      return res.data.length;
    }
    return 0;
  }
  abstract loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  async sendMessage(
    type: MessageType,
    text: string,
    mentions: string[],
    cite?: IMessage,
  ): Promise<boolean> {
    if (cite) {
      cite.metadata.tags = [];
    }
    let res = await kernel.createImMsg({
      msgType: type,
      toId: this.chatId,
      belongId: this.belongId,
      msgBody: common.StringPako.deflate(
        '[obj]' +
          JSON.stringify({
            body: text,
            mentions: mentions,
            cite: cite?.metadata,
          }),
      ),
    });
    return res.success;
  }
  async recallMessage(id: string): Promise<void> {
    for (const item of this.messages) {
      if (item.id === id) {
        await kernel.recallImMsg(item.metadata);
      }
    }
  }
  async tagMessage(ids: string[], tags: string[]): Promise<void> {
    ids = this.messages.filter((i) => ids.includes(i.id)).map((i) => i.id);
    if (ids.length > 0 && tags.length > 0) {
      await kernel.tagImMsg({
        ids: ids,
        tags: tags,
        id: this.chatId,
        belongId: this.belongId,
      });
    }
  }
  async deleteMessage(id: string): Promise<boolean> {
    const res = await kernel.collectionRemove(this.userId, storeCollName.ChatMessage, {
      chatId: id,
    });
    if (res.success && res.data > 0) {
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
    return false;
  }
  async clearMessage(): Promise<boolean> {
    const res = await kernel.collectionRemove(this.userId, storeCollName.ChatMessage, {
      sessionId: this.chatId,
      belongId: this.belongId,
    });
    if (res.success) {
      this.messages = [];
      this.chatdata.lastMsgTime = new Date().getTime();
      this.messageNotify?.apply(this, [this.messages]);
      return true;
    }
    return false;
  }
  receiveMessage(msg: model.MsgSaveModel): void {
    const imsg = new Message(msg, this);
    if (imsg.msgType === MessageType.Recall) {
      this.messages
        .find((m) => {
          return m.id === msg.id;
        })
        ?.recall();
    } else {
      this.messages.push(imsg);
    }
    if (!this.messageNotify) {
      this.chatdata.noReadCount += imsg.isMySend ? 0 : 1;
      if (!this.chatdata.mentionMe) {
        this.chatdata.mentionMe = imsg.mentions.includes(this.userId);
      }
      msgChatNotify.changCallback();
    } else if (!imsg.isMySend) {
      this.tagMessage([imsg.id], ['已读']);
    }
    this.chatdata.lastMsgTime = new Date().getTime();
    this.chatdata.lastMessage = msg;
    this.cache();
    this.messageNotify?.apply(this, [this.messages]);
  }
  receiveTags(ids: string[], tags: string[]): void {
    if (ids && tags && ids.length > 0 && tags.length > 0) {
      ids.forEach((id) => {
        this.messages
          .find((m) => {
            return m.id === id;
          })
          ?.receiveTags(tags);
      });
      this.cache();
      this.messageNotify?.apply(this, [this.messages]);
    }
  }
}

export class PersonMsgChat
  extends MsgChat<schema.XTarget>
  implements IMsgChatT<schema.XTarget>
{
  constructor(
    _metadata: schema.XTarget,
    _labels: string[],
    _space: IBelong,
    _belong?: XTarget,
    _findMe?: boolean,
  ) {
    super(_metadata, _labels, _space, _belong, _findMe);
    this.directory = _space?.directory;
  }
  directory: IDirectory;
  async loadMembers(_reload: boolean = false): Promise<schema.XTarget[]> {
    return [];
  }
}
