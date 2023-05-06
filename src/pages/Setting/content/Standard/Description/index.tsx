import React from 'react';
import { Card, Descriptions, Space, Typography } from 'antd';
import { ISpeciesItem } from '@/ts/core';
import cls from '../index.module.less';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';

/**
 * @description: 分类标准信息内容
 * @return {*}
 */
const Description = ({ current }: { current: ISpeciesItem }) => {
  const belongInfo = orgCtrl.provider.user!.findShareById(current.metadata.belongId);
  const createInfo = orgCtrl.provider.user!.findShareById(current.metadata.createUser);
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={
          <Typography.Title level={5}>
            分类[{current.metadata.name}]基本信息
          </Typography.Title>
        }
        bordered
        column={3}
        labelStyle={{ textAlign: 'center', color: '#606266', width: '160px' }}
        contentStyle={{ textAlign: 'center', color: '#606266' }}>
        <Descriptions.Item label="共享组织">
          <Space>
            <TeamIcon share={belongInfo} />
            <strong>{belongInfo.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          <Space>
            <TeamIcon share={createInfo} />
            <strong>{createInfo.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="分类代码">{current.metadata.code}</Descriptions.Item>
        <Descriptions.Item label="创建时间" span={3}>
          {current.metadata.createTime}
        </Descriptions.Item>
        <Descriptions.Item
          contentStyle={{ textAlign: 'left' }}
          labelStyle={{ textAlign: 'center' }}
          label="分类定义"
          span={3}>
          {current.metadata.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
