import React from 'react';
import { Card, Descriptions, Space } from 'antd';
import cls from '../Agency/index.module.less';
import userCtrl from '@/ts/controller/setting';
import { IAuthority } from '@/ts/core/target/authority/iauthority';

/**
 * @description: 权限信息内容
 * @return {*}
 */
const Description = (props: { title: any; current: IAuthority; extra: any }) => {
  const { title, current, extra } = props;
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
        <Descriptions.Item label="权限名称">{current.target.name}</Descriptions.Item>
        <Descriptions.Item label="共享组织">
          <Space>
            {current.target.belongId ? (
              <strong>{userCtrl.findTeamInfoById(current.target.belongId).name}</strong>
            ) : (
              <strong>奥集能平台</strong>
            )}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="权限编码">
          {current.target.code || ''}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {userCtrl.findTeamInfoById(current.target.createUser).name}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {current.target?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {current.target?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
