import { Spin } from 'antd';
import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ISession } from '@/ts/core';
import DirectoryViewer from '@/components/Directory/views';
import { command } from '@/ts/base';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { loadChatOperation } from './common';
/** 沟通-通讯录 */
const Content: React.FC<{
  chats: ISession[];
  filter: string;
}> = ({ chats, filter }) => {
  const [focusFile, setFocusFile] = useState<ISession>();
  const [loaded, msgKey] = useFlagCmdEmitter('session');
  if (chats === undefined) {
    chats = orgCtrl.chats.filter((i) => i.isMyChat);
  }
  chats = chats
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter) ||
        a.chatdata.chatRemark.includes(filter) ||
        a.groupTags.filter((l) => l.includes(filter)).length > 0,
    )
    .sort((a, b) => {
      var num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        if (b.chatdata.lastMsgTime == a.chatdata.lastMsgTime) {
          num = b.isBelongPerson ? 1 : -1;
        } else {
          num = b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 5 : -5;
        }
      }
      return num;
    });

  const contextMenu = (session: ISession | undefined) => {
    return {
      items: loadChatOperation(session) || [],
    };
  };

  const sessionOpen = (session: ISession | undefined) => {
    if (session?.key === focusFile?.key) {
      setFocusFile(undefined);
      command.emitter('preview', 'chat');
    } else {
      setFocusFile(session);
      command.emitter('preview', 'chat', session);
    }
  };
  return (
    <Spin spinning={!loaded} tip={'加载中...'}>
      <DirectoryViewer
        key={msgKey}
        extraTags
        initTags={['全部', '@我', '未读', '置顶', '好友']}
        excludeTags={['本人', '同事']}
        selectFiles={[]}
        focusFile={focusFile}
        content={chats}
        badgeCount={(tag) => {
          let count = 0;
          chats
            .filter((i) => tag === '全部' || i.groupTags.includes(tag))
            .forEach((i) => {
              count += i.badgeCount;
            });
          return count;
        }}
        fileOpen={(entity) => sessionOpen(entity as ISession)}
        contextMenu={(entity) => contextMenu(entity as ISession)}
      />
    </Spin>
  );
};
export default Content;
