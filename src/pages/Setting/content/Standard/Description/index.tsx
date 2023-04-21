import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Space, Typography } from 'antd';
import { ISpeciesItem } from '@/ts/core';
import cls from '../index.module.less';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import orgCtrl from '@/ts/controller';

/**
 * @description: 分类标准信息内容
 * @return {*}
 */
const Description = (info: { current: ISpeciesItem }) => {
  const [data, setData] = useState(info.current);
  useEffect(() => {
    if (info.current) {
      info.current
        .loadInfo(orgCtrl.provider.findUserById(data.target.belongId))
        .then((item) => {
          setData(item);
        });
    }
  }, [info.current]);
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={<Typography.Title level={5}>分类[{data.name}]基本信息</Typography.Title>}
        bordered
        column={3}
        labelStyle={{ textAlign: 'center', color: '#606266', width: '160px' }}
        contentStyle={{ textAlign: 'center', color: '#606266' }}>
        <Descriptions.Item label="共享组织">
          <Space>
            {data.belongInfo ? (
              <>
                <TeamIcon share={data.belongInfo} />
                <strong>{data.belongInfo.name}</strong>
              </>
            ) : (
              <strong>奥集能平台</strong>
            )}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="分类代码">{data.target.code}</Descriptions.Item>
        <Descriptions.Item label="开放域">
          {data.target.public ? '开放' : '私有'}
        </Descriptions.Item>
        <Descriptions.Item label="创建人">
          {orgCtrl.provider.findNameById(data.target.belongId)}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={3}>
          {data.target.createTime}
        </Descriptions.Item>
        <Descriptions.Item
          contentStyle={{ textAlign: 'left' }}
          labelStyle={{ textAlign: 'center' }}
          label="分类定义"
          span={3}>
          {data.target.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
