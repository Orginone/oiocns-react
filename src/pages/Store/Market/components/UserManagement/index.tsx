import React, { useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { common } from 'typings/common';
import cls from './index.module.less';
import { columns } from './config';
import { IMarket } from '@/ts/core';
import { XMarketRelation } from '@/ts/base/schema';
import { getUuid } from '@/utils/tools';
interface Iprops {
  tkey: string;
  current: IMarket;
}
/**
 * @description: 用户管理
 * @return {*}
 */
const UserManagement = (props: Iprops) => {
  const [key, setKey] = useState('');
  /**
   * @description: 操作内容渲染函数
   * @param {MarketTypes} item
   * @return {*}
   */
  const renderOperation = (item: XMarketRelation): common.OperationType[] => {
    return [
      {
        key: 'detail',
        label: '移出',
        onClick: async () => {
          await props.current.removeMember([item.id]);
          setKey(getUuid());
        },
      },
    ];
  };

  return (
    <div id={key} className={cls['user-management']}>
      <CardOrTable<XMarketRelation>
        rowKey="id"
        dataSource={[]}
        showChangeBtn={false}
        columns={columns as any}
        headerTitle="用户管理"
        request={async (page) => {
          return await props.current.getMember(page);
        }}
        operation={renderOperation}
      />
    </div>
  );
};
export default UserManagement;
