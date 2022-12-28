import React from 'react';
import { Avatar, Card, Descriptions, Space } from 'antd';
import { ITarget } from '@/ts/core';
import cls from '../Agency/index.module.less';
import userCtrl from '@/ts/controller/setting';
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
            {current.shareInfo.avatar && (
              <Avatar src={current.shareInfo.avatar.thumbnail} />
            )}
            <strong>{current.teamName}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label={current.typeName + '代码'}>
          {deptInfo?.id || ''}
        </Descriptions.Item>
        <Descriptions.Item label={current.typeName + '代码'}>
          {deptInfo?.code || ''}
        </Descriptions.Item>
        <Descriptions.Item label={'团队简称'}>{deptInfo?.name || ''}</Descriptions.Item>
        <Descriptions.Item label={'团队标识'}>
          {deptInfo?.team?.code || ''}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {deptInfo && userCtrl.findTeamInfoById(deptInfo.createUser).name}
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
