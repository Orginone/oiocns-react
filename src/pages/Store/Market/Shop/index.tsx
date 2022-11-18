import cls from './index.module.less';

import React from 'react';
import API from '@/services';
import AppShowComp from '@/bizcomponents/AppTableWithBuy';
import MarketService from '@/module/appstore/market';

const service = new MarketService({
  nameSpace: 'publicStore',
  searchApi: API.appstore.merchandise,
  createApi: API.appstore.create,
  deleteApi: API.appstore.marketDel,
  updateApi: API.appstore.updateMarket,
});

const Index: React.FC = () => {
  return (
    <>
      <AppShowComp
        headerTitle="共享仓库"
        className={cls['market-public-wrap']}
        service={service}
        columns={service.getShopappColumns()}
      />
    </>
  );
};

export default Index;
