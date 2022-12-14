import { TargetShare } from '@/ts/base/model';
import { schema, kernel, model, common, parseAvatar } from '../../base';
import { TargetType, MessageType } from '../enum';
import { appendShare, appendTarget } from '../target/targetMap';
import { ChatCache, IChat } from './ichat';

// 历史会话存储集合名称
const hisMsgCollName = 'chat-message';
/**
 * 会话基类
 * @abstract
 */
class BaseChat implements IChat {
  fullId: string;
  chatId: string;
  spaceId: string;
  spaceName: string;
  isToping: boolean;
  target: model.ChatModel;
  messages: schema.XImMsg[];
  persons: schema.XTarget[];
  personCount: number;
  noReadCount: number;
  userId: string;
  lastMessage: schema.XImMsg | undefined;
  constructor(id: string, name: string, m: model.ChatModel, userId: string) {
    this.spaceId = id;
    this.spaceName = name;
    this.target = m;
    this.messages = [];
    this.persons = [];
    this.personCount = 0;
    this.chatId = m.id;
    this.noReadCount = 0;
    this.isToping = false;
    this.userId = userId;
    this.fullId = this.spaceId + '-' + this.chatId;
    appendShare(m.id, this.shareInfo);
  }

  public get shareInfo(): TargetShare {
    const result: TargetShare = {
      name: this.target.name,
      typeName: this.target.typeName,
    };
    result.avatar = parseAvatar(this.target.photo);
    return result;
  }

  getCache(): ChatCache {
    return {
      chatId: this.chatId,
      spaceId: this.spaceId,
      isToping: this.isToping,
      lastMessage: this.lastMessage,
      noReadCount: this.noReadCount,
    };
  }
  loadCache(cache: ChatCache): void {
    if (cache.lastMessage?.id != this.lastMessage?.id) {
      if (cache.lastMessage) {
        this.messages.push(cache.lastMessage);
      }
    }
    this.isToping = cache.isToping;
    this.noReadCount = cache.noReadCount;
    this.lastMessage = cache.lastMessage;
  }
  async clearMessage(): Promise<boolean> {
    if (this.spaceId === this.userId) {
      const res = await kernel.anystore.remove(
        hisMsgCollName,
        {
          sessionId: this.target.id,
          spaceId: this.spaceId,
        },
        'user',
      );
      if (res.success) {
        this.messages = [];
        return true;
      }
    }
    return false;
  }
  async deleteMessage(id: string): Promise<boolean> {
    if (this.spaceId === this.userId) {
      const res = await kernel.anystore.remove(
        hisMsgCollName,
        {
          chatId: id,
        },
        'user',
      );
      if (res.success && res.data > 0) {
        const index = this.messages.findIndex((i) => {
          return i.id === id;
        });
        if (index > -1) {
          this.messages.splice(index, 1);
        }
        return true;
      }
    }
    return false;
  }
  async reCallMessage(id: string): Promise<void> {
    for (const item of this.messages) {
      if (item.id === id) {
        await kernel.recallImMsg(item);
      }
    }
  }
  async morePerson(filter: string): Promise<void> {
    await common.sleep(0);
  }
  async moreMessage(filter: string): Promise<number> {
    await common.sleep(0);
    return 0;
  }
  async sendMessage(type: MessageType, text: string): Promise<boolean> {
    let res = await kernel.createImMsg({
      msgType: type,
      toId: this.target.id,
      spaceId: this.spaceId,
      fromId: this.userId,
      msgBody: common.StringPako.deflate(text),
    });
    return res.success;
  }
  receiveMessage(msg: schema.XImMsg, noread: boolean = true) {
    if (msg) {
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
        msg.showTxt = common.StringPako.inflate(msg.msgBody);
        this.messages.push(msg);
      }
      this.noReadCount += noread ? 1 : 0;
      this.lastMessage = msg;
    }
  }
  protected loadMessages(msgs: schema.XImMsg[]): void {
    msgs.forEach((item: any) => {
      if (item.chatId) {
        item.id = item.chatId;
      }
      item.showTxt = common.StringPako.inflate(item.msgBody);
      this.messages.unshift(item);
    });
  }
  protected async loadCacheMessages(): Promise<number> {
    const res = await kernel.anystore.aggregate(
      hisMsgCollName,
      {
        match: {
          sessionId: this.target.id,
          spaceId: this.spaceId,
        },
        sort: {
          createTime: -1,
        },
        skip: this.messages.length,
        limit: 30,
      },
      'user',
    );
    if (res && res.success && Array.isArray(res.data)) {
      this.loadMessages(res.data);
      return res.data.length;
    }
    return 0;
  }
}

/**
 * 人员会话
 */
class PersonChat extends BaseChat {
  constructor(id: string, name: string, m: model.ChatModel, userId: string) {
    super(id, name, m, userId);
  }
  override async moreMessage(filter: string): Promise<number> {
    if (this.spaceId === this.userId) {
      return await this.loadCacheMessages();
    } else {
      let res = await kernel.queryFriendImMsgs({
        id: this.target.id,
        spaceId: this.spaceId,
        page: {
          limit: 30,
          offset: this.messages.length,
          filter: filter,
        },
      });
      if (res && res.success && Array.isArray(res.data)) {
        this.loadMessages(res.data);
        return res.data.length;
      }
    }
    return 0;
  }
}

/**
 * 群会话
 */
class CohortChat extends BaseChat {
  constructor(id: string, name: string, m: model.ChatModel, userId: string) {
    super(id, name, m, userId);
  }
  override async moreMessage(filter: string): Promise<number> {
    if (this.spaceId === this.userId) {
      return await this.loadCacheMessages();
    } else {
      const res = await kernel.queryCohortImMsgs({
        id: this.target.id,
        page: {
          limit: 30,
          offset: this.messages.length,
          filter: filter,
        },
      });
      if (res && res.success && Array.isArray(res.data)) {
        this.loadMessages(res.data);
        return res.data.length;
      }
    }
    return 0;
  }
  override async morePerson(filter: string): Promise<void> {
    let res = await kernel.querySubTargetById({
      id: this.target.id,
      typeNames: [this.target.typeName],
      subTypeNames: [TargetType.Person],
      page: {
        offset: this.persons.length,
        limit: 1000,
        filter: filter,
      },
    });
    if (res.success && res.data && res.data.result) {
      appendTarget(res.data.result);
      res.data.result.forEach((item) => {
        item.name = item.team?.name ?? item.name;
        this.persons.push(item);
      });
      this.personCount = res.data?.total ?? 0;
    }
  }
}

export const CreateChat = (
  id: string,
  name: string,
  m: model.ChatModel,
  userId: string,
): IChat => {
  if (m.typeName === TargetType.Person) {
    return new PersonChat(id, name, m, userId);
  } else {
    return new CohortChat(id, name, m, userId);
  }
};
