import { model, common, schema, kernel, List } from '../../../base';
import { ShareIdSet, storeCollName } from '../../public/consts';
import { MessageType, TargetType } from '../../public/enums';
import { filetrFindText, findTextId } from '@/utils/common';
// 历史会话存储集合名称
import { IBelong } from '../../target/base/belong';
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
  /** 是否艾特我 */
  isFindme: any;
  /** 会话未读消息数量 */
  noReadCount: number;
  /** 最后一次消息时间 */
  lastMsgTime: number;
  /** 最新消息 */
  lastMessage?: model.MsgSaveModel;
};

// 标签类型
interface tagsMsgType {
  belongId: string;
  id: string;
  ids: string[];
  tags: string[];
}
// 消息类会话接口
export interface IMsgChat extends common.IEntity {
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
  /** 会话的历史消息 */
  messages: model.MsgSaveModel[];
  /** 会话的成员 */
  members: schema.XTarget[];
  /** 会话的成员的会话 */
  memberChats: PersonMsgChat[];
  /** 是否为我的会话 */
  isMyChat: boolean;
  /** 禁用通知 */
  unMessage(): void;
  /** 消息变更通知 */
  onMessage(callback: (messages: model.MsgSaveModel[]) => void): void;
  /** 缓存会话 */
  cache(): void;
  /** 加载缓存 */
  loadCache(cache: MsgChatData): void;
  /** 加载更多历史消息 */
  moreMessage(): Promise<number>;
  /** 加载成员用户实体 */
  loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  /** 向会话发送消息 */
  sendMessage(type: MessageType, text: string): Promise<boolean>;
  /** 撤回消息 */
  recallMessage(id: string): Promise<void>;
  /** 标记消息 */
  tagMessage(ids: string[], tags: string[]): Promise<void>;
  /** 标记已读消息 */
  tagHasReadMsg(ms: model.MsgSaveModel[]): void;
  /** 重写消息标记信息 */
  overwriteMessagesTags(tag: tagsMsgType): void;
  /** 删除消息 */
  deleteMessage(id: string): Promise<boolean>;
  /** 清空历史记录 */
  clearMessage(): Promise<boolean>;
  /** 会话接收到消息 */
  receiveMessage(msg: model.MsgSaveModel): void;
}

