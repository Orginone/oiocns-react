import React from 'react';
import MainLayout from '@/components/MainLayout';
import Directory from '@/components/Directory';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';

const TeamSetting: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadSettingMenu,
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={(data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Directory key={key} current={selectMenu.item} mode={2} />
    </MainLayout>
  );
};

export default TeamSetting;
