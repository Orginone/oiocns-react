import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import cls from './index.module.less';
import { MarketCallBackTypes } from '@/ts/controller/store/marketCtrl';
import { columns } from './config';
import { MarketTypes } from 'typings/marketType';

/**
 * @description: 用户管理
 * @return {*}
 */
const UserManagement = () => {
  const [data, setData] = useState<any>([]); // 当前操作的商店对象
  const [total, setTotal] = useState<number>(0); // 总数
  const [dataSource, setDataSource] = useState<any>([]); // 商店内对应的用户信息
  useEffect(() => {
    const id = marketCtrl.subscribePart(MarketCallBackTypes.UserManagement, () => {
      const { total = 0, result = [] } = marketCtrl!.marketMenber;
      setData(result);
      setTotal(total);
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

  /**
   * @description: 操作内容渲染函数
   * @param {MarketTypes} item
   * @return {*}
   */
  const renderOperation = (item: MarketTypes.ProductType): common.OperationType[] => {
    return [
      {
        key: 'detail',
        label: '移出',
        onClick: () => {
          marketCtrl.removeMember([item.id]);
        },
      },
    ];
  };

  /**
   * @desc: 页码切换函数
   * @param {number} page
   * @param {number} pageSize
   * @return {*}
   */
  const handlePageChange = (page: number, pageSize: number, filter?: string) => {
    marketCtrl.getMember({ page, pageSize, filter });
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
        total={total}
        onChange={handlePageChange}
      />
    </div>
  );
};
export default UserManagement;
