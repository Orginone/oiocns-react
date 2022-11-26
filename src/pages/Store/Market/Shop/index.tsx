import cls from './index.module.less';

import React, { useEffect, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTableWithBuy';
// import usePageApi from '@/hooks/usePageApi';
import StoreContent from '@/ts/controller/store/content';

const Index: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    StoreContent.marketTableCallBack = setData;
    StoreContent.getStoreProduct('market');
    // StoreContent.changeMenu('market');
  }, []);
  console.log('三生三世', data);

  return (
    <>
      <AppShowComp
        headerTitle="共享仓库"
        className={cls['market-public-wrap']}
        list={data}
        columns={StoreContent.getColumns('market')}
        queryFun={StoreContent.getStoreProduct}
      />
    </>
  );
};

export default React.memo(Index);
