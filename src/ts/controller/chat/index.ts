import { kernel } from '@/ts/base';
import { XImMsg, XTarget } from '@/ts/base/schema';
import { emitter, findTargetShare, IChat } from '@/ts/core';
import userCtrl from '../setting';
import { DomainTypes, TargetType } from '@/ts/core/enum';
import { Emitter } from '@/ts/base/common';
import { TargetShare } from '@/ts/base/model';
import { TargetChat } from '@/ts/core/chat';
import { ChatCache } from '@/ts/core/chat/ichat';

// 会话缓存对象名称
const chatsObjectName = 'chatscache';
/**
 * 会话控制器
 */
class ChatController extends Emitter {
  private _userId: string = '';
  private _chats: IChat[] = [];
  private _curChat: IChat | undefined;
  private _preMessages: XImMsg[] = [];
  private _inited: boolean = false;
  constructor() {
    super();
    kernel.on('RecvMsg', (data) => {
      if (this._inited) {
        this._recvMessage(data);
      } else {
        this._preMessages.push(data);
      }
    });
    emitter.subscribePart(DomainTypes.User, () => {
      if (this._userId != userCtrl.user.target.id) {
        this._inited = false;
        this._userId = userCtrl.user.target.id;
        this._initialization();
      }
    });
  }
  /** 当前会话、通讯录的搜索内容 */
  public currentKey: string = '';
  /** 会话 */
  public get chats() {
    return this._chats;
  }
  /** 当前会话 */
  public get chat() {
    return this._curChat;
  }
  /** 当前用户 */
  public get userId() {
    return this._userId;
  }
  /** 初始化状态 */
  public get inited() {
    return this._inited;
  }

  /**
   * 查询组织信息
   * @param id 组织id
   */
  public findTeamInfoById(id: string): TargetShare {
    return findTargetShare(id);
  }
  /**
   * 获取未读数量
   * @returns 未读数量
   */
  public getNoReadCount(): number {
    let sum = 0;
    this._chats.forEach((i) => {
      sum += i.noReadCount;
    });
    return sum;
  }
  /**
   * 设置当前会话
   * @param chat 会话
   */
  public async setCurrent(chat: IChat | undefined): Promise<void> {
    if (chat && this.isCurrent(chat)) return;
    if (chat) {
      this.currentKey = chat.fullId;
      chat.noReadCount = 0;
      if (chat.persons.length === 0) {
        await chat.morePerson('');
      }
      await chat.moreMessage('');
      this._appendChats(chat);
      this._cacheChats();
    }
    this._curChat = chat;
    this.changCallback();
  }
  /**
   * 是否为当前会话
   * @param chat 会话
   */
  public isCurrent(chat: IChat): boolean {
    return this._curChat?.fullId === chat.fullId;
  }
  /**
   * 删除会话
   * @param chat 会话
   */
  public deleteChat(chat: IChat): void {
    const index = this._chats.findIndex((i) => {
      return i.fullId === chat.fullId;
    });
    if (index > -1) {
      this._chats.splice(index, 1);
      if (chat.fullId === this._curChat?.fullId) {
        this._curChat = undefined;
        this.currentKey = chat.spaceId + '-' + chat.spaceName;
      }
      this._cacheChats();
      this.changCallback();
    }
  }
  /** 置顶功能 */
  public setToping(chat: IChat): void {
    const index = this._chats.findIndex((i) => {
      return i.fullId === chat.fullId;
    });
    if (index > -1) {
      this._chats[index].isToping = !this._chats[index].isToping;
      this._cacheChats();
      this.changCallback();
    }
  }
  /** 初始化 */
  private async _initialization(): Promise<void> {
    kernel.anystore.subscribed(chatsObjectName, 'user', (data: any) => {
      if ((data?.chats?.length ?? 0) > 0) {
        this._chats = data.chats.map((item: ChatCache) => {
          let lchat = TargetChat(
            item.target,
            this._userId,
            item.spaceId,
            item.spaceName,
            item.target.label,
          );
          const index = this._findChat(lchat.fullId);
          if (index > -1) {
            lchat = this._chats[index];
          }
          lchat.loadCache(item);
          return lchat;
        });
      }
      this._preMessages = this._preMessages.sort((a: XImMsg, b: XImMsg) => {
        return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
      });
      for (const data of this._preMessages) {
        this._recvMessage(data);
      }
      this._preMessages = [];
      this._inited = true;
      this.changCallback();
    });
  }
  /**
   * 接收到新信息
   * @param data 新消息
   * @param cache 是否缓存
   */
  private _recvMessage(data: XImMsg): void {
    let sessionId = data.toId;
    if (data.toId === this._userId) {
      sessionId = data.fromId;
    }
    for (const c of this._chats) {
      let isMatch = sessionId === c.target.id;
      if (c.target.typeName == TargetType.Person && isMatch) {
        isMatch = data.spaceId == c.spaceId;
      }
      if (isMatch) {
        c.receiveMessage(data, !this.isCurrent(c));
        this._appendChats(c);
        this._cacheChats();
        if (!this.isCurrent(c)) {
          this.changCallback();
        }
        return;
      }
    }
    this._createRevMsgChat(data, sessionId);
  }
  /**
   * 根据用户生成会话
   * @param target 用户
   * @param spaceId 空间
   * @param label 标签
   */
  public findTargetChat(
    target: XTarget,
    spaceId: string,
    spaceName: string,
    label: string,
  ): IChat {
    const index = this._findChat(spaceId + '-' + target.id);
    if (index > -1) return this._chats[index];
    return TargetChat(target, this._userId, spaceId, spaceName, label);
  }

