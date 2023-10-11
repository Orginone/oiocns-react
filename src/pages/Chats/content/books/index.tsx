import { Empty, Spin } from 'antd';
import React, { useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ISession } from '@/ts/core';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import SegmentContent from '@/components/Common/SegmentContent';
import TagsBar from '@/components/Directory/tagsBar';
import { command } from '@/ts/base';
import { useFlagCmdEmitter } from '@/hooks/useCtrlUpdate';

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<any> = ({
  chats,
  filter,
}: {
  chats: ISession[];
  filter: string;
}) => {
  const [currentTag, setCurrentTag] = useState('全部');
  const [select, setSelect] = useState<ISession>();
  const [loaded, msgKey] = useFlagCmdEmitter('session');
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  if (chats === undefined) {
    chats = orgCtrl.chats.filter((i) => i.isMyChat);
  }
  chats = chats
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter) ||
        a.chatdata.chatRemark.includes(filter) ||
        a.chatdata.labels.filter((l) => l.includes(filter)).length > 0,
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
  const sessionOpen = async (session: ISession | undefined, dblclick: boolean) => {
    if (dblclick && session) {
      command.emitter('preview', 'open', session);
      orgCtrl.currentKey = session.chatdata.fullId;
      orgCtrl.changCallback();
    } else if (!dblclick) {
      if (session?.id === select?.id) {
        setSelect(undefined);
        command.emitter('preview', 'open');
      } else {
        setSelect(session);
        command.emitter('preview', 'open', session);
      }
    }
  };
  const getChats = (tag?: string) => {
    const filter = tag ?? currentTag;
    return chats.filter((i) => filter === '全部' || i.groupTags.includes(filter));
  };
  return (
    <>
      <TagsBar
        select={currentTag}
        initTags={['全部', '@我', '未读', '单聊', '群聊']}
        entitys={chats}
        selectFiles={[]}
        badgeCount={(tag) => {
          let count = 0;
          getChats(tag).forEach((i) => {
            count += i.chatdata.noReadCount;
          });
          return count;
        }}
        onChanged={(t) => setCurrentTag(t)}></TagsBar>
      <SegmentContent
        key={msgKey}
        onSegmentChanged={setSegmented}
        descriptions={`${getChats().length}个会话`}
        content={
          <Spin spinning={!loaded} tip={'加载中...'} delay={200}>
            {segmented === 'table' ? (
              <TableMode chats={getChats()} select={select} sessionOpen={sessionOpen} />
            ) : segmented === 'icon' ? (
              <IconMode chats={getChats()} select={select} sessionOpen={sessionOpen} />
            ) : (
              <ListMode chats={getChats()} select={select} sessionOpen={sessionOpen} />
            )}
            {chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          </Spin>
        }
      />
    </>
  );
};
export default Book;
