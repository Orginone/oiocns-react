import React from 'react';
import MainLayout from '@/components/MainLayout';
import Content from './content';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
/** 存储模块 */
const Package: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadStoreMenu);
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} current={selectMenu.item} />
    </MainLayout>
  );
};

export default Package;
