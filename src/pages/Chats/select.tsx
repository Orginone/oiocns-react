import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ISession } from '@/ts/core';
import DirectoryViewer from '@/components/Directory/views';
import { command } from '@/ts/base';
import { cleanMenus } from '@/utils/tools';
import { loadFileMenus } from '@/executor/fileOperate';

/** 沟通-通讯录-选择 */
const ChatSelect: React.FC<{ onSelected: (chat: ISession) => void }> = ({
  onSelected,
}) => {
  const [chats, setChats] = useState<ISession[]>([]);
  const [currentTag, setCurrentTag] = useState('全部');

  useEffect(() => {
    setChats(filterChats(currentTag));
  }, [currentTag]);

  const filterChats = (tag: string) => {
    const temps = orgCtrl.chats.filter((i) => i.isMyChat);
    return temps
      .filter((a) => tag === '全部' || a.groupTags.includes(tag))
      .filter((i) => !(i.chatdata.lastMessage || i.chatdata.recently))
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
  };

  const contextMenu = (session: ISession | undefined) => {
    return {
      items: cleanMenus(loadFileMenus(session)) || [],
      onClick: ({ key }: { key: string }) => {
        command.emitter('executor', key, session);
      },
    };
  };

  const sessionOpen = (session: ISession | undefined) => {
    if (session) {
      session.chatdata.recently = true;
      session.cacheChatData().then((res) => {
        if (res) {
          onSelected(session);
        }
      });
    }
  };

  return (
    <DirectoryViewer
      extraTags={false}
      height={'calc(100% - 100px)'}
      initTags={['全部', '好友', '同事', '群聊']}
      selectFiles={[]}
      content={chats}
      badgeCount={(tag) =>
        filterChats(tag)
          .map((i) => i.badgeCount ?? 0)
          .reduce((total, count) => total + count, 0)
      }
      currentTag={currentTag}
      tagChanged={(t) => setCurrentTag(t)}
      fileOpen={(entity) => sessionOpen(entity as ISession)}
      contextMenu={(entity) => contextMenu(entity as ISession)}
    />
  );
};
export default ChatSelect;
