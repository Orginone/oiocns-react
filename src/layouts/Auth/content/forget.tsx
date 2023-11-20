import { Button, Form, Input, message, Space, Tabs } from 'antd';
import React from 'react';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';

import cls from '../index.module.less';
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import { getResouces } from '@/config/location';
import { model } from '@/ts/base';

const PassportForget: React.FC<{ to: (flag: string) => void }> = ({ to }) => {
  const history = useHistory();
  const resources = getResouces();
  const PrivateKeyReset = () => {
    const validate = (val: any): boolean => {
      if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(val.account)) {
        message.warn('请输入正确的账号');
        return false;
      }
      if (val.privateKey?.length ?? 0 < 10) {
        message.warn('请输入正确的私钥');
        return false;
      }
      let reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}/;
      if (!reg.test(val.password)) {
        message.warn('密码必须包含：数字、字母、特殊字符');
        return false;
      }
      return true;
    };
    // 提交
    const submit = async (val: any) => {
      if (validate(val)) {
        const res = await orgCtrl.auth.resetPassword({
          account: val.account,
          privateKey: val.privateKey,
          password: val.password,
        });
        if (res.success) {
          message.success('重置密码成功！');
          history.push('/home');
        } else {
          message.error(res.msg || '重置密码失败！');
        }
      }
    };
    return (
      <Form onFinish={submit}>
        <Form.Item name="account" rules={[{ required: true, message: '请输入账号' }]}>
          <Input size="large" placeholder="请输入账号" />
        </Form.Item>
        <Form.Item
          name="privateKey"
          rules={[{ required: true, message: '请输入注册时保存的账户私钥' }]}>
          <Input
            size="large"
            prefix={<AiOutlineLock />}
            placeholder="请输入注册时保存的账户私钥"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入新密码' }]}>
          <Input.Password
            prefix={<AiOutlineLock />}
            size="large"
            placeholder="请输入新密码"
          />
        </Form.Item>
        <Form.Item>
          <Button
            block
            size="large"
            type="primary"
            htmlType="submit"
            className={cls.button}>
            重置密码
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => to('login')}>
            返回登录
          </Button>
        </Form.Item>
      </Form>
    );
  };
  const DynamicCodeReset: React.FC = () => {
    const [formData, setFormData] = React.useState<model.ResetPwdModel>({
      account: '',
      password: '',
    });
    const login = React.useCallback(async () => {
      if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(formData.account)) {
        message.warn('请输入正确的手机号');
        return false;
      }
      if (!/(\d{6})/.test(formData.dynamicCode ?? '')) {
        message.warn('请输入正确的验证码');
        return false;
      }
      let reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}/;
      if (!reg.test(formData.password)) {
        message.warn('密码必须包含：数字、字母、特殊字符');
        return false;
      }
      const res = await orgCtrl.auth.resetPassword(formData);
      if (res.success) {
        message.success('重置密码成功！');
        history.push('/home');
      } else {
        message.error(res.msg || '重置密码失败！');
      }
    }, [formData]);
    const getDynamicCode = React.useCallback(async () => {
      if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(formData.account)) {
        message.warn('请输入正确的手机号');
        return false;
      }
      const res = await orgCtrl.auth.dynamicCode({
        account: formData.account,
        platName: resources.platName,
        dynamicId: '',
      });
      if (res.success && res.data) {
        setFormData({ ...formData, dynamicId: res.data.dynamicId });
      }
    }, [formData]);
    return (
      <Space direction="vertical" size={32}>
        <Input
          size="large"
          prefix={<AiOutlineUser />}
          placeholder="请输入手机号"
          value={formData.account}
          onChange={(e) => setFormData({ ...formData, account: e.target.value })}
        />
        <Space direction="vertical" size={16}>
          <div>短信验证码的编号为：{formData.dynamicId}</div>
          <Space direction="horizontal" size={0}>
            <Input
              size="large"
              prefix={<AiOutlineLock />}
              placeholder={`请输入验证码`}
              onChange={(e) => setFormData({ ...formData, dynamicCode: e.target.value })}
            />
            <Button
              disabled={formData.dynamicId != undefined}
              size="large"
              type="primary"
              onClick={getDynamicCode}>
              获取验证码
            </Button>
          </Space>
        </Space>
        <Input.Password
          prefix={<AiOutlineLock />}
          size="large"
          placeholder="请输入新密码"
          width={410}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Button block type="primary" size="large" onClick={login}>
          重置密码
        </Button>
        <Button type="link" onClick={() => to('login')}>
          返回登录
        </Button>
      </Space>
    );
  };
  return (
    <div>
      <Tabs
        size="large"
        items={[
          { label: '私钥重置', key: 'privateKey', children: <PrivateKeyReset /> },
          { label: '验证码重置', key: 'dynamicCode', children: <DynamicCodeReset /> },
        ]}
      />
    </div>
  );
};
export default PassportForget;