  private async _createRevMsgChat(data: XImMsg, sessionId: string): Promise<void> {
    const res = await kernel.queryTargetById({
      ids: [data.spaceId, sessionId],
    });
    if ((res?.data?.result?.length ?? 0) > 1) {
      const target = res!.data!.result!.filter((item) => item.id === sessionId)[0];
      const spaceTarget = res!.data!.result!.filter(
        (item) => item.id === data.spaceId,
      )[0];
      let label = '好友';
      switch (target.typeName) {
        case TargetType.Cohort:
          label = '群组';
          break;
        case TargetType.Person:
          if (spaceTarget.typeName != TargetType.Person) {
            label = '同事';
          }
          break;
        default:
          label = target.typeName + '群';
      }
      const chat = this.findTargetChat(
        target,
        spaceTarget.typeName === TargetType.Person ? this._userId : data.spaceId,
        spaceTarget.typeName === TargetType.Person
          ? '我的'
          : spaceTarget.team?.name || spaceTarget.name,
        label,
      );
      chat.receiveMessage(data, true);
      this._appendChats(chat);
      this._cacheChats();
      this.changCallback();
      return;
    }
  }
  /**
   * 追加新会话
   * @param chat 新会话
   * @param cache 是否缓存
   */
  private _appendChats(chat: IChat): void {
    if (chat) {
      var index = this._findChat(chat.fullId);
      if (index > -1) {
        this._chats[index] = chat;
      } else {
        this._chats.unshift(chat);
      }
    }
  }
  /**
   * 本地查找回话
   * @param fullId 回话唯一Id
   * @returns 回话索引
   */
  private _findChat(fullId: string): number {
    return this._chats.findIndex((item) => {
      return item.fullId === fullId;
    });
  }
  /**
   * 缓存会话
   * @param message 新消息，无则为空
   */
  private _cacheChats(): void {
    kernel.anystore.set(
      chatsObjectName,
      {
        operation: 'replaceAll',
        data: {
          chats: this._chats.map((item) => {
            return item.getCache();
          }),
        },
      },
      'user',
    );
  }
}

export default new ChatController();
