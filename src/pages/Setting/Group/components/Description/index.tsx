import React from 'react';
import { Card, Descriptions } from 'antd';

import cls from '../../index.module.less';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { schema } from '@/ts/base';
/**
 * @description: 集团信息内容
 * @return {*}
 */
const Description = (props: {
  title: any;
  selectDept: schema.XTarget | undefined;
  extra: any;
}) => {
  const { title, selectDept, extra } = props;
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
          <strong> {selectDept?.name || ''}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="集团编码">{selectDept?.code || ''}</Descriptions.Item>
        <Descriptions.Item label="所属单位">
          {userCtrl.company.target.name || ''}
        </Descriptions.Item>
        <Descriptions.Item label="单位编码">
          {userCtrl.company.target.code || ''}
        </Descriptions.Item>

        <Descriptions.Item label="创建人">
          {selectDept?.createUser || ''}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {selectDept?.createTime || ''}
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>
          {selectDept?.team?.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
