import React from 'react';
import Content from './content';
import ChatLayout from '@/components/ChatLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import chatCtrl from '@/ts/controller/chat';
import { GroupMenuType } from './config/menuType';
const Setting: React.FC<any> = () => {
  const [key, menus, reFresh, selectTab, setSelectTab, selectMenu, setSelectMenu] =
    useMenuUpdate();
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
      <Content key={key} selectMenu={selectMenu} />
    </ChatLayout>
  );
};

export default Setting;
