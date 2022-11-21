import AnyStore, { BadRequst } from '@/hubs/anystore';
import * as signalR from '@microsoft/signalr';
// import { Ref, ref } from 'vue';
import api from '@/services';
// import router from '@/router';
import notify from '@/utils/notify';
import { TargetType, Quatrains } from '../enums';
import { StringPako } from '@/utils/package';

/** 消息类型 */
// export enum MessageType {
//   Text = '文本',
//   Image = '图片',
//   Video = '视频',
//   Voice = '语音',
//   Recall = '撤回',
//   Readed = '已读',
// }
/** 存储消息数据集名称 */
const hisMsgCollName = 'chat-message';
/**
 * 即时消息模块
 */
export default class OrgChat extends Object {
  private lastMsg: any;
  private stoped: boolean;
  private closed: boolean;
  private anyStore: AnyStore;
  public curMsgs: any[]; // 双向绑定数据
  private accessToken: string | undefined;
  public userId: string; // 双向绑定数据
  public spaceId: string; // 双向绑定数据
  public authed: boolean; // 双向绑定数据
  private isconnecting: boolean;
  public qunPersons: any[]; // 双向绑定数据
  public chats: ImMsgType[]; // 双向绑定数据
  private openChats: ImMsgChildType[];
  public curChat: ImMsgChildType; // 双向绑定数据
  private messageCallback: (data: any) => void;
  private connection: signalR.HubConnection;
  private _nameMap: Record<string, string>; // 双向绑定数据
  private static orgChat: OrgChat = null;
  /**
   * 私有构造方法，禁止外部实例化
   */
  private constructor() {
    super();
    this.closed = false;
    this.stoped = false;
    this.lastMsg = {};
    this.openChats = [];
    this.chats = []; // 双向绑定数据
    this.userId = ''; // 双向绑定数据
    this.spaceId = ''; // 双向绑定数据
    this.curMsgs = []; // 双向绑定数据
    this._nameMap = {}; // 双向绑定数据
    this.curChat = null; // 双向绑定数据
    this.authed = false; // 双向绑定数据
    this.isconnecting = false;
    this.qunPersons = []; // 双向绑定数据
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('/orginone/orgchat/msghub')
      .build();
    this.connection.serverTimeoutInMilliseconds = 8000;
    this.connection.keepAliveIntervalInMilliseconds = 3000;
    this.connection.onclose(() => {
      this.authed = false;
      this.reconnect('disconnected from orgchat, await 5s reconnect.');
    });
    this.connection.on('RecvMsg', (data) => {
      this._recvMsg(data);
    });
    this.connection.on('ChatRefresh', async () => {
      await this.getChats();
    });
    this.anyStore = AnyStore.getInstance();
    this.anyStore.subscribed('orgChat', 'user', (data) => {
      this._loadChats(data);
    });
  }
  /** 获取单例 */
  public static getInstance() {
    if (this.orgChat == null) {
      this.orgChat = new OrgChat();
    }
    return this.orgChat;
  }
  /**
   * 启动连接
   * @param {string} accessToken 授权token
   */
  public async start(accessToken: string) {
    if (this.accessToken != accessToken) {
      await this.stop();
      let res = await api.person.tokenInfo({});
      if (res.success) {
        this.userId = res.data.userId;
        this.spaceId = res.data.spaceId;
      } else {
        // router.push('/login');
      }
    }
    this.stoped = false;
    this.accessToken = accessToken;
    await this.anyStore.start(accessToken);
    if (
      !this.isconnecting &&
      this.connection.state != signalR.HubConnectionState.Connected
    ) {
      this.isconnecting = true;
      this.connection
        .start()
        .then(() => {
          this.isconnecting = false;
          setTimeout(() => {
            if (!this.authed) {
              this.anyStore.get('orgChat', 'user').then((res) => {
                if (res.success) {
                  this._loadChats(res.data);
                }
              });
            }
          }, 500);
        })
        .catch(() => {
          this.authed = false;
          this.isconnecting = false;
          this.reconnect('connecting to orgchat failed, await 5s reconnect.');
        });
    }
  }
  /**
   * 停止连接
   */
  public async stop() {
    await this.setCurrent(null);
    this.stoped = true;
    this.accessToken = '';
    this.authed = false;
    await this.connection.stop();
    await this.anyStore.stop();
  }
  /** 短线重连 */
  private async reconnect(err: string) {
    if (!this.closed) {
      this.closed = true;
      if (!this.stoped) {
        console.error(err);
        setTimeout(() => {
          this.closed = false;
          this.start(this.accessToken);
        }, 5000);
      }
    }
  }
  /**
   * 新消息hook
   * @param callback 回调
   */
  public onMessage(callback: (data: any) => void) {
    this.messageCallback = callback;
  }
  /**
   * 查询名称代码字典
   * @param {string} id 任意ID
   * @returns {string} id对应的名称
   */
  public getName(id: string) {
    let name = this._nameMap.value[id] || '';
    if (name === '' && this.authed) {
      this.connection.invoke('GetName', id).then((res) => {
        if (res.success) {
          this._nameMap.value[id] = res.data;
          if (this.chats.length > 0) {
            this._cacheChats();
          }
        }
      });
    }
    return name;
  }
  /** 获取未读消息数量 */
  public getNoReadCount() {
    let sum: number = 0;
    this.chats.forEach((item: any) => {
      item.chats.forEach((chat: any) => {
        sum += chat.noRead || 0;
      });
    });
    return sum > 999 ? '999+' : sum > 0 ? sum.toString() : '';
  }
  /**
   * 发送消息
   * @param data 消息数据
   * @returns {model.ResultType} 发送结果
   */
  public async sendMsg(data: any) {
    if (this.authed && data) {
      data.msgBody = StringPako.deflate(data.msgBody);
      return await this.connection.invoke('SendMsg', data);
    }
    return BadRequst;
  }
  /**
   * 撤回消息
   * @param msg 要撤回的消息
   * @returns {model.ResultType} 撤回结果
   */
  public async recallMsg(msg: any) {
    if (this.authed && msg) {
      return await this.connection.invoke('RecallMsg', msg);
    }
    return BadRequst;
  }
  /**
   * 删除消息
   * @param msg 要删除的消息
   */
  public deleteMsg(msg: any) {
    if (!msg.chatId) {
      msg.chatId = msg.id;
    }
    this.anyStore
      .remove(
        hisMsgCollName,
        {
          chatId: msg.chatId,
        },
        'user',
      )
      .then((res: model.ResultType) => {
        if (res.data === 1 && this.curMsgs.length > 0) {
          this.curMsgs = this.curMsgs.filter((item: any) => {
            return item.chatId != msg.chatId;
          });
        }
      });
  }
  /**
   * 清空会话历史消息
   */
  public async clearMsg() {
    if (this.curChat) {
      this.anyStore
        .remove(
          hisMsgCollName,
          {
            sessionId: this.curChat.id,
          },
          'user',
        )
        .then((res: model.ResultType) => {
          if (res.data > 0 && this.curMsgs.length > 0) {
            this.curMsgs = [];
          }
        });
    }
  }
  /**
   * 设置当前会话
   * @param {ImMsgChildType} chat 当前会话
   */
  public async setCurrent(chat: ImMsgChildType, callback: Function) {
    if (this.authed) {
      if (this.curChat) {
        this.openChats = this.openChats.filter((item) => {
          return item.id !== this.curChat.id || item.spaceId !== this.curChat.spaceId;
        });
      }
      if (chat && chat.id.length > 0) {
        this.curMsgs = [];
        this.qunPersons = [];
        chat.noRead = 0;
        this.curChat = chat;
        await this.getHistoryMsg();
        if (chat.typeName !== TargetType.Person) {
          await this.getPersons(true);
        }
        this.openChats.push(this.curChat);
      }
      this._cacheChats();
      callback && callback(this.curMsgs);
    }
  }
  /**
   * 置顶会话
   * @param needTopSession 需要置顶的会话
   * @param {boolean} type 置顶会话{true},取消置顶{false}
   */
  public setToppingSession(needTopSession: any, type: boolean) {
    this._handlerMsg({
      msgType: 'toping',
      msgBody: type,
      fromId: this.userId,
      toId: needTopSession.id,
      spaceId: needTopSession.spaceId,
    });
  }
  /**
   * 获取群组人员
   * @param reset 是否重置
   * @returns {ResponseType} 查询到的人员结果
   */
  public async getPersons(reset: boolean, filter?: string) {
    if (this.authed && this.curChat) {
      if (reset) {
        this.qunPersons = [];
      }
      let res = await this.connection.invoke('GetPersons', {
        cohortId: this.curChat.id,
        limit: 20,
        filter: filter,
        offset: this.qunPersons.length,
      });
      if (res.success) {
        this.curChat.personNum = res.data.total;
        if (res.data.result) {
          res.data.result.forEach((item: any) => {
            if (item.team) {
              item.name = item.team.name;
              let typeName =
                item.typeName == TargetType.Person ? '' : `[${item.typeName}]`;
              this._nameMap[item.id] = `${item.name}${typeName}`;
            }
            this.qunPersons.push(item);
          });
        }
      }
      return res;
    }
    return BadRequst;
  }
  /**
   * 查询历史消息
   * @returns 查询到的历史消息
   */
  public async getHistoryMsg() {
    if (this.authed && this.curChat) {
      if (this.curChat.spaceId === this.userId) {
        let match: any = { sessionId: this.curChat.id };
        if (this.curChat.typeName === TargetType.Person) {
          match.spaceId = this.userId;
        }
        let res = await this.anyStore.aggregate(
          hisMsgCollName,
          {
            match: match,
            sort: {
              createTime: -1,
            },
            skip: this.curMsgs.length,
            limit: 30,
          },
          'user',
        );
        if (res.success && Array.isArray(res.data)) {
          res.data.forEach((item: any) => {
            item.id = item.chatId;
            item.msgBody = StringPako.inflate(item.msgBody);
            this.curMsgs.unshift(item);
          });
          return res.data.length;
        }
      } else {
        let funcName = 'QueryFriendMsg';
        let idName = 'friendId';
        if (this.curChat.typeName != TargetType.Person) {
          funcName = 'QueryCohortMsg';
          idName = 'cohortId';
        }
        let res = await this.connection.invoke(funcName, {
          limit: 30,
          [idName]: this.curChat.id,
          offset: this.curMsgs.length,
          spaceId: this.curChat.spaceId,
        });
        if (res.success) {
          if (res.data.result) {
            res.data.result.forEach((item: any) => {
              item.msgBody = StringPako.inflate(item.msgBody);
              this.curMsgs.unshift(item);
            });
            return res.data.result.length;
          }
        }
      }
    }
  }
  /**
   * 从关系中查询会话
   * @returns {model.ResultType} 会话结果
   */
  public async getChats() {
    if (this.authed) {
      let res = await this.connection.invoke('GetChats');
      if (res.success && res.data.groups && res.data.groups.length > 0) {
        const { groups = [] } = res.data;
        groups.forEach((group: ImMsgType) => {
          group.chats = group.chats.map((chat: ImMsgChildType) => {
            this.chats.forEach((g: any) => {
              g.chats.forEach((c: any) => {
                let isMatch = c.id == chat.id;
                if (chat.typeName == TargetType.Person && isMatch) {
                  isMatch = c.spaceId == group.id;
                }
                if (isMatch) {
                  c.name = chat.name;
                  chat = c;
                }
              });
            });
            let typeName = chat.typeName == TargetType.Person ? '' : `[${chat.typeName}]`;
            this._nameMap.value[chat.id] = `${chat.name}${typeName}`;
            chat.spaceId = group.id;
            return chat;
          });
          // 按照时间排序
          group.chats.sort((a: any, b: any) => {
            return new Date(b.msgTime).getTime() - new Date(a.msgTime).getTime();
          });
        });
        this.chats = [...groups];
        this._cacheChats();
      }
      return res;
    }
    return BadRequst;
  }
  /** 获取namemap键值对 */
  get nameMap() {
    return this._nameMap;
  }
  private _recvMsg(data: any) {
    data = this._handlerMsg(data);
    if (this.messageCallback) {
      this.messageCallback.call(this.messageCallback, data);
    } else {
      notify.showImMsg(this.getNoReadCount(), this.getName(data.toId), data.showTxt);
    }
  }
  private _handlerMsg(data: any) {
    if (this.chats.length < 1) {
      setTimeout(() => {
        this._handlerMsg(data);
      }, 1000);
    }
    if (data.msgType === 'recall') {
      data = this._recallMsg(data);
    }
    this.chats.forEach((item: ImMsgType) => {
      let newChats: ImMsgChildType[] = [];
      item.chats.forEach((chat: ImMsgChildType) => {
        let sessionId = data.toId;
        if (data.toId === this.userId) {
          sessionId = data.fromId;
        }
        let isMatch = sessionId == chat.id;
        if (chat.typeName == TargetType.Person && isMatch) {
          isMatch = data.spaceId == chat.spaceId;
        }
        if (isMatch) {
          if (data.msgType === 'toping') {
            chat.isTop = data.msgBody;
          } else {
            let msgBody = StringPako.inflate(data.msgBody);
            if (chat.spaceId === this.userId) {
              this._cacheMsg(sessionId, data);
            }
            chat.msgBody = data.msgBody;
            chat.msgType = data.msgType;
            chat.msgTime = data.createTime;
            if (chat.msgType != 'recall') {
              chat.showTxt = msgBody?.includes('img') ? '[图片]' : msgBody;
            } else {
              chat.showTxt = data.showTxt;
            }
            if (chat.typeName !== TargetType.Person) {
              chat.showTxt = this._nameMap.value[data.fromId] + ': ' + chat.showTxt;
            }
            data.showTxt = chat.showTxt;
            if (
              this.curChat &&
              this.curChat.id === chat.id &&
              this.curChat.spaceId === chat.spaceId
            ) {
              if (data.msgType !== 'recall') {
                this.curMsgs.push({
                  ...data,
                  msgBody: msgBody,
                });
              }
            } else {
              if (
                this.openChats.findIndex(
                  (i) => i.id === chat.id && i.spaceId === chat.spaceId,
                ) < 0
              ) {
                notify.player();
                chat.noRead = (chat.noRead || 0) + 1;
              }
            }
            this.lastMsg = { data: data, chat: chat };
          }
          newChats.unshift(chat);
        } else {
          newChats.push(chat);
        }
      });
      item.chats = newChats;
    });
    this._cacheChats();
    return data;
  }
  private async _recallMsg(data: any) {
    data.showTxt = '撤回了一条消息';
    this.curMsgs.forEach((item: any) => {
      if (item.id === data.id) {
        item.showTxt = data.showTxt;
        item.msgBody = data.msgBody;
        item.msgType = 'recall';
        item.createTime = data.createTime;
        if (data.fromId === this.userId) {
          item.allowEdit = true;
        } else {
          delete item.allowEdit;
        }
      }
    });
    return data;
  }
  private async _loadChats(data: any) {
    if (!data) return;
    if (data.chats) {
      this.chats = [];
      data.chats.forEach((item: ImMsgType) => {
        if (item.id === this.spaceId) {
          this.chats.unshift(item);
        } else {
          this.chats.push(item);
        }
      });
    }
    this._nameMap.value = data.nameMap || this._nameMap.value;
    this.openChats = data.openChats || data.openChats;
    let lastMsg = data.lastMsg;
    if (
      lastMsg &&
      lastMsg.chat &&
      lastMsg.data &&
      this.curChat &&
      this.curChat.id === lastMsg.chat.id &&
      this.curChat.spaceId === lastMsg.chat.spaceId
    ) {
      let exists =
        this.curMsgs.filter((item: any) => {
          return item.id === lastMsg.data.id;
        }).length > 0;
      if (!exists) {
        lastMsg.data.msgBody = StringPako.inflate(lastMsg.data.msgBody);
        this.curMsgs.push(lastMsg.data);
      }
    }
    if (!this.authed && this.connection.state == signalR.HubConnectionState.Connected) {
      this.connection.invoke('TokenAuth', this.accessToken).then(() => {
        this.authed = true;
      });
    }
  }
  private _cacheChats() {
    this.anyStore.set(
      'orgChat',
      {
        operation: 'replaceAll',
        data: {
          name: '我的消息',
          chats: this.chats,
          nameMap: this._nameMap.value,
          openChats: this.openChats,
          lastMsg: this.lastMsg,
        },
      },
      'user',
    );
  }
  private _cacheMsg(sessionId: string, data: any) {
    if (data.msgType === 'recall') {
      this.anyStore.update(
        hisMsgCollName,
        {
          match: {
            chatId: data.id,
          },
          update: {
            _set_: {
              msgBody: data.msgBody,
              msgType: data.msgType,
            },
          },
          options: {},
        },
        'user',
      );
    } else {
      this.anyStore.insert(
        hisMsgCollName,
        {
          chatId: data.id,
          toId: data.toId,
          spaceId: data.spaceId,
          fromId: data.fromId,
          msgType: data.msgType,
          msgBody: data.msgBody,
          sessionId: sessionId,
          createTime: data.createTime,
        },
        'user',
      );
    }
  }
}

export const chat = OrgChat.getInstance();
