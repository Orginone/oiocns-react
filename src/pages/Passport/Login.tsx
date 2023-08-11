import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import { Button, Checkbox, Form, Input, message, Tabs, Modal } from 'antd';
import React, { useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import orgCtrl from '@/ts/controller';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import cls from './index.module.less';
import useStorage from '@/hooks/useStorage';
const PassportLogin: React.FC<RouteComponentProps> = (props) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Tabs size="large" items={[{ label: '账号密码登录', key: 'account' }]} />
      <Form
        onFinish={async ({ account, password }) => {
          if (account && password) {
            setLoading(true);
            const res = await orgCtrl.provider.login(account, password);
            setLoading(false);
            if (res.success) {
              const joinState = window.localStorage.getItem('jionState');

              if (joinState !== 'yes') {
                Modal.confirm({
                  title: '提示',
                  icon: <ExclamationCircleOutlined />,
                  content: '会更好的帮你服务，登录会自动加入"豪波安全科技"客户服务群',
                  okText: '确认',
                  cancelText: '取消',
                  onOk: () => {
                    window.localStorage.setItem('jionState', 'yes');
                    props.history.push('/home');
                  },
                });
              } else {
                props.history.push('/home');
              }
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
        <Link className={cls.text} to="/passport/register">
          注册用户
        </Link>
      </Form>
    </div>
  );
};
export default PassportLogin;
