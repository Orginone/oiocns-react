import {
  AiFillWechat,
  AiOutlineAlipayCircle,
  AiOutlineLock,
  AiOutlineQq,
  AiOutlineUser,
} from '@/icons/ai';
import { Button, Checkbox, Form, Input, message, Space, Tabs } from 'antd';
import React from 'react';
import QrCode from 'qrcode.react';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';
import { kernel, model } from '@/ts/base';
import { getResouces } from '@/config/location';

const PassportLogin: React.FC<{ to: (flag: string) => void }> = ({ to }) => {
  const history = useHistory();
  const resources = getResouces();
  const [loading, setLoading] = React.useState(false);
  const flexStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'end',
  };
  const AccountLogin: React.FC = () => {
    return (
      <Form
        onFinish={async ({ account, password }) => {
          if (account && password) {
            setLoading(true);
            const res = await orgCtrl.auth.login({
              account: account,
              password: password,
            });
            setLoading(false);
            if (res.success) {
              history.push('/home');
            }
          } else {
            message.warning('请填写账号和密码 ！');
          }
        }}>
        <Form.Item
          name="account"
          rules={[{ required: true, message: '请输入用户名/手机号' }]}>
          <Input
            size="large"
            prefix={<AiOutlineUser />}
            placeholder="请输入用户名/手机号"
          />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password
            size="large"
            prefix={<AiOutlineLock />}
            placeholder="请输入密码"
          />
        </Form.Item>
        <Form.Item>
          <div style={flexStyle}>
            <Checkbox>记住密码</Checkbox>
            <Button type="link" onClick={() => to('forget')}>
              忘记密码
            </Button>
          </div>
        </Form.Item>
        <Form.Item>
          <Button block loading={loading} type="primary" size="large" htmlType="submit">
            登录
          </Button>
        </Form.Item>
        <Form.Item>
          <div style={flexStyle}>
            <div style={{ fontSize: 22, ...flexStyle, gap: 10, color: '#666666' }}>
              <span style={{ fontSize: 14 }}>其它登录方式</span>
              <AiOutlineAlipayCircle />
              <AiFillWechat />
              <AiOutlineQq />
            </div>
            <Button type="link" onClick={() => to('register')}>
              注册用户
            </Button>
          </div>
        </Form.Item>
      </Form>
    );
  };
  const DynamicCodeLogin: React.FC = () => {
    const [formData, setFormData] = React.useState<model.LoginModel>({
      account: '',
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
      const res = await orgCtrl.auth.login(formData);
      console.log(res);
      if (res.success && res.data) {
        history.push('/home');
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
      console.log(res);
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
        <Button block loading={loading} type="primary" size="large" onClick={login}>
          登录
        </Button>
        <div style={flexStyle}>
          <div style={{ fontSize: 22, ...flexStyle, gap: 10, color: '#666666' }}>
            <span style={{ fontSize: 14 }}>其它登录方式</span>
            <AiOutlineAlipayCircle />
            <AiFillWechat />
            <AiOutlineQq />
          </div>
          <Button type="link" onClick={() => to('register')}>
            注册用户
          </Button>
        </div>
      </Space>
    );
  };
  const QrCodeLogin: React.FC = () => {
    return (
      <Space direction="vertical" size={32}>
        <div style={{ textAlign: 'center', marginLeft: 50 }}>
          <QrCode
            level="H"
            size={250}
            fgColor={'#204040'}
            value={kernel.connectionId}
            imageSettings={{
              width: 60,
              height: 60,
              excavate: true,
              src: resources.favicon,
            }}
          />
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginTop: 10,
            }}>
            使用移动端扫码登录
          </div>
        </div>
        <div style={flexStyle}>
          <div style={{ fontSize: 22, ...flexStyle, gap: 10, color: '#666666' }}>
            <span style={{ fontSize: 14 }}>其它登录方式</span>
            <AiOutlineAlipayCircle />
            <AiFillWechat />
            <AiOutlineQq />
          </div>
          <Button type="link" onClick={() => to('register')}>
            注册用户
          </Button>
        </div>
      </Space>
    );
  };
  return (
    <div>
      <Tabs
        size="large"
        items={[
          { label: '账户密码登录', key: 'account', children: <AccountLogin /> },
          { label: '验证码登录', key: 'dynamicCode', children: <DynamicCodeLogin /> },
          { label: '二维码登录', key: 'qrCode', children: <QrCodeLogin /> },
        ]}
      />
    </div>
  );
};
export default PassportLogin;
