import { Button, Card, Descriptions } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { useEffect, useState } from 'react';
import cls from './index.module.less';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ICompany } from '@/ts/core';
// import { UserOutlined } from '@ant-design/icons';

/**
 * 单位信息
 * @returns
 */
const SettingInfo: React.FC = () => {
  const [key] = useCtrlUpdate(userCtrl);
  const [compinfo, setCompInfo] = useState<ICompany>();
  useEffect(() => {
    if (userCtrl.Company) {
      setCompInfo(userCtrl.Company);
    }
  }, [key]);

  // 信息标题
  const title = (
    <div className={cls['company-info-title']}>
      <div>
        <Title level={4}>当前单位</Title>
        {/* <Avatar size={48} icon={<UserOutlined />} /> */}
      </div>
      <div>
        <Button type="link">编辑信息</Button>
        <Button type="link">单位认证</Button>
        <Button type="link">更多</Button>
      </div>
    </div>
  );
  // 信息内容
  const content = (
    <div className={cls['company-info-content']}>
      <Card bordered={false}>
        <Descriptions title={title} bordered column={2}>
          <Descriptions.Item label="社会统一信用代码">
            {compinfo?.target.code}
          </Descriptions.Item>
          <Descriptions.Item label="单位名称">{compinfo?.target.name}</Descriptions.Item>
          <Descriptions.Item label="单位法人">-</Descriptions.Item>
          <Descriptions.Item label="联系方式">-</Descriptions.Item>
          <Descriptions.Item label="单位简介" span={2}>
            {compinfo?.target.team?.remark}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
  return <div>{content}</div>;
};

export default SettingInfo;
