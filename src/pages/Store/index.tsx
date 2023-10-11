import React from 'react';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import Directory from '@/components/Directory';
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
      <Directory key={key} current={selectMenu.item} mode={1} />
    </MainLayout>
  );
};

export default Package;
