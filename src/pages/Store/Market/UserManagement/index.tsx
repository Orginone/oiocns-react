import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketTypes } from 'typings/marketType';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import cls from './index.module.less';
import { columns } from './config';

/**
 * @description: 用户管理
 * @return {*}
 */
const UserManagement = () => {
  const [data, setData] = useState<any>([]); // 当前操作的商店对象
  const [dataSource, setDataSource] = useState<any>([]); // 商店内对应的用户信息
  useEffect(() => {
    const id = marketCtrl.subscribe(() => {
      setData(marketCtrl?.marketMenber);
    });
    return () => {
      marketCtrl.unsubscribe(id);
    };
  }, []);
  useEffect(() => {
    let arr: any = [];
    data?.forEach((item: any) => {
      arr.push(item?.target);
    });
    setDataSource(arr);
  }, [data]);

  // 操作内容渲染函数
  const renderOperation = (
    item: MarketTypes.ProductType,
  ): MarketTypes.OperationType[] => {
    return [
      {
        key: 'detail',
        label: '移出',
        onClick: () => {
          const targetIds: string[] = [];
          targetIds.push(item?.id);
          marketCtrl.removeMember(targetIds);
        },
      },
    ];
  };

  return (
    <div className={cls['user-management']}>
      <CardOrTable
        rowKey="id"
        dataSource={dataSource ?? []}
        showChangeBtn={false}
        columns={columns as any}
        headerTitle="用户管理"
        operation={renderOperation}
      />
    </div>
  );
};
export default UserManagement;
