import React, { useState } from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import chatCtrl from '@/ts/controller/chat';
import { GroupMenuType } from './config/menuType';
import { IChat } from '@/ts/core';
const Setting: React.FC<any> = () => {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [key, rootMenu, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  if (!selectMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.itemType == GroupMenuType.Chat) {
          await chatCtrl.setCurrent(data.item);
        } else {
          chatCtrl.currentKey = data.key;
          setSelectMenu(data);
        }
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '打开会话':
            chatCtrl.setCurrent(data.item.chat);
            break;
          case '置顶会话':
            (data.item! as IChat).isToping = true;
            refreshMenu();
            break;
          case '取消置顶':
            (data.item! as IChat).isToping = false;
            refreshMenu();
            break;
          case '清空消息':
            await (data.item! as IChat).clearMessage();
            chatCtrl.changCallback();
            break;
          case '删除会话':
            chatCtrl.deleteChat(data.item);
            break;
          case '会话详情':
            setOpenDetail(!openDetail);
            break;
          case '标记为未读':
            if (chatCtrl.chat) {
              chatCtrl.chat.noReadCount = 1;
              chatCtrl.changCallback();
            }
            break;
        }
      }}
      siderMenuData={rootMenu}>
      <Content key={key} selectMenu={selectMenu} openDetail={openDetail} />
    </MainLayout>
  );
};

export default Setting;
