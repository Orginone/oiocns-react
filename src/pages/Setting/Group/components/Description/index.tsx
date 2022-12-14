import React from 'react';
import { Avatar, Card, Descriptions, Space } from 'antd';
import { ITarget } from '@/ts/core';
import cls from '../../index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';

/**
 * @description: 集团信息内容
 * @return {*}
 */
const Description = (props: {
  title: any;
  selectGroup: ITarget | undefined;
  extra: any;
}) => {
  const { title, selectGroup, extra } = props;
  const groupInfo = selectGroup?.target;
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={title}
        extra={extra}
        bordered
        column={2}
        labelStyle={{ textAlign: 'center', color: '#606266' }}
        contentStyle={{ textAlign: 'center', color: '#606266' }}>
        <Descriptions.Item label="集团名称">
          <Space>
            {selectGroup?.shareInfo.avatar && (
              <Avatar src={selectGroup?.shareInfo.avatar?.thumbnail} />
            )}
            <strong>{groupInfo?.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="集团编码">{groupInfo?.code || ''}</Descriptions.Item>
        <Descriptions.Item label="创建人">
          {groupInfo && userCtrl.findTeamInfoById(groupInfo.createUser).name}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {groupInfo?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {groupInfo?.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
