import MallList from './Supervision/MallList';
import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/pages/Welfare/hooks/useMenuUpdate';
import DonationFormList from '@/pages/Welfare/WelfareOrg/DonationFormList';
import DonationFormTodoList from '@/pages/Welfare/WelfareOrg/DonationFormTodoList';
import SupportFormList from '@/pages/Welfare/WelfareOrg/SupportFormList';
import SupportFormTodoList from '@/pages/Welfare/WelfareOrg/SupportFormTodoList';
import WelfareMarket from '@/pages/Welfare/WelfareOrg/Market';
import Store from '@/pages/Welfare/WelfareOrg/Store';
import Market from '@/pages/Welfare/WelfareOrg/Market';

/**
 * 公益仓路由页
 */
const Welfare: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout selectMenu={selectMenu} siderMenuData={menus}>
      <MallList />
    </MainLayout>
  );
};

export default Welfare;
