import React from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
const Setting: React.FC<any> = () => {
  const [
    key,
    menus,
    refreshMenu,
    selectMenu,
    setSelectMenu,
    checkedList,
    operations,
    setCheckedList,
  ] = useMenuUpdate();
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
        operations={operations}
      />
    </MainLayout>
  );
};

export default Setting;
