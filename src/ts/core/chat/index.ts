import { ChatModel } from '@/ts/base/model';
import { CreateChat } from './chat';

/** 根据target生成会话 */
export const TargetChat = (
  target: ChatModel,
  userId: string,
  spaceId: string,
  spaceName: string,
) => {
  return CreateChat(spaceId, spaceName, target, userId);
};

export type { IChat, IChatGroup } from './ichat';
