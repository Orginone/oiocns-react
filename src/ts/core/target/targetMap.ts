import { kernel, orginoneAvatar, parseAvatar } from '@/ts/base';
import { TargetShare } from '@/ts/base/model';
import { XTarget, XTargetArray } from '../../base/schema';

const targetMap = new Map<string, TargetShare>();

export const appendTarget = (targets: XTarget | XTarget[] | XTargetArray) => {
  if ('id' in targets) {
    targetMap.set(targets.id, {
      name: targets.team?.name ?? targets.name,
      avatar: parseAvatar(targets.avatar),
      typeName: targets.typeName,
    });
  } else if ('result' in targets) {
    if (targets.result) {
      for (const item of targets.result) {
        targetMap.set(item.id, {
          name: item.team?.name ?? item.name,
          avatar: parseAvatar(item.avatar),
          typeName: item.typeName,
        });
      }
    }
  } else {
    if (Array.isArray(targets)) {
      for (const item of targets) {
        targetMap.set(item.id, {
          name: item.team?.name ?? item.name,
          avatar: parseAvatar(item.avatar),
          typeName: item.typeName,
        });
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
  const result: TargetShare = {
    name: '奥集能',
    typeName: '人员',
    avatar: orginoneAvatar(),
  };
  if (targetId && !targetMap.has(targetId)) {
    kernel
      .queryTargetById({
        ids: [targetId],
      })
      .then((res) => {
        if (res.success) {
          appendTarget(res.data);
        }
      });
  }
  if (targetMap.get(targetId)) {
    return targetMap.get(targetId)!;
  }
  return result;
};
