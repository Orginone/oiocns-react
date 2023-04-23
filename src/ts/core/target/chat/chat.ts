import { TargetShare } from '@/ts/base/model';
import { schema, kernel, common, parseAvatar, model } from '@/ts/base';
import { TargetType, MessageType } from '../../enum';
import { appendShare, appendTarget } from '../targetMap';
import { ChatCache, IChat } from './ichat';
import { Emitter } from '@/ts/base/common';

// 历史会话存储集合名称
const hisMsgCollName = 'chat-message';
// 机器人会话ID
const gptId = '889856358221262448';
// 空时间
const nullTime = new Date('2022-07-01').getTime();
/**
 * 会话基类
 * @abstract
 */
class BaseChat implements IChat {
  fullId: string;
  chatId: string;
  spaceId: string;
  isToping: boolean;
  target: model.ChatModel;
  messages: schema.XImMsg[];
  persons: schema.XTarget[];
  personCount: number;
  noReadCount: number;
  userId: string;
  lastMsgTime: number = nullTime;
  lastMessage: schema.XImMsg | undefined;
  messageNotify?: (messages: schema.XImMsg[]) => void;
  constructor(spaceId: string, target: model.ChatModel, userId: string) {
    this.spaceId = spaceId;
    this.target = target;
    this.messages = [];
    this.persons = [];
    this.personCount = 0;
    this.chatId = target.id;
    this.noReadCount = 0;
    this.isToping = false;
    this.userId = userId;
    this.fullId = this.spaceId + '-' + this.chatId;
    appendShare(target.id, this.shareInfo);
    kernel.anystore.subscribed(
      userId,
      hisMsgCollName + '.T' + this.fullId,
      (data: ChatCache) => {
        this.loadCache(data);
      },
    );
  }
  destroy(): void {
    kernel.anystore.unSubscribed(this.userId, hisMsgCollName + '.T' + this.fullId);
  }

  public get shareInfo(): TargetShare {
    const result: TargetShare = {
      name: this.target.name,
      typeName: this.target.typeName,
    };
    result.avatar = parseAvatar(this.target.photo);
    return result;
  }

  cache(): void {
    kernel.anystore.set(this.userId, hisMsgCollName + '.T' + this.fullId, {
      operation: 'replaceAll',
      data: {
        fullId: this.fullId,
        isToping: this.isToping,
        noReadCount: this.noReadCount,
        lastMsgTime: this.lastMsgTime,
        lastMessage: this.lastMessage,
      },
    });
  }

