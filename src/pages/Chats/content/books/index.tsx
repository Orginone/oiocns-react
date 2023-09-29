import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import { ICompany, ISession } from '@/ts/core';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import SegmentContent from '@/components/Common/SegmentContent';
import { command } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';

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
  belong: ICompany;
}) => {
  const [select, setSelect] = useState<ISession>();
  const [segmented, setSegmented] = useStorage('segmented', 'list');
  const [msgKey, setKey] = useState(generateUuid());
  useEffect(() => {
    const id = command.subscribeByFlag('session', () => {
      setKey(generateUuid());
    });
    return () => {
      command.unsubscribeByFlag(id);
    };
  }, []);
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
  return (
    <SegmentContent
      key={msgKey}
      onSegmentChanged={setSegmented}
      description={`${chats.length}个会话`}
      content={
        <>
          {segmented === 'table' ? (
            <TableMode chats={chats} select={select} sessionOpen={sessionOpen} />
          ) : segmented === 'icon' ? (
            <IconMode chats={chats} select={select} sessionOpen={sessionOpen} />
          ) : (
            <ListMode chats={chats} select={select} sessionOpen={sessionOpen} />
          )}
          {chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </>
      }
    />
  );
};
export default Book;
