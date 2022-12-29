import React, { useState } from 'react';
import DonationForm from '@/pages/Welfare/WelfareOrg/DonationForm';
import SupportForm from '@/pages/Welfare/WelfareOrg/SupportForm';
import DoDonation from '@/pages/Welfare/WelfareOrg/DoDonation';
import DonationFormList from '@/pages/Welfare/WelfareOrg/DonationFormList';
import PublishAssetForm from '@/pages/Welfare/WelfareOrg/PublishAssetForm';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/pages/Welfare/hooks/useMenuUpdate';
import { donationfromListColumns } from '@/pages/Welfare/config/columns';
import { renderRoutes } from 'react-router-config';
import { IRouteConfig } from 'typings/globelType';
type BasicLayoutProps = {
  route: IRouteConfig;
  history: any;
};
/**
 * 公益仓路由页
 */
const Welfare: React.FC<BasicLayoutProps> = (props) => {
  const { route, history } = props;
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  return (
    <MainLayout selectMenu={selectMenu} siderMenuData={menus}>
      {/* <DonationFormList columns={donationfromListColumns}></DonationFormList> */}
      {renderRoutes(route.routes)}
    </MainLayout>
  );
};

export default Welfare;
