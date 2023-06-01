import { common, model, parseAvatar } from '../../../base';
import { MessageType, TargetType } from '../../public';
import { IPerson } from '../../target/person';
import { IMsgChat } from './msgchat';
export interface IMessageLabel {
  /** 标签名称 */
  label: string;
  /** 贴标签的人 */
  labeler: model.ShareIcon;
  /** 贴标签的时间 */
  time: string;
  /** 用户Id */
  userId: string;
}
export class MessageLabel implements IMessageLabel {
  constructor(_matedata: model.MsgTagLabel, _user: IPerson) {
    this.user = _user;
    this.metadata = _matedata;
  }
  user: IPerson;
  metadata: model.MsgTagLabel;
  get label(): string {
    return this.metadata.label;
  }
  get userId(): string {
    return this.metadata.userId;
  }
  get labeler(): model.ShareIcon {
    return this.user.findShareById(this.metadata.userId);
  }
  get time(): string {
    return this.metadata.time;
  }
}
export interface IMessage {
  /** 消息id */
  id: string;
  /** 元数据 */
  metadata: model.MsgSaveModel;
  /** 发送方 */
  from: model.ShareIcon;
  /** 接收方 */
  to: model.ShareIcon;
  /** 是否是我发的 */
  isMySend: boolean;
  /** 是否已读 */
  isReaded: boolean;
  /** 标签信息 */
  labels: IMessageLabel[];
  /** 消息类型 */
  msgType: string;
  /** 消息标题 */
  msgTitle: string;
  /** 消息内容 */
  msgBody: string;
  /** 源消息 */
  msgSource: string;
  /** 创建时间 */
  createTime: string;
  /** 允许撤回 */
  allowRecall: boolean;
  /** 允许编辑 */
  allowEdit: boolean;
  /** 已读信息 */
  readedinfo: string;
  /** 已读人员 */
  readedIds: string[];
  /** 未读人员信息 */
  unreadInfo: model.ShareIcon[];
  /** 评论数 */
  comments: number;
  /** 消息撤回 */
  recall(): void;
  /** 接收标签 */
  receiveTags(tags: string[]): void;
}

export class Message implements IMessage {
  constructor(_metadata: model.MsgSaveModel, _chat: IMsgChat) {
    this._chat = _chat;
    this.user = _chat.space.user;
    if (_metadata.msgType === 'recall') {
      _metadata.msgType = MessageType.Recall;
    }
    this._msgBody = common.StringPako.inflate(_metadata.msgBody);
    this.metadata = _metadata;
    _metadata.tags?.map((tag) => {
      this.labels.push(new MessageLabel(tag, this.user));
    });
  }
  user: IPerson;
  _chat: IMsgChat;
  _msgBody: string;
  labels: IMessageLabel[] = [];
  metadata: model.MsgSaveModel;
  get id(): string {
    return this.metadata.id;
  }
  get msgType(): string {
    return this.metadata.msgType;
  }
  get createTime(): string {
    return this.metadata.createTime;
  }
  get from(): model.ShareIcon {
    return this.user.findShareById(this.metadata.fromId);
  }
  get to(): model.ShareIcon {
    return this.user.findShareById(this.metadata.toId);
  }
  get isMySend(): boolean {
    return this.metadata.fromId === this.user.id;
  }
  get isReaded(): boolean {
    return (
      this._chat.isBelongPerson ||
      this.isMySend ||
      this.labels.some((i) => i.userId === this.user.id)
    );
  }
  get readedinfo(): string {
    const ids = this.readedIds;
    if (this._chat.metadata.typeName === TargetType.Person) {
      return ids.length === 1 ? '已读' : '未读';
    }
    const mCount = this._chat.members.filter((i) => i.id != this.user.id).length || 1;
    if (ids.length === mCount) {
      return '全部已读';
    }
    if (ids.length === 0) {
      return '全部未读';
    }
    return mCount - ids.length + '人未读';
  }
  get readedIds(): string[] {
    const ids = this.labels.map((v) => v.userId);
    return ids.filter((id, i) => ids.indexOf(id) === i);
  }
  get unreadInfo(): model.ShareIcon[] {
    const ids = this.readedIds;
    return this._chat.members
      .filter((m) => !ids.includes(m.id) && m.id != this.user.id)
      .map((m) => this.user.findShareById(m.id));
  }
  get comments(): number {
    return this.labels.filter((v) => v.label != '已读').length;
  }
  get allowRecall(): boolean {
    return (
      this.msgType != MessageType.Recall &&
      this.metadata.fromId === this.user.id &&
      new Date().getTime() - new Date(this.createTime).getTime() < 2 * 60 * 1000
    );
  }
  get allowEdit(): boolean {
    return this.isMySend && this.msgType === MessageType.Recall;
  }
  get msgTitle(): string {
    let header = ``;
    if (
      this._chat.metadata.typeName != TargetType.Person &&
      this.metadata.fromId != this.user.id
    ) {
      header += `${this.from.name}`;
    }
    switch (this.msgType) {
      case MessageType.Text:
      case MessageType.Recall:
        return `${header}[消息]:${this.msgBody.substring(0, 50)}`;
    }
    const file: model.FileItemShare = parseAvatar(this.msgBody);
    if (file) {
      return `${header}[${this.msgType}]:${file.name}(${common.formatSize(file.size)})`;
    }
    return `${header}[${this.msgType}]:解析异常`;
  }
  get msgBody(): string {
    if (this.msgType === MessageType.Recall) {
      return (this.isMySend ? '我' : this.from.name) + '撤回了一条消息';
    }
    return this._msgBody;
  }
  get msgSource(): string {
    return this._msgBody;
  }
  recall(): void {
    this.metadata.msgType = MessageType.Recall;
  }
  receiveTags(tags: string[]): void {
    tags.forEach((tag) => {
      this.labels.push(new MessageLabel(JSON.parse(tag), this.user));
    });
  }
}
