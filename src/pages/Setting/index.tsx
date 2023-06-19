import React from 'react';
import MainLayout from '@/components/MainLayout';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';

const TeamSetting: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadSettingMenu,
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      menusHeight={'calc(100vh - 168px)'}
      selectMenu={selectMenu}
      onSelect={(data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} current={selectMenu.item} />
    </MainLayout>
  );
};

export default TeamSetting;
