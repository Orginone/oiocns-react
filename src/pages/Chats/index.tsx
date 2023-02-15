import React from 'react';
import Content from './content';
import ChatLayout from '@/components/ChatLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import chatCtrl from '@/ts/controller/chat';
import { GroupMenuType } from './config/menuType';
import { IChat } from '@/ts/core';
const Setting: React.FC<any> = () => {
  const [key, menus, reFresh, selectTab, setSelectTab, selectMenu, setSelectMenu] =
    useMenuUpdate();

  const getChat = (id: string): IChat | undefined => {
    for (var i = 0; i < chatCtrl.groups.length; i++) {
      const group = chatCtrl.groups[i];
      for (var j = 0; j < group.chats.length; j++) {
        const chat = group.chats[j];
        if (id == chat.target.id) {
          return chat;
        }
      }
    }
    return undefined;
  };
  /**进入会话 */
  const enterChat = (id: string) => {
    setSelectTab('1');
    let chat = getChat(id);
    chatCtrl.setCurrent(chat);
    reFresh();
    chatCtrl.setTabIndex('1');
  };
  return (
    <ChatLayout
      tabKey={selectTab}
      onTabChanged={(tabKey) => {
        setSelectTab(tabKey);
        reFresh();
        chatCtrl.setTabIndex(tabKey);
      }}
      showTopBar={selectMenu.itemType != GroupMenuType.Chat}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.itemType == GroupMenuType.Chat) {
          chatCtrl.setCurrent(data.item);
        }
        setSelectMenu(data);
      }}
      onMenuClick={() => {}}
      menuData={menus}>
      <Content key={key} selectMenu={selectMenu} enterChat={enterChat} />
    </ChatLayout>
  );
};

export default Setting;
