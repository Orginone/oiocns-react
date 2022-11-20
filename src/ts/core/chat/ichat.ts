import { schema, model } from '../../base';
import { MessageType } from '../enum';
/**
 * 会话接口
 */
export interface IChat {
  /** 会话Id */
  chatId: string;
  /** 所在空间ID */
  spaceId: string;
  /** 所在空间名称 */
  spaceName: string;
  /** 群成员总数 */
  personCount: number;
  /** 会话对应的目标 */
  target: model.ChatModel;
  /** 会话的历史消息 */
  messages: schema.XImMsg[];
  /** 群成员 */
  persons: schema.XTarget[];
  /**
   * 加载更多历史消息
   * @param filter 过滤条件
   */
  moreMessage(filter: string): Promise<void>;
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
  reCallMessage(id: string): void;
  /**
   * 删除消息
   * @param id 删除消息
   */
  deleteMessage(id: string): void;
  /**
   * 清空历史记录
   */
  clearMessage(): void;
  /**
   * 会话接收到消息
   * @param msg 消息
   */
  receiveMessage(msg: schema.XImMsg): void;
}
/**
 * 分组会话接口
 */
export interface IChatGroup {
  // 所在空间ID
  spaceId: string;
  // 所在空间名称
  spaceName: string;
  // 是否处于打开状态
  isOpened: boolean;
  // 空间会话
  chats: IChat[];
}
