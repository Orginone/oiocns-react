import React, { useEffect, useState } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import storeClassify from '@/ts/controller/store/sidebar';
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
    const id = storeClassify.subscribe(() => {
      setData(storeClassify?.marketMenber);
    });
    return () => {
      storeClassify.unsubscribe(id);
    };
  }, []);
  useEffect(() => {
    let arr: any = [];
    data?.forEach((item: any) => {
      arr.push(item?.target);
    });
    setDataSource(arr);
  }, [data]);

  return (
    <div className={cls['user-management']}>
      <CardOrTable
        rowKey="id"
        dataSource={dataSource ?? []}
        showChangeBtn={false}
        columns={columns as any}
        headerTitle="用户管理"
      />
    </div>
  );
};
export default UserManagement;
