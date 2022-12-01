import React, { useState, useEffect } from 'react';
import CardOrTable from '@/components/CardOrTableComp';
import { MarketController } from '@/ts/controller/store/marketCtrl';
import { settingCtrl } from '@/ts/controller/setting/settingCtrl';
import cls from './index.module.less';
import { columns } from './config';

/**
 * @description: 用户管理
 * @return {*}
 */
const UserManagement = () => {
  const [curSpace, setCurSpace] = useState<any>({}); // 当前操作对象（个人/单位）
  const [page, setPage] = useState<number>(1);
  /**
   * @description: 实例化商店对象
   * @return {*}
   */
  const marketCtrl = new MarketController(curSpace);
  useEffect(() => {
    const id = settingCtrl.subscribe(() => {
      setCurSpace(settingCtrl?.getCurWorkSpace?.targtObj);
      if (settingCtrl.getCurWorkSpace) {
        setCurSpace(settingCtrl?.getCurWorkSpace?.targtObj);
      }
    });
    return () => {
      settingCtrl.unsubscribe(id);
    };
  }, []);

  useEffect(() => {
    marketCtrl.getMember(page);
  }, []);
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
