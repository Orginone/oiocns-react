import React, { useState } from 'react';
import DonationForm from '@/pages/Welfare/WelfareOrg/DonationForm';
import SupportForm from '@/pages/Welfare/WelfareOrg/SupportForm';
import DoDonation from '@/pages/Welfare/WelfareOrg/DoDonation';
import DonationFormList from '@/pages/Welfare/WelfareOrg/DonationFormList';
import PublishAssetForm from '@/pages/Welfare/WelfareOrg/PublishAssetForm';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ISpeciesItem, ITarget } from '@/ts/core';
import useMenuUpdate from '@/pages/Welfare/hooks/useMenuUpdate';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import { GroupMenuType } from '@/pages/Welfare/config/menuType';

/**
 * 公益仓路由页
 */
const Welfare: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout selectMenu={selectMenu} siderMenuData={menus}>
      <DoDonation></DoDonation>
    </MainLayout>
  );
};

export default Welfare;
