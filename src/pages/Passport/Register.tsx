import { ArrowRightOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, Modal, Steps } from 'antd';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import $API from '@/services';

import cls from './index.module.less';

type RegisterReq = {
  account?: string;
  password?: string;
  nickName?: string;
  name?: string;
  phone?: string;
  motto?: string;
};

const { Step } = Steps;

const steps = ['账户验证', '填写信息'];

const PassportRegister: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [body, setBody] = useState<RegisterReq>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState<String>();
  const history = useHistory();

  // 上一步
  const prev = () => {
    setCurrent(current - 1);
  };

  // 下一步
  const next = (val: any) => {
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
    setCurrent(current + 1);
    setBody({ ...body, ...{ account: val.account, password } });
  };

  // 注册
  const register = async (val: any) => {
    if (!/^[\u4e00-\u9fa5]{2,8}$/.test(val.name)) {
      message.warn('请输入正确的姓名');
      return;
    }
    if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(val.phone)) {
      message.warn('请输入正确的手机号');
      return;
    }
    if (val.nickName && val.nickName.trim() === '') {
      message.warn('请输入正确的昵称');
      return;
    }
    if (val.nickName && val.motto.trim() === '') {
      message.warn('请输入正确的座右铭');
      return;
    }
    // 请求
    const res = await $API.person.register({ data: { ...val, ...body } });
    if (res.success) {
      message.success('注册成功！');
      setPrivateKey(res.data.privateKey);
      setIsModalOpen(true);
    } else {
      message.error(res.msg || '注册失败！');
    }
  };
  // 去登录
  const handleOk = () => {
    history.push({ pathname: '/passport/login' });
  };
  return (
    <div>
      <Form.Item>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item} title={item} />
          ))}
        </Steps>
      </Form.Item>
      {current === 0 && (
        <div>
          <Form onFinish={next}>
            <Form.Item
              name="account"
              rules={[{ required: true, message: '请输入用户名' }]}>
              <Input size="large" placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="firstPassword"
              rules={[{ required: true, message: '请输入密码' }]}>
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
              <Button block type="primary" size="large" htmlType="submit">
                下一步
              </Button>
            </Form.Item>
            <div className={cls.line}>
              <div></div>
              <div className={cls.text}>
                已有账户?
                <Link to="/passport/login">返回登录</Link>
              </div>
            </div>
          </Form>
        </div>
      )}

      {current === 1 && (
        <div>
          <Form onFinish={register}>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: '请输入电话号码' }]}>
              <Input size="large" placeholder="请输入电话号码" />
            </Form.Item>
            <Form.Item
              name="nickName"
              rules={[{ required: true, message: '请输入昵称' }]}>
              <Input size="large" placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[{ required: true, message: '请输入真实姓名' }]}>
              <Input size="large" placeholder="请输入真实姓名" />
            </Form.Item>
            <Form.Item name="motto" rules={[{ required: true, message: '请输入座右铭' }]}>
              <Input size="large" placeholder="请输入座右铭" />
            </Form.Item>
            <Form.Item>
              <Button block type="primary" size="large" htmlType="submit">
                注册
              </Button>
            </Form.Item>
            <div className={cls.line}>
              <Button type="link" onClick={() => prev()} className={cls.prev}>
                上一步
              </Button>
              <div className={cls.text}>
                已有账户?
                <Link to="/passport/login">返回登录</Link>
              </div>
            </div>
          </Form>

          <Modal
            title="账户私钥"
            maskClosable={false}
            open={isModalOpen}
            onOk={handleOk}
            footer={[
              <Button key="login" type="primary" onClick={handleOk}>
                已记住？去登录
                <ArrowRightOutlined />
              </Button>,
            ]}>
            <Alert message="请妥善保管账户私钥，请勿告诉他人！" type="warning" showIcon />
            <Alert
              message="该私钥可以为你重置密码，加解密数据！"
              type="warning"
              showIcon
            />
            <Alert message="可拍照或者截图保存！" type="warning" showIcon />
            <h1>
              <strong>{privateKey}</strong>
            </h1>
          </Modal>
        </div>
      )}
    </div>
  );
};
export default PassportRegister;
