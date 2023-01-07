import { kernel } from '@/ts/base';
import { XImMsg } from '@/ts/base/schema';
import { emitter, findTargetShare, IChat, IChatGroup, LoadChats } from '@/ts/core';
import userCtrl from '../setting';
import { DomainTypes, TargetType } from '@/ts/core/enum';
import { Emitter } from '@/ts/base/common';
import { TargetShare } from '@/ts/base/model';

// 会话缓存对象名称
const chatsObjectName = 'userchat';
/**
 * 会话控制器
 */
class ChatController extends Emitter {
  private _tabIndex: string = '1';
  private _userId: string = '';
  private _groups: IChatGroup[] = [];
  private _chats: IChat[] = [];
  private _curChat: IChat | undefined;
  constructor() {
    super();
    emitter.subscribePart(DomainTypes.User, () => {
      if (this._userId != userCtrl.user.target.id) {
        this._userId = userCtrl.user.target.id;
        setTimeout(async () => {
          await this._initialization();
        }, 500);
      }
    });
  }

  /** 当前会话、通讯录的搜索内容 */
  public currentKey: string = '';
  /** 通讯录 */
  public get groups() {
    return this._groups;
  }
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
  /** 页面Tab控制序列 */
  public get tabIndex() {
    return this._tabIndex;
  }
  /**
   * 获取会话ID对应名称
   * @param id 会话ID
   * @returns 名称
   */
  public getName(id: string): string {
    for (const item of this._groups) {
      for (const c of item.chats) {
        if (c.target.id === id) {
          return c.target.name;
        }
      }
    }
    return '未知';
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
    this._groups.forEach((g) => {
      g.chats.forEach((i) => {
        sum += i.noReadCount;
      });
    });
    return sum;
  }
  /**
   * 设置当前会话
   * @param chat 会话
   */
  public async setCurrent(chat: IChat | undefined): Promise<void> {
    this._tabIndex = '1';
    this._curChat = this.findChat(chat);
    if (this._curChat) {
      this._curChat.noReadCount = 0;
      await this._curChat.moreMessage('');
      if (this._curChat.persons.length === 0) {
        await this._curChat.morePerson('');
      }
      this._appendChats(this._curChat);
      this._cacheChats();
    }
    this.changCallback();
  }
  /**
   * 是否为当前会话
   * @param chat 会话
   */
  public isCurrent(chat: IChat): boolean {
    return (
      this._curChat?.chatId === chat.chatId && this._curChat?.spaceId === chat.spaceId
    );
  }
  /**
   * 激活通讯录
   * @param item 激活的通讯录
   */
  public setGroupActive(item: IChatGroup): void {
    this._tabIndex = '2';
    for (const group of this._groups) {
      if (group.spaceId === item.spaceId) {
        group.isOpened = !group.isOpened;
      }
    }
    this.changCallback();
  }
  public setTabIndex(index: string): void {
    this._tabIndex = index;
    this.changCallback();
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
    this._groups = await LoadChats(this._userId);
    kernel.anystore.subscribed(chatsObjectName, 'user', (data: any) => {
      this._chats = [];
      if ((data?.chats?.length ?? 0) > 0) {
        for (let item of data.chats) {
          let lchat = this.findChat(item);
          if (lchat) {
            lchat.loadCache(item);
            this._appendChats(lchat);
          }
        }
        this.changCallback();
      }
    });
    kernel.on('RecvMsg', (data) => {
      this._recvMessage(data);
    });
    kernel.on('ChatRefresh', async () => {
      this._groups = await LoadChats(this._userId);
      this.setCurrent(this._curChat);
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
    for (const item of this._groups) {
      for (const c of item.chats) {
        let isMatch = sessionId === c.target.id;
        if (c.target.typeName == TargetType.Person && isMatch) {
          isMatch = data.spaceId == c.spaceId;
        }
        if (isMatch) {
          c.receiveMessage(data, !this.isCurrent(c));
          this._appendChats(c);
          this._cacheChats();
          this.changCallback();
          return;
        }
      }
    }
  }
  /**
   * 获取引用会话
   * @param chat 拷贝会话
   * @returns 引用会话
   */
  public findChat(chat: IChat | undefined): IChat | undefined {
    if (chat) {
      for (const item of this._groups) {
        for (const c of item.chats) {
          if (c.chatId === chat.chatId && c.spaceId === chat.spaceId) {
            return c;
          }
        }
      }
    }
  }
  /**
   * 追加新会话
   * @param chat 新会话
   * @param cache 是否缓存
   */
  private _appendChats(chat: IChat): void {
    var index = this.chats.findIndex((item) => {
      return item.chatId === chat.chatId && item.spaceId === chat.spaceId;
    });
    if (index > -1) {
      this.chats[index] = chat;
    } else {
      this._chats.unshift(chat);
    }
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
          chats: this.chats
            .map((item) => {
              return item.getCache();
            })
            .reverse(),
        },
      },
      'user',
    );
  }
}

export default new ChatController();
