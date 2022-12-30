import WelfareOrgList from './Supervision/WelfareOrgList';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/pages/Welfare/hooks/useMenuUpdate';

/**
 * 公益仓路由页
 */
const Welfare: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout selectMenu={selectMenu} siderMenuData={menus}>
      <WelfareOrgList />
    </MainLayout>
  );
};

export default Welfare;
