import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Descriptions, Space } from 'antd';
import { Typography, Divider, Collapse } from 'antd';
import React, { useState } from 'react';
import Layout from 'antd/lib/layout/layout';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import Forget from '../Password/Forget';
const PersonInfo: React.FC = () => {
  const { Title } = Typography;
  const { Panel } = Collapse;
  const [flag, setFlag] = useState('更多信息');
  const value = () => setFlag(changeStatus(flag));
  const changeStatus = (key: string | string[]) => {
    var returnValue: string = '';
    if (key === '收起') {
      returnValue = '更多信息';
    }
    if (key === '更多信息') {
      returnValue = '收起';
    }
    return returnValue;
  };
  const title = (
    <div className={cls['person-info-title']}>
      <div>
        <Title level={5}>
          <strong>当前用户</strong>
        </Title>
        <Avatar size={48} icon={<UserOutlined />} />
      </div>
      <div>
        <Space split={<Divider type="vertical" />}>
          <Forget />
          <Button type="link">编辑</Button>
        </Space>
      </div>
    </div>
  );
  return (
    <Layout className={cls.container}>
      <Card bordered={false}>
        <Descriptions title={title} column={2}>
          <Descriptions.Item label="姓名">待定</Descriptions.Item>
          <Descriptions.Item label="性别">待定</Descriptions.Item>
          <Descriptions.Item label="邮箱">待定</Descriptions.Item>
          <Descriptions.Item label="联系方式">待定</Descriptions.Item>
          <Descriptions.Item label="家庭地址" span={2}>
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item>
        </Descriptions>
        <Collapse
          expandIcon={(pro) => {
            if (pro.isActive) {
              return (
                <a style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                  收起
                  <CaretUpOutlined />
                </a>
              );
            }
            return (
              <a style={{ fontSize: '14px', whiteSpace: 'nowrap' }}>
                更多信息
                <CaretDownOutlined />
              </a>
            );
          }}
          onChange={value}
          className={cls['ogo-collapse']}
          expandIconPosition="right"
          collapsible="header"
          defaultActiveKey={['1']}
          ghost>
          <Panel header={null} key="0" style={{ float: 'right' }}>
            <Descriptions>
              <Descriptions.Item style={{ float: 'left' }} label="UserName">
                Zhou Maomao
              </Descriptions.Item>
              <Descriptions.Item style={{ float: 'left' }} label="Telephone">
                1810000000
              </Descriptions.Item>
              <Descriptions.Item label="Live">Hangzhou, Zhejiang</Descriptions.Item>
              <Descriptions.Item label="Remark">empty</Descriptions.Item>
              <Descriptions.Item label="Address">
                No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
              </Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      </Card>
    </Layout>
  );
};
export default PersonInfo;
