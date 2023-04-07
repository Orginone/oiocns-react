import React from 'react';
import { Card, Descriptions, Space } from 'antd';
import { ITarget } from '@/ts/core';
import cls from '../Agency/index.module.less';
import userCtrl from '@/ts/controller/setting';

/**
 * @description: 权限信息内容
 * @return {*}
 */
const Description = (props: { title: any; current: ITarget; extra: any }) => {
  const { title, current, extra } = props;
  const authority: any = current['_authority'];
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={title}
        extra={extra}
        bordered
        column={2}
        labelStyle={{
          textAlign: 'left',
          color: '#606266',
          width: 120,
        }}
        contentStyle={{ textAlign: 'left', color: '#606266' }}>
        <Descriptions.Item label="权限名称">{authority.name}</Descriptions.Item>
        <Descriptions.Item label="共享组织">
          <Space>
            {authority.belongId ? (
              <strong>{userCtrl.findTeamInfoById(authority.belongId).name}</strong>
            ) : (
              <strong>奥集能平台</strong>
            )}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="权限编码">{authority.code || ''}</Descriptions.Item>
        <Descriptions.Item label="创建人">
          {userCtrl.findTeamInfoById(authority.createUser).name}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {authority?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {authority?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
