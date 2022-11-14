import { Button, Form, Input, message, Tabs } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

import $API from '@/services';

import cls from './index.module.less';

const PassportForget: React.FC = () => {
  // 提交
  const submit = async (val: any) => {
    if (val.firstPassword !== val.secondPassword) {
      message.warn('输入的两次密码不一致！');
      return;
    }
    const password = val.firstPassword;
    if (password.length < 6) {
      message.warn('密码的长度不能小于6');
      return;
    }
    if (password.length > 15) {
      message.warn('密码的长度不能大于15');
      return;
    }
    const body = {
      account: val.account,
      password: val.firstPassword,
      privateKey: val.privateKey,
    };
    const res = await $API.person.reset({ data: body });
    if (res.success) {
      message.success('重置密码成功！');
    } else {
      message.error(res.msg || '重置密码失败！');
    }
  };

  return (
    <div>
      <Tabs size="large" items={[{ label: '忘记密码', key: 'title' }]} />
      <Form onFinish={submit}>
        <Form.Item name="account" rules={[{ required: true, message: '请输入账户' }]}>
          <Input size="large" placeholder="请输入账户" />
        </Form.Item>
        <Form.Item
          name="privateKey"
          rules={[{ required: true, message: '请输入注册时保存的账户私钥' }]}>
          <Input size="large" placeholder="请输入注册时保存的账户私钥" />
        </Form.Item>
        <Form.Item
          name="firstPassword"
          rules={[{ required: true, message: '请输入新密码' }]}>
          <Input.Password
            size="large"
            placeholder="请输入密码(6-15位：包含大小写字母数字和符号)"
          />
        </Form.Item>
        <Form.Item
          name="secondPassword"
          rules={[{ required: true, message: '请再次输入密码' }]}>
          <Input.Password size="large" placeholder="请再次输入密码" />
        </Form.Item>
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className={cls.button}>
            提交
          </Button>
        </Form.Item>
        <Form.Item>
          <Link className={cls.text} to="/passport/login">
            返回登录
          </Link>
        </Form.Item>
      </Form>
    </div>
  );
};
export default PassportForget;
