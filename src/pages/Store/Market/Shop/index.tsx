import cls from './index.module.less';
import React, { useEffect, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTableWithBuy';
import marketCtrl from '@/ts/controller/store/marketCtrl';

const Index: React.FC = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    marketCtrl.marketTableCallBack = setData;
    marketCtrl.getStoreProduct('market');
  }, []);

  return (
    <>
      <AppShowComp
        headerTitle="共享仓库"
        className={cls['market-public-wrap']}
        list={data}
        columns={marketCtrl.getColumns('market')}
        queryFun={marketCtrl.getStoreProduct}
      />
    </>
  );
};

export default React.memo(Index);
