import { Descriptions } from 'antd';
import moment from 'moment';
import React from 'react';
import { StorageAgencyModel } from './StorageAgencyList';

export type StorageAgencyProps = {
  storageAgency: StorageAgencyModel;
};

/**
 * 仓储机构信息查看
 */
const StorageAgencyView: React.FC<StorageAgencyProps> = ({ storageAgency }) => {
  return (
    <Descriptions title="基本信息" layout="vertical" column={4}>
      <Descriptions.Item label="仓储名称">{storageAgency.name}</Descriptions.Item>
      <Descriptions.Item label="所在地区">
        {storageAgency.provincialCity}
      </Descriptions.Item>
      <Descriptions.Item label="仓储地址">{storageAgency.address}</Descriptions.Item>
      <Descriptions.Item label="面积">{storageAgency.area}㎡</Descriptions.Item>
      <Descriptions.Item label="库存类型">{storageAgency.storeType}</Descriptions.Item>
      <Descriptions.Item label="注册时间">
        {moment(storageAgency.registerTime).format('YYYY-MM-DD')}
      </Descriptions.Item>
      <Descriptions.Item label="成立时间">
        {moment(storageAgency.establishTime).format('YYYY-MM-DD')}
      </Descriptions.Item>
      <Descriptions.Item label="联系人">{storageAgency.contactPerson}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{storageAgency.phone}</Descriptions.Item>
    </Descriptions>
  );
};

export default StorageAgencyView;
