import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions } from 'antd';
import Title from 'antd/lib/typography/Title';
import React from 'react';
import cls from './index.module.less';

/**
 * 单位信息
 * @returns
 */
const SettingInfo: React.FC = () => {
  // 信息标题
  const title = (
    <div className={cls['company-info-title']}>
      <div>
        <Title level={4}>当前单位</Title>
        <Avatar size={48} icon={<UserOutlined />} />
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
          <Descriptions.Item label="单位名称">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="单位法人">1810000000</Descriptions.Item>
          <Descriptions.Item label="社会统一信用代码">
            Hangzhou, Zhejiang
          </Descriptions.Item>
          <Descriptions.Item label="联系方式">empty</Descriptions.Item>
          <Descriptions.Item label="单位地址" span={2}>
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
  return <div>{content}</div>;
};

export default SettingInfo;
