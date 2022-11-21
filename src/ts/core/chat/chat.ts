import { schema, kernel, model } from '../../base';
import { TargetType, MessageType } from '../enum';
import Provider from '../provider';
import { StringPako } from '@/utils/package';
import { sleep } from '@/store/sleep';
import { ChatCache, IChat } from './ichat';

// 历史会话存储集合名称
const hisMsgCollName = 'chat-message';
/**
 * 会话基类
 * @abstract
 */
class BaseChat implements IChat {
  chatId: string;
  spaceId: string;
  spaceName: string;
  target: model.ChatModel;
  messages: schema.XImMsg[];
  persons: schema.XTarget[];
  personCount: number;
  noReadCount: number;
  lastMessage: schema.XImMsg | undefined;
  constructor(id: string, name: string, m: model.ChatModel) {
    this.spaceId = id;
    this.spaceName = name;
    this.target = m;
    this.messages = [];
    this.persons = [];
    this.personCount = 0;
    this.chatId = m.id;
    this.noReadCount = 0;
  }
  getCache(): ChatCache {
    return {
      chatId: this.chatId,
      spaceId: this.spaceId,
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
    this.noReadCount = cache.noReadCount;
    this.lastMessage = cache.lastMessage;
  }
  clearMessage(): void {
    throw new Error('Method not implemented.');
  }
  deleteMessage(id: string): void {
    throw new Error('Method not implemented.');
  }
  async reCallMessage(id: string): Promise<boolean> {
    for (const item of this.messages) {
      if (item.id === id) {
        const res = await kernel.recallImMsg(item);
        return res.success;
      }
    }
    return false;
  }
  async morePerson(filter: string): Promise<void> {
    await sleep(0);
  }
  moreMessage(filter: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  async sendMessage(type: MessageType, text: string): Promise<boolean> {
    let res = await kernel.createImMsg({
      msgType: type,
      msgBody: text,
      toId: this.target.id,
      spaceId: this.spaceId,
      fromId: Provider.userId,
    });
    return res.success;
  }
  receiveMessage(msg: schema.XImMsg, noread: boolean = true) {
    if (msg.id !== this.lastMessage?.id) {
      this.noReadCount += noread ? 1 : 0;
      this.lastMessage = msg;
      this.messages.push(msg);
    }
  }
}

/**
 * 人员会话
 */
class PersonChat extends BaseChat {
  constructor(id: string, name: string, m: model.ChatModel) {
    super(id, name, m);
  }
  override async moreMessage(filter: string): Promise<void> {
    let res;
    if (this.spaceId === Provider.userId) {
      res = await kernel.anystore?.aggregate(
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
    } else {
      res = await kernel.queryFriendImMsgs({
        id: this.target.id,
        spaceId: this.spaceId,
        page: {
          limit: 30,
          offset: this.messages.length,
          filter: filter,
        },
      });
    }
    if (res?.success && Array.isArray(res?.data)) {
      res.data.forEach((item: any) => {
        item.id = item.chatId;
        item.msgBody = StringPako.inflate(item.msgBody);
        this.messages.unshift(item);
      });
    }
  }
}

/**
 * 群会话
 */
class CohortChat extends BaseChat {
  constructor(id: string, name: string, m: model.ChatModel) {
    super(id, name, m);
  }
  override async moreMessage(filter: string): Promise<void> {
    let res;
    if (this.spaceId === Provider.userId) {
      res = await kernel.anystore?.aggregate(
        hisMsgCollName,
        {
          match: {
            sessionId: this.target.id,
          },
          sort: {
            createTime: -1,
          },
          skip: this.messages.length,
          limit: 30,
        },
        'user',
      );
    } else {
      res = await kernel.queryCohortImMsgs({
        id: this.target.id,
        page: {
          limit: 30,
          offset: this.messages.length,
          filter: filter,
        },
      });
    }
    if (res?.success && Array.isArray(res?.data)) {
      res.data.forEach((item: any) => {
        item.id = item.chatId;
        item.msgBody = StringPako.inflate(item.msgBody);
        this.messages.unshift(item);
      });
    }
  }
  override async morePerson(filter: string): Promise<void> {
    let res = await kernel.querySubTargetById({
      id: this.target.id,
      typeNames: [this.target.typeName],
      subTypeNames: [TargetType.Person],
      page: {
        offset: this.persons.length,
        limit: 13,
        filter: filter,
      },
    });
    if (res.success) {
      res.data?.result?.forEach((item) => {
        item.name = item.team?.name ?? item.name;
        this.persons.push(item);
      });
      this.personCount = res.data?.total ?? 0;
    }
  }
}

export const CreateChat = (id: string, name: string, m: model.ChatModel): IChat => {
  if (m.typeName === TargetType.Person) {
    return new PersonChat(id, name, m);
  } else {
    return new CohortChat(id, name, m);
  }
};
