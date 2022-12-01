import React from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import cls from './index.module.less';
import { columns } from './config';

/**
 * @description: 用户管理
 * @return {*}
 */
const UserManagement = () => {
  return (
    <div className={cls['user-management']}>
      <CardOrTable
        rowKey="id"
        dataSource={[]}
        showChangeBtn={false}
        columns={columns as any}
        headerTitle="用户管理"
      />
    </div>
  );
};
export default UserManagement;
