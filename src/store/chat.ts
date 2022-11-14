/* eslint-disable no-unused-vars */
import * as signalR from '@microsoft/signalr';
import create from 'zustand';

import AnyStore, { BadRequst } from '@/hubs/anystore';
import { chat } from '@/module/chat/orgchat';
import { TargetType } from '@/module/enums';
import notify from '@/utils/notify';
import { StringPako } from '@/utils/package';

const useChatStore = create((set, get: any) => ({
  hisMsgCollName: 'chat-message',
  closed: false,
  stoped: false,
  lastMsg: {},
  openChats: [],
  chats: chat.chats,
  spaceId: '',
  curMsgs: [], //当前会话 历史消息
  nameMap: {},
  curChat: null,
  authed: true,
  isconnecting: false,
  qunPersons: [],
  connection: chat.connection,
  anyStore: chat.anyStore,
  sessionChats: [], // 会话列表
  currentPeople: {}, // 当前对话框对象
  sendPeople: {}, // 当前发送消息的对象
  // 初始化获取通讯录
  getAddressBook: () => {
    setTimeout(() => {
      set({ chats: chat.chats });
    }, 1200);
  },
  // 添加进会话列表
  addSessionList: () => {
    let arr: any = get().sessionChats || [];
    if (get().sendPeople && get().sendPeople.spaceId === get().currentPeople.spaceId) {
      arr.push(get().currentPeople);
    }
    let newArr = [...new Set(arr)];
    set({ sessionChats: newArr });
  },
  // 新消息hook
  onMessage: (callback: (data: any) => void) => {
    get().messageCallback = callback;
  },
  // 接收消息
  RecvMsg: () => {
    chat.connection.on('RecvMsg', (data: any) => {
      get()._recvMsg(data);
    });
  },
  // 查询名称代码字典
  getName: (id: string) => {
    let name = get().nameMap[id] || '';
    if (name === '' && get().authed) {
      get()
        .connection.invoke('GetName', id)
        .then((res: any) => {
          if (res.success) {
            get().nameMap[id] = res.data;
            if (get().chats.length > 0) {
              get()._cacheChats();
            }
          }
        });
    }
    return name;
  },
  // 获取未读消息数量
  getNoReadCount: () => {
    let sum: number = 0;
    get().chats.forEach((item: any) => {
      item.chats.forEach((chat: any) => {
        sum += chat.noRead || 0;
      });
    });
    return sum > 999 ? '999+' : sum > 0 ? sum.toString() : '';
  },
  // 发送消息
  sendMsg: async (data: any) => {
    set({ sendPeople: data });
    if (get().authed && data) {
      // data.msgBody = StringPako.deflate(data.msgBody);
      // TODO: 临时去除加密,用于开发测试数据接受情况
      return await get().connection.invoke('SendMsg', data);
    }
    return BadRequst;
  },
  // 撤回消息
  recallMsgs: async (msg: any) => {
    if (get().authed && msg) {
      return await get().connection.invoke('RecallMsg', msg);
    }
    return BadRequst;
  },
  //删除消息
  deleteMsg: (msg: any) => {
    if (!msg.chatId) {
      msg.chatId = msg.id;
    }
    get()
      .anyStore.remove(
        get().hisMsgCollName,
        {
          chatId: msg.chatId,
        },
        'user',
      )
      .then((res: ResultType) => {
        if (res.data === 1 && get().curMsgs.length > 0) {
          let arr: any = [];
          arr = get().curMsgs.filter((item: any) => {
            return item.chatId != msg.chatId;
          });
          set({ curMsgs: arr });
        }
      });
  },
  //清空会话历史消息
  clearMsg: async () => {
    if (get().curChat) {
      get()
        .anyStore.remove(
          get().hisMsgCollName,
          {
            sessionId: get().curChat.id,
          },
          'user',
        )
        .then((res: ResultType) => {
          if (res.data > 0 && get().curMsgs.length > 0) {
            set({ curMsgs: [] });
          }
        });
    }
  },
  // 设置当前会话
  setCurrent: async (chat: any) => {
    set({ currentPeople: chat });
    if (get().authed) {
      if (get().curChat) {
        get().openChats = get().openChats.filter((item: any) => {
          return item.id !== get().curChat?.id || item.spaceId !== get().curChat?.spaceId;
        });
      }
      if (chat && chat?.id.length > 0) {
        set({ curMsgs: [] });
        get().qunPersons = [];
        chat.noRead = 0;
        set({ curChat: chat });
        await get().getHistoryMsg();
        if (chat.typeName !== TargetType.Person) {
          await get().getPersons(true);
        }
        get().openChats.push(get().curChat);
      }
      // get()._cacheChats();
    }
  },
  // 置顶会话
  setToppingSession: (needTopSession: any, type: boolean) => {
    get()._handlerMsg({
      msgType: 'toping',
      msgBody: type,
      fromId: chat.userId,
      toId: needTopSession.id,
      spaceId: needTopSession.spaceId,
    });
  },
  // 获取群组人员
  getPersons: async (reset: boolean, filter?: string) => {
    if (get().authed && get().curChat) {
      if (reset) {
        get().qunPersons = [];
      }
      let res = await get().connection.invoke('GetPersons', {
        cohortId: get().curChat.id,
        limit: 20,
        filter: filter,
        offset: get().qunPersons.length,
      });
      if (res.success) {
        get().curChat.personNum = res.data.total;
        if (res.data.result) {
          res.data.result.forEach((item: any) => {
            if (item.team) {
              item.name = item.team.name;
              let typeName =
                item.typeName == TargetType.Person ? '' : `[${item.typeName}]`;
              get().nameMap[item.id] = `${item.name}${typeName}`;
            }
            get().qunPersons.push(item);
          });
        }
      }
      return res;
    }
    return BadRequst;
  },
  // 查询历史消息
  getHistoryMsg: async () => {
    if (get().authed && get().curChat) {
      if (get().curChat.spaceId === chat.userId) {
        let match: any = { sessionId: get().curChat.id };
        if (get().curChat.typeName === TargetType.Person) {
          match.spaceId = chat.userId;
          let res = await get().anyStore.aggregate(
            get().hisMsgCollName,
            {
              match: match,
              sort: {
                createTime: -1,
              },
              skip: get().curMsgs.length,
              limit: 30,
            },
            'user',
          );
          if (res.success && Array.isArray(res.data)) {
            let arr: any[] = [];
            res.data.forEach((item: any) => {
              item.id = item.chatId;
              item.msgBody = StringPako.inflate(item.msgBody);
              arr.unshift(item);
              set({ curMsgs: arr });
            });
            return res.data.length;
          }
        }
      } else {
        let funcName = 'QueryFriendMsg';
        let idName = 'friendId';
        if (get().curChat.typeName != TargetType.Person) {
          funcName = 'QueryCohortMsg';
          idName = 'cohortId';
        }
        let res = await get().connection.invoke(funcName, {
          limit: 30,
          [idName]: get().curChat.id,
          offset: 0,
          spaceId: get().curChat.spaceId,
        });
        let arr = get().curMsgs;
        if (res.success) {
          if (res.data.result) {
            res.data.result.forEach((item: any) => {
              item.msgBody = StringPako.inflate(item.msgBody);
              arr.unshift(item);
            });
            set({ curMsgs: arr });
            return res.data.result.length;
          }
        }
      }
    }
  },
  // 从关系中查询会话
  getChats: async () => {
    if (get().authed) {
      let res = await get().connection.invoke('GetChats');
      if (res.success && res.data.groups && res.data.groups.length > 0) {
        const { groups = [] } = res.data;
        groups.forEach((group: ImMsgType) => {
          group.chats = group.chats.map((chat: ImMsgChildType) => {
            get().chats.forEach((g: any) => {
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
            get().nameMap[chat.id] = `${chat.name}${typeName}`;
            chat.spaceId = group.id;
            return chat;
          });
          // 按照时间排序
          group.chats.sort((a: any, b: any) => {
            return new Date(b.msgTime).getTime() - new Date(a.msgTime).getTime();
          });
        });
        set({ chats: [...groups] });
        get()._cacheChats();
      }
      return res;
    }
    return BadRequst;
  },
  // 接收消息
  _recvMsg: (data: any) => {
    data = get()._handlerMsg(data);
    if (get().messageCallback) {
      get().messageCallback.call(get().messageCallback, data);
    } else {
      notify.showImMsg(get().getNoReadCount(), get().getName(data.toId), data.showTxt);
    }
  },
  _handlerMsg(data: any) {
    if (get().chats.length < 1) {
      setTimeout(() => {
        set({ chats: chat.chats });
        get()._handlerMsg(data);
      }, 1000);
      return;
    }

    if (data.msgType === 'recall') {
      data = get()._recallMsg(data);
      set({ curMsgs: [...data] });
    }
    //  else {
    //   set({ curMsgs: [...get().curMsgs, data] });
    // }
    let oldchatsArr = get().chats;
    oldchatsArr.forEach((item: ImMsgType) => {
      let newChats: ImMsgChildType[] = [];
      item.chats.forEach((chatItem: ImMsgChildType) => {
        let sessionId = data.toId;
        if (data.toId === chat?.userId) {
          sessionId = data.fromId;
        }
        let isMatch = sessionId == chatItem.id;
        if (chatItem.typeName == TargetType.Person && isMatch) {
          isMatch = data.spaceId == chatItem.spaceId;
        }
        if (isMatch) {
          if (data.msgType === 'toping') {
            chatItem.isTop = data.msgBody;
          } else {
            let msgBody = StringPako.inflate(data.msgBody);
            if (chatItem.spaceId === chat?.userId) {
              get()._cacheMsg(sessionId, data);
            }
            chatItem.msgBody = data.msgBody;
            chatItem.msgType = data.msgType;
            chatItem.msgTime = data.createTime;
            if (chatItem.msgType != 'recall') {
              chatItem.showTxt = msgBody?.includes('img') ? '[图片]' : msgBody;
            } else {
              chatItem.showTxt = data.showTxt;
            }
            if (chatItem.typeName !== TargetType.Person) {
              chatItem.showTxt = get().nameMap[data.fromId] + ': ' + chatItem.showTxt;
            }
            data.showTxt = chatItem.showTxt;
            if (
              get().curChat &&
              get().curChat.id === chatItem.id &&
              get().curChat.spaceId === chatItem.spaceId
            ) {
              let arr: any = [];
              if (data.msgType !== 'recall') {
                arr.push({
                  ...data,
                  msgBody: msgBody,
                });
                // set({ curMsgs: arr });
                set({
                  curMsgs: [
                    ...get().curMsgs,
                    {
                      ...data,
                      msgBody: msgBody,
                    },
                  ],
                });
              }
            } else {
              if (
                get().openChats.findIndex(
                  (i: any) => i.id === chatItem.id && i.spaceId === chatItem.spaceId,
                ) < 0
              ) {
                notify.player();
                chatItem.noRead = (chatItem.noRead || 0) + 1;
              }
            }
            get().lastMsg = { data: data, chat: chatItem };
          }
          newChats.unshift(chatItem);
        } else {
          newChats.push(chatItem);
        }
      });
      item.chats = newChats;
    });

    get()._cacheChats();
    return data;
  },
  _recallMsg: async (data: any) => {
    data.showTxt = '撤回了一条消息';
    return get().curMsgs.map((item: any) => {
      if (item.id === data.id) {
        item.showTxt = data.showTxt;
        item.msgBody = data.msgBody;
        item.msgType = 'recall';
        item.createTime = data.createTime;
        if (data.fromId === chat.userId) {
          item.allowEdit = true;
        } else {
          delete item.allowEdit;
        }
        return item;
      }
    });
  },
  _loadChats: async (data: any) => {
    if (!data) return;
    if (data.chats) {
      get().chats = [];
      data.chats.forEach((item: ImMsgType) => {
        if (item.id === get().spaceId) {
          get().chats.unshift(item);
        } else {
          get().chats.push(item);
        }
      });
    }
    get().nameMap = data.nameMap || get().nameMap;
    get().openChats = data.openChats || get().openChats;
    let lastMsg = data.lastMsg;
    if (
      lastMsg &&
      lastMsg.chat &&
      lastMsg.data &&
      get().curChat &&
      get().curChat.id === lastMsg.chat.id &&
      get().curChat.spaceId === lastMsg.chat.spaceId
    ) {
      let exists =
        get().curMsgs.filter((item: any) => {
          return item.id === lastMsg.data.id;
        }).length > 0;
      if (!exists) {
        let arr: any = [];
        lastMsg.data.msgBody = StringPako.inflate(lastMsg.data.msgBody);
        arr.push(lastMsg.data);
        set({ curMsgs: arr });
      }
    }
    if (!get().authed && get().connection.state == signalR.HubConnectionState.Connected) {
      get()
        .connection.invoke('TokenAuth', get().accessToken)
        .then(() => {
          get().authed = true;
        });
    }
  },
  _cacheChats: () => {
    // TODO:
    // get().anyStore.set(
    //   'orgChat',
    //   {
    //     operation: 'replaceAll',
    //     data: {
    //       name: '我的消息',
    //       sessionChats: get().sessionChats,
    //       nameMap: chat.nameMap,
    //       openChats: chat.openChats,
    //       lastMsg: chat.lastMsg,
    //     },
    //   },
    //   'user',
    // );
  },
  _cacheSession: () => {
    // TODO:
    get().anyStore.update('sessionChats', get().sessionChat, 'user');
  },
  _cacheMsg: (sessionId: string, data: any) => {
    if (data.msgType === 'recall') {
      get().anyStore.update(
        get().hisMsgCollName,
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
      get().anyStore.insert(
        get().hisMsgCollName,
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
  },
}));

export default useChatStore;
