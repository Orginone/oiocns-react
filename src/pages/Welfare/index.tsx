import React, { useState } from 'react';
import DonationForm from '@/pages/Welfare/WelfareOrg/DonationForm';
import SupportForm from '@/pages/Welfare/WelfareOrg/SupportForm';
import SupportList from '@/pages/Welfare/WelfareOrg/SupportFormList';
import DoDonation from '@/pages/Welfare/WelfareOrg/DoDonation';
import DoDonationList from '@/pages/Welfare/WelfareOrg/DoDonationList';
import DonationFormList from '@/pages/Welfare/WelfareOrg/DonationFormList';
import PublishAssetForm from '@/pages/Welfare/WelfareOrg/PublishAssetForm';
import Store from '@/pages/Welfare/WelfareOrg/Store';
import Market from '@/pages/Welfare/WelfareOrg/Market';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/pages/Welfare/hooks/useMenuUpdate';
import { donationfromListColumns } from '@/pages/Welfare/config/columns';

/**
 * 公益仓路由页
 */
const Welfare: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout selectMenu={selectMenu} siderMenuData={menus}>
      <DoDonationList></DoDonationList>
    </MainLayout>
  );
};

export default Welfare;
