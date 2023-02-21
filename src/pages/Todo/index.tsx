import React from 'react';
import Content from './content';
import MainTabLayout from '@/components/MainTabLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
const Setting: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainTabLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        todoCtrl.currentKey = data[0].key;
        setSelectMenu(data);
      }}
      onMenuClick={() => {}}
      tabs={menus}>
      <Content key={key} selectMenu={selectMenu} reflashMenu={refreshMenu} />
    </MainTabLayout>
  );
};

export default Setting;
