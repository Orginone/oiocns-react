import { Empty } from 'antd';
import React from 'react';
import orgCtrl from '@/ts/controller';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { msgChatNotify, ICompany, ISession } from '@/ts/core';
import useStorage from '@/hooks/useStorage';
import IconMode from './views/iconMode';
import ListMode from './views/listMode';
import TableMode from './views/tableMode';
import SegmentContent from '@/components/Common/SegmentContent';

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
  const [msgKey] = useCtrlUpdate(msgChatNotify);
  if (chats === undefined) {
    chats = orgCtrl.chat.chats.filter((i) => i.isMyChat);
  }
  chats = chats
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter) ||
        a.chatdata.chatRemark.includes(filter) ||
        a.chatdata.labels.filter((l) => l.includes(filter)).length > 0,
    )
    .sort((a, b) => {
      const num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        return b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 1 : -1;
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
