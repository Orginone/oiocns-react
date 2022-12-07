import cls from './index.module.less';
import React, { useEffect, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTableWithBuy';
import marketCtrl, { MarketCallBackTypes } from '@/ts/controller/store/marketCtrl';

const Index: React.FC = () => {
  const [data, setData] = useState<any>([]);
  useEffect(() => {
    const id = marketCtrl.subscribePart(MarketCallBackTypes.MarketShop, () => {
      setData([...marketCtrl.marketTableList]);
    });
    marketCtrl.getStoreProduct();
    return () => {
      return marketCtrl.unsubscribe(id);
    };
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
