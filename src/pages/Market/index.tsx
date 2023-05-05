import React from 'react';
import orgCtrl from '@/ts/controller';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
/** 仓库模块 */
const Package: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadMarketMenu);
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        orgCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default Package;