  loadCache(cache: ChatCache): void {
    this.isToping = cache.isToping;
    if (cache.noReadCount && this.noReadCount != cache.noReadCount) {
      this.noReadCount = cache.noReadCount;
      msgNotify.changCallback();
    }
    // debugger;
    this.lastMsgTime = Number.isInteger(cache.lastMsgTime) ? cache.lastMsgTime : nullTime;
    if (cache.lastMessage && cache.lastMessage.id != this.lastMessage?.id) {
      this.lastMessage = cache.lastMessage;
      const index = this.messages.findIndex((i) => i.id === cache.lastMessage?.id);
      if (index > -1) {
        this.messages[index] = cache.lastMessage;
      } else {
        this.messages.push(cache.lastMessage);
        this.messageNotify?.apply(this, [this.messages]);
      }
    }
  }
  onMessage(callback: (messages: schema.XImMsg[]) => void): void {
    this.messageNotify = callback;
    if (this.noReadCount > 0) {
      this.noReadCount = 0;
      msgNotify.changCallback();
    }
    this.cache();
    if (this.messages.length < 10) {
      this.moreMessage('');
    }
    this.morePerson('');
  }
  unMessage(): void {
    this.messageNotify = undefined;
  }
  async clearMessage(): Promise<boolean> {
    const res = await kernel.anystore.remove(this.userId, hisMsgCollName, {
      sessionId: this.target.id,
      belongId: this.spaceId,
    });
    if (res.success) {
      this.messages = [];
      this.messageNotify?.apply(this, [this.messages]);
      return true;
    }
    this.lastMsgTime = new Date().getTime();
    return false;
  }
  async deleteMessage(id: string): Promise<boolean> {
    if (this.spaceId === this.userId) {
      const res = await kernel.anystore.remove(this.userId, hisMsgCollName, {
        chatId: id,
      });
      if (res.success && res.data > 0) {
        const index = this.messages.findIndex((i) => {
          return i.id === id;
        });
        if (index > -1) {
          this.messages.splice(index, 1);
        }
        this.messageNotify?.apply(this, [this.messages]);
        return true;
      }
      this.lastMsgTime = new Date().getTime();
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
    const res = await kernel.anystore.aggregate(this.userId, hisMsgCollName, {
      match: {
        sessionId: this.target.id,
        belongId: this.spaceId,
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
  async sendMessage(type: MessageType, text: string): Promise<boolean> {
    let res = await kernel.createImMsg({
      msgType: type,
      toId: this.target.id,
      spaceId: this.spaceId,
      fromId: this.userId,
      msgBody: common.StringPako.deflate(text),
    });
    if (this.target.id === this.userId && res.data && res.data.id) {
      await this.aiReqest(res.data, text);
    }
    return res.success;
  }
  async aiReqest(data: schema.XImMsg, text: string): Promise<void> {
    data.id = 'A' + data.id.substring(1);
    let res = await kernel.forward<string>({
      uri: 'http://chatbot.vesoft-inc.com:5100/api/chat-stream',
      method: 'POST',
      header: {
        Accept: '*/*',
        path: 'v1/chat/completions',
        'Content-Type': 'application/json',
      },
      content: {
        messages: [{ role: 'system', content: text }],
        stream: true,
        model: 'gpt-4',
        temperature: 1,
        presence_penalty: 0,
      },
    });
    data.msgType = MessageType.Text;
    data.msgBody = common.StringPako.deflate(res.data);
    data.fromId = gptId;
    await kernel.anystore.insert(this.userId, hisMsgCollName, {
      fromId: gptId,
      chatId: data.id,
      toId: this.userId,
      belongId: this.userId,
      sessionId: this.userId,
      createTime: 'sysdate()',
      msgType: MessageType.Text,
      msgBody: common.StringPako.deflate(res.data),
    });
    this.receiveMessage(data);
  }
  receiveMessage(msg: schema.XImMsg) {
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
      if (!this.messageNotify) {
        this.noReadCount += 1;
        msgNotify.changCallback();
      }
      this.lastMsgTime = new Date().getTime();
      this.lastMessage = msg;
      this.cache();
    }
    this.messageNotify?.apply(this, [this.messages]);
  }
  protected loadMessages(msgs: schema.XImMsg[]): void {
    msgs.forEach((item: any) => {
      if (item.chatId) {
        item.id = item.chatId;
      }
      item.showTxt = common.StringPako.inflate(item.msgBody);
      this.messages.unshift(item);
    });
    if (this.lastMsgTime === nullTime && msgs.length > 0) {
      this.lastMsgTime = new Date(msgs[0].createTime).getTime();
    }
    this.messageNotify?.apply(this, [this.messages]);
  }
}

/**
 * 人员会话
 */
class PersonChat extends BaseChat {
  constructor(spaceId: string, target: model.ChatModel, userId: string) {
    super(spaceId, target, userId);
  }
}

/**
 * 群会话
 */
class CohortChat extends BaseChat {
  constructor(spaceId: string, target: model.ChatModel, userId: string) {
    super(spaceId, target, userId);
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
      res.data.result.forEach((item: schema.XTarget) => {
        item.name = item.team?.name ?? item.name;
        let idArray = this.persons.map((r: schema.XTarget) => r.id);
        if (!idArray.includes(item.id)) {
          this.persons.push(item);
        }
      });
      this.personCount = res.data?.total ?? 0;
    }
    msgNotify.changCallback();
  }
}
// 消息变更推送
export const msgNotify = new Emitter();
/** 创建用户会话 */
export const CreateChat = (
  userId: string,
  spaceId: string,
  target: schema.XTarget,
  labels: string[],
): IChat => {
  if (userId === target.id) {
    labels = ['本人'];
  }
  const data: model.ChatModel = {
    id: target.id,
    labels: labels,
    typeName: target.typeName,
    photo: target.avatar ?? '{}',
    remark: target.team?.remark ?? '',
    name: target.team?.name ?? target.name,
  };
  if (target.typeName === TargetType.Person) {
    return new PersonChat(spaceId, data, userId);
  } else {
    return new CohortChat(spaceId, data, userId);
  }
};
/** 创建权限会话 */
export const CreateAuthChat = (
  userId: string,
  spaceId: string,
  spaceName: string,
  target: schema.XAuthority,
): IChat => {
  const data: model.ChatModel = {
    id: target.id,
    labels: [spaceName, '权限群'],
    typeName: '权限',
    photo: '{}',
    remark: target.remark,
    name: target.name,
  };
  return new CohortChat(spaceId, data, userId);
};
