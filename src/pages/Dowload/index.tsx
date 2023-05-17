import React from 'react';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
/** 存储模块 */
const Dowload: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadMarketMenu);
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default Dowload;
