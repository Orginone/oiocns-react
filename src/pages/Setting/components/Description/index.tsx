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
  const deptInfo = current.target;
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
            {current.shareInfo?.avatar && (
              <Avatar src={current.shareInfo.avatar.thumbnail} />
            )}
            <strong>{current.teamName}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={current.typeName + '代码'}>
          {deptInfo?.code || ''}
        </Descriptions.Item>
        <Descriptions.Item label={'团队简称'}>{deptInfo?.name || ''}</Descriptions.Item>
        <Descriptions.Item label={'团队标识'}>
          {deptInfo?.team?.code || ''}
        </Descriptions.Item>
        <Descriptions.Item label="所属单位">
          {deptInfo && orgCtrl.provider.findNameById(deptInfo.belongId)}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {deptInfo && orgCtrl.provider.findNameById(deptInfo.createUser)}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {deptInfo?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="简介" span={3}>
          {deptInfo?.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
