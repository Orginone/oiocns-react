import userCtrl from '@/ts/controller/setting';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';

import cls from './index.module.less';

const PassportLogin: React.FC<RouteComponentProps> = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Tabs size="large" items={[{ label: '账号密码登录', key: 'account' }]} />
      <Form
        onFinish={({ account, password }) => {
          if (account && password) {
            setLoading(true);
            return userCtrl.login(account, password).then((res) => {
              setLoading(false);
              if (res.success) {
                props.history.push('/home');
              }
            });
          }
          message.error('账号或密码错误，请重试！');
        }}>
        <Form.Item name="account" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input size="large" prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item>
          <div className={cls.line}>
            <Checkbox>记住密码</Checkbox>
            <Link to="/passport/forget">忘记密码</Link>
          </div>
        </Form.Item>
        <Form.Item>
          <Button block loading={loading} type="primary" size="large" htmlType="submit">
            登录
          </Button>
        </Form.Item>
        <Link className={cls.text} to="/passport/register">
          注册用户
        </Link>
      </Form>
    </div>
  );
};
export default PassportLogin;
