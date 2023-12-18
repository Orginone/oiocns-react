import { Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ISession } from '@/ts/core';
import DirectoryViewer from '@/components/Directory/views';
import { command } from '@/ts/base';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';
import { cleanMenus } from '@/utils/tools';
import { loadFileMenus } from '@/executor/fileOperate';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import AppLayout from '@/components/MainLayout/appLayout';

/** 沟通-通讯录 */
const ChatContent: React.FC = () => {
  const [chats, setChats] = useState<ISession[]>([]);
  const [focusFile, setFocusFile] = useState<ISession>();
  const [loaded, msgKey] = useFlagCmdEmitter('session');
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args: any[]) => {
      if (type != 'session' || args.length < 1) return;
      switch (cmd) {
        case 'open':
          sessionOpen(args[0]);
          break;
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);

  const filterChats = (tag: string) => {
    const temps = orgCtrl.chats.filter((i) => i.isMyChat);
    return temps
      .filter((a) => tag === '最近' || a.groupTags.includes(tag))
      .filter((i) => i.chatdata.lastMessage || i.chatdata.recently)
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
    if (session?.key === focusFile?.key) {
      setFocusFile(undefined);
      command.emitter('preview', 'chat');
    } else {
      setFocusFile(session);
      command.emitter('preview', 'chat', session);
    }
  };
  return (
    <AppLayout previewFlag={'chat'}>
      <Spin spinning={!loaded} tip={'加载中...'}>
        <div style={{ marginLeft: 10, padding: 2, fontSize: 16 }}>
          <OrgIcons chat selected />
          <span style={{ paddingLeft: 10 }}>沟通</span>
        </div>
        <DirectoryViewer
          key={msgKey}
          extraTags={false}
          height={'calc(100% - 100px)'}
          initTags={['最近', '常用', '@我', '未读', '好友', '同事', '群聊']}
          selectFiles={[]}
          focusFile={focusFile}
          content={chats}
          badgeCount={(tag) =>
            filterChats(tag)
              .map((i) => i.badgeCount ?? 0)
              .reduce((total, count) => total + count, 0)
          }
          tagChanged={(tag) => setChats(filterChats(tag))}
          fileOpen={(entity) => sessionOpen(entity as ISession)}
          contextMenu={(entity) => contextMenu(entity as ISession)}
          rightBars={
            <OrgIcons
              relation
              selected
              title="查找会话"
              css={{ cursor: 'pointer' }}
              onClick={() => {
                command.emitter('executor', 'link', '/relation');
              }}
            />
          }
        />
      </Spin>
    </AppLayout>
  );
};
export default ChatContent;
