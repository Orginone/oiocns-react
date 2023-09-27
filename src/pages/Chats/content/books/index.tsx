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

  return (
    <SegmentContent
      key={msgKey}
      onSegmentChanged={setSegmented}
      description={`${chats.length}个会话`}
      content={
        <>
          {segmented === 'table' ? (
            <TableMode chats={chats} />
          ) : segmented === 'icon' ? (
            <IconMode chats={chats} />
          ) : (
            <ListMode chats={chats} />
          )}
          {chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </>
      }
    />
  );
};
export default Book;