export abstract class MsgChat extends common.Entity implements IMsgChat {
  findMe: any;
  constructor(
    _userId: string,
    _belongId: string,
    _chatId: string,
    _share: model.ShareIcon,
    _labels: string[],
    _remark: string,
    _isFindMe: any,
    _space?: IBelong,
  ) {
    super();
    this.share = _share;
    this.chatId = _chatId;
    this.userId = _userId;
    this.findMe = _isFindMe;
    this.space = _space || (this as unknown as IBelong);
    this.belongId = _belongId;
    this.chatdata = {
      noReadCount: 0,
      isToping: false,
      labels: _labels,
      chatRemark: _remark,
      chatName: _share.name,
      lastMsgTime: nullTime,
      isFindme: _isFindMe,
      fullId: `${_belongId}-${_chatId}`,
    };
    this.labels = new List(_labels);
    ShareIdSet.set(this.chatId, this.share);
  }
  space: IBelong;
  chatId: string;
  belongId: string;
  labels: List<string>;
  share: model.ShareIcon;
  messages: model.MsgSaveModel[] = [];
  members: schema.XTarget[] = [];
  chatdata: MsgChatData;
  memberChats: PersonMsgChat[] = [];
  _newTagInfo: string[] = [];
  private messageNotify?: (messages: model.MsgSaveModel[]) => void;
  get userId(): string {
    return this.space.user.id;
  }
  get isMyChat(): boolean {
    if (this.chatdata.noReadCount > 0 || this.share.typeName === TargetType.Person) {
      return true;
    }
    return this.members.filter((i) => i.id === this.userId).length > 0;
  }
  unMessage(): void {
    this.messageNotify = undefined;
  }
  onMessage(callback: (messages: model.MsgSaveModel[]) => void): void {
    this.messageNotify = callback;
    if (this.chatdata.noReadCount > 0) {
      this.chatdata.noReadCount = 0;
      msgChatNotify.changCallback();
      this.cache();
    }
    if (this.messages.length < 10) {
      this.moreMessage();
    }
  }
  cache(): void {
    this.chatdata.labels = this.labels.ToArray();
    kernel.anystore.set(
      this.userId,
      storeCollName.ChatMessage + '.T' + this.chatdata.fullId,
      {
        operation: 'replaceAll',
        data: this.chatdata,
      },
    );
  }
  loadCache(cache: MsgChatData): void {
    if (this.chatdata.fullId === cache.fullId) {
      this.labels = this.labels.Union(new List<string>(cache.labels ?? []));
      this.chatdata.chatName = cache.chatName || this.chatdata.chatName;
      this.share.name = this.chatdata.chatName;
      ShareIdSet.set(this.chatId, this.share);
      cache.noReadCount = cache.noReadCount || this.chatdata.noReadCount;
      if (this.chatdata.noReadCount != cache.noReadCount) {
        this.chatdata.noReadCount = cache.noReadCount;
        msgChatNotify.changCallback();
      }
      if (Number.isInteger(cache.lastMsgTime)) {
        this.chatdata.lastMsgTime = cache.lastMsgTime;
      }
      if (cache.lastMessage && cache.lastMessage.id != this.chatdata.lastMessage?.id) {
        this.chatdata.lastMessage = cache.lastMessage;
        const index = this.messages.findIndex((i) => i.id === cache.lastMessage?.id);
        if (index > -1) {
          this.messages[index] = cache.lastMessage;
        } else {
          this.messages.push(cache.lastMessage);
          this.messageNotify?.apply(this, [this.messages]);
        }
      }
    }
  }
  async moreMessage(): Promise<number> {
    const res = await kernel.anystore.aggregate(this.userId, storeCollName.ChatMessage, {
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
    if (res && res.success && Array.isArray(res.data)) {
      this.loadMessages(res.data);
      return res.data.length;
    }
    return 0;
  }
  abstract loadMembers(reload?: boolean): Promise<schema.XTarget[]>;
  async sendMessage(type: MessageType, text: string): Promise<boolean> {
    let res = await kernel.createImMsg({
      msgType: type,
      toId: this.chatId,
      belongId: this.belongId,
      msgBody: common.StringPako.deflate(text),
    });
    return res.success;
  }
  async recallMessage(id: string): Promise<void> {
    for (const item of this.messages) {
      if (item.id === id) {
        await kernel.recallImMsg(item);
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
  // 标记已读信息 //TODO: 通过Intersection Observer来实现监听 是否进入可视区域
  tagHasReadMsg(ms: model.MsgSaveModel[]) {
    // 是否标记权限设置
    if (!this.isMyChat) {
      return;
    }
    //  获取未打标签数据
    const needTagMsgs = ms.filter((v) => {
      // 非当前会话de信息 或者自己发出的消息 不加标记
      if (this.belongId !== v.belongId || v.fromId === this.userId) {
        return false;
      }
      // 会话信息是否包含标签
      if (!v?.tags) {
        return true;
      }
      // 会话标签信息 不包含自己标记已读标签
      return !v.tags.some((s) => s.userId === this.userId && s.label === '已读');
    });
    // 过滤消息  过滤条件 belongId 不属于个人的私有消息；消息已有标签中没有自己打的‘已读’标签
    // console.log('获取未打标签数据', needTagMsgs, this.userId);
    if (needTagMsgs.length > 0) {
      const willtagMsgIds: string[] = Array.from(new Set(needTagMsgs.map((v) => v.id)));
      //拦截重复提交
      if (this._newTagInfo.join('-') === willtagMsgIds.join('-')) {
        console.log('拦截重复提交tag');
        return;
      }
      this._newTagInfo = willtagMsgIds;
      // 触发事件
      this.tagMessage(willtagMsgIds, ['已读']);
    }
  }
  // 根据tags反馈重写 消息体 标记信息
  overwriteMessagesTags = (newTag: tagsMsgType) => {
    if (newTag.id !== this.chatId) {
      return;
    }
    this.messages = this.messages.map((msg) => {
      //暂时无法从tag ids精确匹配消息临时处理 && newTag.ids.includes(msg.id) &&
      if (newTag.tags[0] === '已读' && !msg?.tags) {
        msg['tags'] = [{ label: '已读', userId: newTag.id, time: '' }];
      }
      return msg;
    });
    this.messageNotify?.apply(this, [this.messages]);
  };
  async deleteMessage(id: string): Promise<boolean> {
    const res = await kernel.anystore.remove(this.userId, storeCollName.ChatMessage, {
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
    const res = await kernel.anystore.remove(this.userId, storeCollName.ChatMessage, {
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
    if (msg.msgType === 'recall') {
      msg.showTxt = '撤回一条消息';
      msg.allowEdit = true;
      msg.msgBody = common.StringPako.inflate(msg.msgBody);
      const index = this.messages.findIndex((m) => {
        return m.id === msg.id;
      });
      if (index > -1) {
        this.messages[index] = msg;
      }
    } else {
      // 过滤掉@的消息内容
      msg.showTxt = filetrFindText(common.StringPako.inflate(msg.msgBody));
      this.messages.push(msg);
    }
    if (!this.messageNotify) {
      this.chatdata.noReadCount += 1;
      msgChatNotify.changCallback();
    }

    // 将消息提供给页面
    this.chatdata.lastMsgTime = new Date().getTime();
    this.chatdata.lastMessage = msg;
    this.chatdata.isFindme = findTextId(common.StringPako.inflate(msg.msgBody)); // 用来往对象中添加艾特值
    this.cache();
    this.messageNotify?.apply(this, [this.messages]);
  }
  private loadMessages(msgs: model.MsgSaveModel[]): void {
    msgs.forEach((item: any) => {
      item.showTxt = common.StringPako.inflate(item.msgBody);
      this.messages.unshift(item);
    });

    if (this.chatdata.lastMsgTime === nullTime && msgs.length > 0) {
      this.chatdata.lastMsgTime = new Date(msgs[0].createTime).getTime();
    }
    this.messageNotify?.apply(this, [this.messages]);
  }
}

export class PersonMsgChat extends MsgChat implements IMsgChat {
  constructor(
    _belongId: string,
    _userId: string,
    _chatId: string,
    _share: model.ShareIcon,
    _labels: string[],
    _remark: string,
    _findMe: boolean,
  ) {
    super(_userId, _belongId, _chatId, _share, _labels, _remark, _findMe);
  }
  async loadMembers(_reload: boolean = false): Promise<schema.XTarget[]> {
    return [];
  }
}
