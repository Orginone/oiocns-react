import React, { useEffect, useState } from 'react';
import { Card, Descriptions, Space, Typography } from 'antd';
import { ISpeciesItem } from '@/ts/core';
import cls from '../../index.module.less';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import userCtrl from '@/ts/controller/setting/userCtrl';

/**
 * @description: 分类标准信息内容
 * @return {*}
 */
const Description = (info: { current: ISpeciesItem; extra: any }) => {
  const [data, setData] = useState(info.current);
  useEffect(() => {
    info.current
      .loadInfo(userCtrl.findTeamInfoById(data.target.belongId))
      .then((item) => {
        setData(item);
      });
  }, [info.current]);
  return (
    <Card bordered={false} className={cls['company-dept-content']}>
      <Descriptions
        size="middle"
        title={<Typography.Title level={5}>分类[{data.name}]基本信息</Typography.Title>}
        extra={info.extra}
        bordered
        column={2}
        labelStyle={{ textAlign: 'center', color: '#606266' }}
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
        <Descriptions.Item label="分类编码">{data.target.code}</Descriptions.Item>
        <Descriptions.Item label="开放域">
          {data.target.public ? '开放' : '私有'}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">{data.target.createTime}</Descriptions.Item>
        <Descriptions.Item style={{ textAlign: 'left' }} label="分类定义" span={2}>
          {data.target.remark}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default Description;
