import { TargetType } from '@/module/enums';
import { kernel } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { XImMsg } from '@/ts/base/schema';
import { IChat, IChatGroup } from '@/ts/core/chat/ichat';
import Provider from '@/ts/core/provider';
import { LoadChats } from '@/ts/core/chat';

// 会话缓存对象名称
const chatsObjectName = 'userchat';
/**
 * 会话控制器
 */
class ChatController {
  private _tabIndex: string;
  private _refreshCallback: { [name: string]: () => void };
  private _groups: IChatGroup[];
  private _chats: IChat[];
  private _curChat: IChat | undefined;
  constructor(groups: IChatGroup[]) {
    this._groups = groups;
    this._chats = [];
    this._tabIndex = '1';
    this._refreshCallback = {};
    this._initialization();
  }
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
    return Provider.userId;
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
   * 设置当前会话
   * @param chat 会话
   */
  public async setCurrent(chat: IChat | undefined): Promise<void> {
    this._tabIndex = '1';
    this._curChat = this.refChat(chat);
    if (this._curChat) {
      this._curChat.noReadCount = 0;
      await this._curChat.moreMessage('');
      await this._curChat.morePerson('');
      this._appendChats(this._curChat);
      this._cacheChats();
    }
    this._callback();
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
    this._callback();
  }
  /**
   * 订阅变更
   * @param callback 变更回调
   * @returns 订阅ID
   */
  public subscribe(callback: () => void): string {
    const id = generateUuid();
    if (callback) {
      callback();
      this._refreshCallback[id] = callback;
    }
    return id;
  }
  /**
   * 取消订阅
   * @param id 订阅ID
   */
  public unsubscribe(id: string): void {
    delete this._refreshCallback[id];
  }
  /**
   * 获取引用会话
   * @param chat 拷贝会话
   * @returns 引用会话
   */
  public refChat(chat: IChat | undefined): IChat | undefined {
    if (chat) {
      for (const item of this._groups) {
        for (const c of item.chats) {
          if (c.chatId === chat.chatId && c.spaceId === chat.spaceId) {
            return c;
          }
        }
      }
    }
    return chat;
  }
  /** 初始化 */
  private _initialization(): void {
    kernel.on('RecvMsg', (data) => {
      this._recvMessage(data);
    });
    kernel.anystore.subscribed(chatsObjectName, 'user', (data: any) => {
      if (data && data.chats && data.chats.length > 0) {
        for (let item of data.chats) {
          let lchat = this.refChat(item);
          if (lchat) {
            lchat.loadCache(item);
            this._appendChats(lchat);
          }
        }
        this._callback();
      }
    });
  }
  /** 变更回调 */
  private _callback() {
    Object.keys(this._refreshCallback).forEach((id) => {
      this._refreshCallback[id].apply(this, []);
    });
  }
  /**
   * 接收到新信息
   * @param data 新消息
   * @param cache 是否缓存
   */
  private _recvMessage(data: XImMsg): void {
    let sessionId = data.toId;
    if (data.toId === this.userId) {
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
          this._callback();
          return;
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

export const chatCtrl = new ChatController(await LoadChats());
