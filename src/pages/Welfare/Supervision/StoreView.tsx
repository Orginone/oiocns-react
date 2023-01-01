import { Descriptions } from 'antd';
import moment from 'moment';
import React from 'react';
import { StoreModel } from './StoreList';

export type StoreViewProps = {
  store: StoreModel;
};

/**
 * 公益组织商店信息查看
 */
const StoreView: React.FC<StoreViewProps> = ({ store }) => {
  return (
    <Descriptions title="基本信息" layout="vertical" column={4}>
      <Descriptions.Item label="商店名称">{store.name}</Descriptions.Item>
      <Descriptions.Item label="公益组织">{store.welfareOrg}</Descriptions.Item>
      <Descriptions.Item label="仓储机构">{store.storageAgency}</Descriptions.Item>
      <Descriptions.Item label="主营类型">{store.mainBusiness}</Descriptions.Item>
      <Descriptions.Item label="次营类型">{store.minorBusiness}</Descriptions.Item>
      <Descriptions.Item label="注册时间">
        {moment(store.registerTime).format('YYYY-MM-DD')}
      </Descriptions.Item>
      <Descriptions.Item label="联系人">{store.contactPerson}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{store.phone}</Descriptions.Item>
    </Descriptions>
  );
};

export default StoreView;
