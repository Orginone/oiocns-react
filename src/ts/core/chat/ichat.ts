import { TargetShare } from '@/ts/base/model';
import { schema, model } from '../../base';
import { MessageType } from '../enum';
/**
 * 会话接口
 */
export interface IChat {
  /** 用户ID */
  userId: string;
  /** 唯一标识 */
  fullId: string;
  /** 会话Id */
  chatId: string;
  /** 是否置顶 */
  isToping: boolean;
  /** 所在空间ID */
  spaceId: string;
  /** 所在空间名称 */
  spaceName: string;
  /** 未读消息数量 */
  noReadCount: number;
  /** 群成员总数 */
  personCount: number;
  /** 会话对应的目标 */
  target: model.ChatModel;
  /** 会话的历史消息 */
  messages: schema.XImMsg[];
  /** 群成员 */
  persons: schema.XTarget[];
  /** 最后一条消息 */
  lastMessage: schema.XImMsg | undefined;
  /** 共享信息 */
  shareInfo: TargetShare;
  /**
   * 获取会话缓存
   */
  getCache(): ChatCache;
  /**
   * 加载缓存
   * @param cache 缓存数据
   */
  loadCache(cache: ChatCache): void;
  /**
   * 加载更多历史消息
   * @param filter 过滤条件
   */
  moreMessage(filter: string): Promise<number>;
  /**
   * 加载更多群成员
   * @param filter 过滤条件
   */
  morePerson(filter: string): Promise<void>;
  /**
   * 向会话发送消息
   * @param type 类型
   * @param text 内容
   */
  sendMessage(type: MessageType, text: string): Promise<boolean>;
  /**
   * 撤回消息
   * @param id 消息ID
   */
  reCallMessage(id: string): Promise<void>;
  /**
   * 删除消息
   * @param id 删除消息
   */
  deleteMessage(id: string): Promise<boolean>;
  /**
   * 清空历史记录
   */
  clearMessage(): Promise<boolean>;
  /**
   * 会话接收到消息
   * @param msg 消息
   */
  receiveMessage(msg: schema.XImMsg, noread: boolean): void;
}
/**
 * 分组会话接口
 */
export interface IChatGroup {
  /** 所在空间ID */
  spaceId: string;
  /** 所在空间名称 */
  spaceName: string;
  /** 是否处于打开状态 */
  isOpened: boolean;
  /** 空间会话 */
  chats: IChat[];
}
/**
 * 会话缓存
 */
export type ChatCache = {
  /** 会话ID */
  chatId: string;
  /** 会话所在空间ID */
  spaceId: string;
  /** 是否置顶 */
  isToping: boolean;
  /** 会话未读消息数量 */
  noReadCount: number;
  /** 最新消息 */
  lastMessage: schema.XImMsg | undefined;
};
