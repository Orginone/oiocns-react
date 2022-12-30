import { Descriptions } from 'antd';
import moment from 'moment';
import React from 'react';
import { MallModel } from './MallList';

export type MallViewProps = {
  mall: MallModel;
};

/**
 * 公益商城信息查看
 */
const MallView: React.FC<MallViewProps> = ({ mall }) => {
  return (
    <Descriptions title="基本信息" layout="vertical" column={4}>
      <Descriptions.Item label="商城名称">{mall.name}</Descriptions.Item>
      <Descriptions.Item label="公益组织">{mall.welfareOrg}</Descriptions.Item>
      <Descriptions.Item label="仓储机构">{mall.storageAgency}</Descriptions.Item>
      <Descriptions.Item label="主营类型">{mall.mainBusiness}</Descriptions.Item>
      <Descriptions.Item label="次营类型">{mall.minorBusiness}</Descriptions.Item>
      <Descriptions.Item label="注册时间">
        {moment(mall.registerTime).format('YYYY-MM-DD')}
      </Descriptions.Item>
      <Descriptions.Item label="联系人">{mall.contactPerson}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{mall.phone}</Descriptions.Item>
    </Descriptions>
  );
};

export default MallView;
