import React from 'react';
import { Avatar, Card, Descriptions, Space } from 'antd';
import { ITarget } from '@/ts/core';
import cls from './index.module.less';
import orgCtrl from '@/ts/controller';
/**
 * @description: 机构信息内容
 * @return {*}
 */
const Description = (props: { title: any; current: ITarget; extra: any }) => {
  const { title, current, extra } = props;
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={title}
        extra={extra}
        bordered
        column={3}
        labelStyle={{
          textAlign: 'left',
          color: '#606266',
          width: 120,
        }}
        contentStyle={{ textAlign: 'left', color: '#606266' }}>
        <Descriptions.Item label={current.typeName + '名称'}>
          <Space>
            {current.share?.avatar && <Avatar src={current.share?.avatar.thumbnail} />}
            <strong>{current.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={current.typeName + '代码'}>
          {current.code || ''}
        </Descriptions.Item>
        <Descriptions.Item label="归属用户">
          {current.metadata.belong?.name}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {orgCtrl.user.findShareById(current.metadata.createUser).name}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {current.metadata.createTime}
        </Descriptions.Item>
        <Descriptions.Item label="简介" span={3}>
          {current.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
