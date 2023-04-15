import { ChatModel } from '@/ts/base/model';
import { CreateChat } from './chat';
import { XTarget } from '@/ts/base/schema';
import { TargetType } from '..';

/** 根据target生成会话 */
export const TargetChat = (
  target: ChatModel | XTarget,
  userId: string,
  spaceId: string,
  spaceName: string,
  label: string,
) => {
  const xtarget = target as XTarget;
  if (xtarget.thingId && xtarget.thingId.length > 0) {
    return CreateChat(
      spaceId,
      spaceName,
      {
        photo: xtarget.avatar || '{}',
        id: xtarget.id,
        name: xtarget.team?.name || xtarget.name,
        label: label,
        remark: xtarget.team?.remark || '',
        typeName: xtarget.typeName,
      } as ChatModel,
      userId,
    );
  }
  return CreateChat(spaceId, spaceName, target as ChatModel, userId);
};

export const gpt3 = (id: string) => {
  return TargetChat(
    {
      id: id,
      name: '奥集能',
      label: 'GPT3',
      remark: '免费的,有点慢,忍忍!',
      typeName: TargetType.Person,
    } as ChatModel,
    id,
    id,
    '我的',
    '奥集能',
  );
};

export type { IChat, IChatGroup } from './ichat';
