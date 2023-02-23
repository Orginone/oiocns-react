import React, { useState } from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import { MenuItemType } from 'typings/globelType';
const Setting: React.FC<any> = () => {
  const [checkedList, setCheckedList] = useState<MenuItemType[]>([]);
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      checkedList={checkedList}
      onTabChanged={(_) => {
        setCheckedList([]);
        refreshMenu();
      }}
      tabKey={'1'}
      onCheckedChange={(checkedList: any[]) => {
        setCheckedList(checkedList);
        // refreshMenu();
      }}
      siderMenuData={menus[0]?.menu}
      tabs={menus}>
      <Content
        key={key}
        selectMenu={selectMenu}
        reflashMenu={refreshMenu}
        checkedList={checkedList}
      />
    </MainLayout>
  );
};

export default Setting;
