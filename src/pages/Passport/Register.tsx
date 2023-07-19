import { AiOutlineArrowRight } from 'react-icons/ai';
import { Alert, Button, Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';

import cls from './index.module.less';
const PassportRegister: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState<String>();
  const history = useHistory();

  // 注册
  const registerAction = async (val: any) => {
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
    let reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}/;
    if (!reg.test(password)) {
      message.warn('密码必须包含：数字、字母、特殊字符');
      return;
    }
    if (!/^[\u4e00-\u9fa5]{2,8}$/.test(val.name)) {
      message.warn('请输入正确的姓名');
      return;
    }
    if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(val.phone)) {
      message.warn('请输入正确的手机号');
      return;
    }
    if (val.motto.trim() === '') {
      message.warn('请输入正确的座右铭');
      return;
    }
    val.nickName = val.name;
    val.account = val.phone;
    val.password = val.firstPassword;
    // 请求
    const res = await orgCtrl.provider.register(val);
    if (res.success) {
      message.success('注册成功！');
      setPrivateKey(res.data.privateKey);
      setIsModalOpen(true);
    }
  };
  // 去登录
  const handleOk = () => {
    history.push({ pathname: '/passport/login' });
  };
  return (
    <div>
      <Form onFinish={registerAction}>
        <Form.Item name="phone" rules={[{ required: true, message: '请输入电话号码' }]}>
          <Input size="large" placeholder="请输入电话号码" />
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
        <Form.Item name="name" rules={[{ required: true, message: '请输入真实姓名' }]}>
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
        onCancel={handleOk}
        footer={[
          <Button key="login" type="primary" onClick={handleOk}>
            已记住？去登录
            <AiOutlineArrowRight />
          </Button>,
        ]}>
        <Alert message="请妥善保管账户私钥，请勿告诉他人！" type="warning" showIcon />
        <Alert message="该私钥可以为你重置密码，加解密数据！" type="warning" showIcon />
        <Alert message="可拍照或者截图保存！" type="warning" showIcon />
        <h1>
          <strong>{privateKey}</strong>
        </h1>
      </Modal>
    </div>
  );
};
export default PassportRegister;
