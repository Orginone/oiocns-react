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
  const share = orgCtrl.provider.user!.findShareById(current.metadata.shareId);
  const belong = orgCtrl.provider.user!.findShareById(current.metadata.belongId);
  const create = orgCtrl.provider.user!.findShareById(current.metadata.createUser);
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
        <Descriptions.Item label="共享用户">
          <Space>
            <TeamIcon share={share} />
            <strong>{share.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="归属用户">
          <Space>
            <TeamIcon share={belong} />
            <strong>{belong.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          <Space>
            <TeamIcon share={create} />
            <strong>{create.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="分类代码">{current.metadata.code}</Descriptions.Item>
        <Descriptions.Item label="类型">
          <Space>
            <strong>{current.metadata.typeName}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {current.metadata.createTime}
        </Descriptions.Item>
        <Descriptions.Item contentStyle={{ textAlign: 'left' }} label="分类定义">
          {current.metadata.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
