import React from 'react';
import orgCtrl from '@/ts/controller';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import { GroupMenuType } from './config/menuType';
import Content from './content';
import { ITarget } from '@/ts/core';
/** 仓库模块 */
const Package: React.FC = () => {
  const [key, rootMenu, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();

  if (!selectMenu) return <></>;

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        orgCtrl.currentKey = data.key;
        switch (data.itemType) {
          case GroupMenuType.Things:
            (data.item as ITarget).loadSpeciesTree();
            refreshMenu();
            break;
        }
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default Package;
