import { Descriptions } from 'antd';
import moment from 'moment';
import React from 'react';
import { WelfareOrgModel } from './WelfareOrgList';

export type WelfareOrgViewProps = {
  welfareOrg: WelfareOrgModel;
};

/**
 * 公益组织信息查看
 */
const WelfareOrgView: React.FC<WelfareOrgViewProps> = ({ welfareOrg }) => {
  return (
    <Descriptions title="基本信息" layout="vertical" column={4}>
      <Descriptions.Item label="组织名称">{welfareOrg.name}</Descriptions.Item>
      <Descriptions.Item label="所在领域">{welfareOrg.businessAreas}</Descriptions.Item>
      <Descriptions.Item label="注册类型">{welfareOrg.registerType}</Descriptions.Item>
      <Descriptions.Item label="统一社会信用代码">{welfareOrg.code}</Descriptions.Item>
      <Descriptions.Item label="登记管理机关">
        {welfareOrg.registerManageOrgan}
      </Descriptions.Item>
      <Descriptions.Item label="业务管理机关">
        {welfareOrg.businessManageOrgan}
      </Descriptions.Item>
      <Descriptions.Item label="注册时间">
        {moment(welfareOrg.registerTime).format('YYYY-MM-DD')}
      </Descriptions.Item>
      <Descriptions.Item label="成立时间">
        {moment(welfareOrg.establishTime).format('YYYY-MM-DD')}
      </Descriptions.Item>
      <Descriptions.Item label="联系人">{welfareOrg.contactPerson}</Descriptions.Item>
      <Descriptions.Item label="联系方式">{welfareOrg.phone}</Descriptions.Item>
    </Descriptions>
  );
};

export default WelfareOrgView;
