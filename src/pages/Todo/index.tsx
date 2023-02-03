import React from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
const Setting: React.FC<any> = () => {
  // eslint-disable-next-line no-unused-vars
  const [key, menus, reflashMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        todoCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      onMenuClick={() => {}}
      siderMenuData={menus}>
      <Content key={key} selectMenu={selectMenu} reflashMenu={reflashMenu} />
    </MainLayout>
  );
};

export default Setting;
