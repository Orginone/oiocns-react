import React, { useState } from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
const Setting: React.FC<any> = () => {
  // eslint-disable-next-line no-unused-vars
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [checkedList, setCheckedList] = useState<any[]>([]);
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        todoCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      onMenuClick={() => {}}
      onTabChanged={(tabKey) => {
        todoCtrl.setTabIndex(tabKey);
        refreshMenu();
      }}
      checkedList={checkedList}
      onCheckedChange={(checkedKeyList: string[]) => {}}
      siderMenuData={menus[0]?.menu}
      tabs={menus}>
      <Content key={key} selectMenu={selectMenu} reflashMenu={refreshMenu} />
    </MainLayout>
  );
};

export default Setting;
