import cls from './index.module.less';
import React, { useEffect, useState } from 'react';
import AppShowComp from '@/bizcomponents/AppTableWithBuy';
import marketCtrl, { MarketCallBackTypes } from '@/ts/controller/store/marketCtrl';

const Index: React.FC = () => {
  const [data, setData] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  useEffect(() => {
    const id = marketCtrl.subscribePart(MarketCallBackTypes.MarketShop, () => {
      const { total = 0, result = [] } = marketCtrl.marketTableList;
      setData(result);
      setTotal(total);
    });
    marketCtrl.getStoreProduct();
    return () => {
      return marketCtrl.unsubscribe(id);
    };
  }, []);

  return (
    <>
      <AppShowComp
        headerTitle={marketCtrl.getCurrentMarket()?.market.name || '共享仓库'}
        className={cls['market-public-wrap']}
        list={data}
        total={total}
        columns={marketCtrl.getColumns('market')}
        queryFun={marketCtrl.getStoreProduct}
      />
    </>
  );
};

export default React.memo(Index);
