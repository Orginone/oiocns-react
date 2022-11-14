import { LockOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, message } from 'antd';
import React from 'react';

import useStore from '../../store';
import cls from './index.module.less';

// TODO 锁屏：获取用户账户和头像，填写密码登录
const PassportLock: React.FC = () => {
  const { login, loading } = useStore((state) => ({ ...state }));
  return (
    <div>
      <Form
        onFinish={({ account, password }) => {
          if (account && password) {
            return login({ account, password });
          }
          message.error('锁屏密码错误，请重试！');
        }}>
        <Form.Item>
          <div className={cls.avatar}>
            <Avatar size="large"></Avatar>
          </div>
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="请输入锁屏密码"
          />
        </Form.Item>
        <Form.Item>
          <Button size="large" block loading={loading} type="primary" htmlType="submit">
            解锁
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default PassportLock;
