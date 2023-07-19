import { Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import orgCtrl from '@/ts/controller';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IMsgChat, msgChatNotify, ICompany } from '@/ts/core';
import { orgAuth } from '@/ts/core/public/consts';
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
  belong,
}: {
  chats: IMsgChat[];
  filter: string;
  belong: ICompany;
}) => {
  const [segmented, setSegmented] = useStorage('segmented', 'icon');
  const [isSupervise, setIsSupervise] = useState<boolean>(false); // 是否有超管权限
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

  /**
   * @description: 页面加载判断是否有超管权限
   * @return {*}
   */
  useEffect(() => {
    if (belong !== undefined) {
      setIsSupervise(belong.hasAuthoritys([orgAuth.SuperAuthId]));
    }
  }, [belong]);

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
            <ListMode chats={chats} isSupervise={isSupervise} />
          )}
          {chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        </>
      }
    />
  );
};
export default Book;
