import React from 'react';
import { Avatar, Card, Descriptions, Space } from 'antd';
import { ITarget } from '@/ts/core';
import cls from '../../index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
/**
 * @description: 部门信息内容
 * @return {*}
 */
const DeptDescription = (props: {
  title: any;
  selectDept: ITarget | undefined;
  extra: any;
}) => {
  const { title, selectDept, extra } = props;
  const deptInfo = selectDept?.target;
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
        <Descriptions.Item label="部门名称">
          <Space>
            {selectDept?.shareInfo.avatar && (
              <Avatar src={selectDept?.shareInfo.avatar?.thumbnail} />
            )}
            <strong>{deptInfo?.name}</strong>
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="部门编码">{deptInfo?.code || ''}</Descriptions.Item>
        <Descriptions.Item label="创建人">
          {deptInfo && userCtrl.findTeamInfoById(deptInfo.createUser).name}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {deptInfo?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {deptInfo?.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default DeptDescription;
