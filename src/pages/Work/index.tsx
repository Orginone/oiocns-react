import MainLayout from '@/components/MainLayout';
import React from 'react';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadWorkMenu } from './config/menuOperate';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(loadWorkMenu);

  if (!selectMenu || !rootMenu) return <></>;

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} taskType={selectMenu.itemType} space={selectMenu.item} />
    </MainLayout>
  );
};

export default Todo;
