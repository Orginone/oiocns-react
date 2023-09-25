import { AiOutlineLock, AiOutlineUser } from '@/icons/ai';
import { Button, Checkbox, Form, Input, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import orgCtrl from '@/ts/controller';

import cls from './index.module.less';

const PassportLogin: React.FC<RouteComponentProps> = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      {/*<div className={cls.DivideLine}></div>*/}
      <Tabs
        size="large"
        items={[
          { label: '已有账号登陆', key: 'account' },
          { label: '扫码登录', key: 'qrCode' },
        ]}
      />
      <Form
        onFinish={async ({ account, password }) => {
          if (account && password) {
            setLoading(true);
            const res = await orgCtrl.provider.login(account, password);
            setLoading(false);
            if (res.success) {
              props.history.push('/home');
            }
          } else {
            message.warning('请填写账号和密码 ！');
          }
        }}>
        <Form.Item name="account" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input size="large" prefix={<AiOutlineUser />} placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password
            size="large"
            prefix={<AiOutlineLock />}
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
      </Form>
      <Link className={cls.text} to="/passport/register">
        注册用户
      </Link>
    </div>
  );
};
export default PassportLogin;
