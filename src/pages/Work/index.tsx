import MainLayout from '@/components/MainLayout';
import React from 'react';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadBrowserMenu } from './config/menuOperate';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(loadBrowserMenu);

  if (!selectMenu || !rootMenu) return <></>;

  return (
    <MainLayout
      previewFlag={'work'}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} current={selectMenu.item} />
    </MainLayout>
  );
};

export default Todo;
