import { parseAvatar } from '@/ts/base';
import { TargetShare } from '@/ts/base/model';
import { XTarget, XTargetArray } from '../../base/schema';

const targetMap = new Map<string, XTarget | TargetShare>();

export const appendTarget = (targets: XTarget | XTarget[] | XTargetArray) => {
  if ('id' in targets) {
    targetMap.set(targets.id, targets);
  } else if ('result' in targets) {
    if (targets.result) {
      for (const item of targets.result) {
        targetMap.set(item.id, item);
      }
    }
  } else {
    if (Array.isArray(targets)) {
      for (const item of targets) {
        targetMap.set(item.id, item);
      }
    }
  }
};

export const appendShare = (id: string, share: TargetShare) => {
  if (!targetMap.has(id)) {
    targetMap.set(id, share);
  }
};

export const findTargetShare = (targetId: string) => {
  const result: TargetShare = { name: '奥集能平台', typeName: '平台' };
  if (targetMap.has(targetId)) {
    const item = targetMap.get(targetId)!;
    if ('code' in item) {
      result.avatar = parseAvatar(item.avatar);
      result.name = item.team?.name ?? item.name;
      result.typeName = item.typeName;
    } else {
      result.avatar = item.avatar;
      result.name = item.name;
      result.typeName = item.typeName;
    }
  }
  return result;
};
