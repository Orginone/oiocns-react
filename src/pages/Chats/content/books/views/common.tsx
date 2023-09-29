import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { ISession } from '@/ts/core';
import React from 'react';
import { XTarget } from '@/ts/base/schema';
import { command } from '@/ts/base';

export const selectChange = (
  e: CheckboxChangeEvent,
  chaId: string,
  superChatid: string[],
  selectMenus: string[],
): string[] => {
  if (e.target.checked) {
    selectMenus.push(chaId);
    const SuperSet = new Set(superChatid);
    selectMenus = [...selectMenus, ...SuperSet];
  } else {
    const newSet = new Set(selectMenus);
    const SuperSet = new Set(superChatid);
    newSet.delete(chaId);
    SuperSet.delete(chaId);
    const newIdArr = [...newSet, ...SuperSet];
    selectMenus = newIdArr;
  }
  return selectMenus;
};

export const loadChatOperation = (item: ISession | undefined) => {
  const operates: any[] = [];
  if (item) {
    if (item.chatdata.noReadCount < 1) {
      operates.push(
        <a
          key="标记为未读"
          title="标记为未读"
          onClick={async () => {
            item.chatdata.noReadCount += 1;
            item.cacheChatData(true);
            command.emitterFlag('session');
          }}>
          标记为未读
        </a>,
      );
    }
    if (item.chatdata.isToping) {
      operates.push(
        <a
          key="取消置顶"
          title="取消置顶"
          onClick={async () => {
            item.chatdata.labels = item.chatdata.labels.filter((i) => i != '置顶');
            item.chatdata.isToping = false;
            item.cacheChatData(true);
            command.emitterFlag('session');
          }}>
          取消置顶
        </a>,
      );
    } else {
      operates.push(
        <a
          key="置顶会话"
          title="置顶会话"
          onClick={async () => {
            item.chatdata.isToping = true;
            if (item.chatdata.labels.every((i) => i != '置顶')) {
              item.chatdata.labels.push('置顶');
            }
            item.cacheChatData(true);
            command.emitterFlag('session');
          }}>
          置顶会话
        </a>,
      );
    }
    if (!item.isFriend) {
      operates.push(
        <a
          key="加好友"
          title="加好友"
          onClick={async () => {
            if (await item.target.user.pullMembers([item.metadata as XTarget])) {
              command.emitterFlag('session');
            }
          }}>
          加好友
        </a>,
      );
    }
  }
  return operates.map((item, index) => {
    return {
      key: index,
      label: item,
    };
  });
};
