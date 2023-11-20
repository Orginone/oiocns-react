import { AiOutlineArrowRight, AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import { Alert, Button, Input, message, Modal, Space } from 'antd';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import orgCtrl from '@/ts/controller';

import { model } from '@/ts/base';
import { getResouces } from '@/config/location';
const PassportRegister: React.FC<{ to: (flag: string) => void }> = ({ to }) => {
  const resources = getResouces();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState<String>();
  const history = useHistory();
  const [formData, setFormData] = React.useState<model.RegisterModel>({
    account: '',
    name: '',
    remark: '',
    password: '',
    dynamicId: '',
    dynamicCode: '',
  });
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

  const validate = (): boolean => {
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
    if (!/^[\u4e00-\u9fa5]{2,8}$/.test(formData.name)) {
      message.warn('请输入正确的姓名');
      return false;
    }
    if (formData.remark.trim() === '') {
      message.warn('请输入正确的座右铭');
      return false;
    }
    return true;
  };
  // 注册
  const registerAction = React.useCallback(async () => {
    if (validate()) {
      // 请求
      const res = await orgCtrl.auth.register(formData);
      if (res.success) {
        message.success('注册成功！');
        setPrivateKey(res.data.privateKey);
        setIsModalOpen(true);
      }
    }
  }, [formData]);
  const ShowPrivateKey = () => {
    return (
      <Modal
        title="账户私钥"
        maskClosable={false}
        open={isModalOpen}
        onOk={() => history.push('/home')}
        onCancel={() => history.push('/home')}
        footer={[
          <Button key="login" type="primary" onClick={() => history.push('/home')}>
            记住了，马上体验。
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
    );
  };
  return (
    <Space direction="vertical" size={16}>
      <Input
        size="large"
        prefix={<AiOutlineUser />}
        placeholder="请输入手机号"
        value={formData.account}
        onChange={(e) => setFormData({ ...formData, account: e.target.value })}
      />
      <Space direction="vertical" size={8}>
        <div>短信验证码的编号为：{formData.dynamicId}</div>
        <Space direction="horizontal" size={0}>
          <Input
            size="large"
            prefix={<AiOutlineLock />}
            placeholder={`请输入验证码`}
            onChange={(e) => setFormData({ ...formData, dynamicCode: e.target.value })}
          />
          <Button
            disabled={formData.dynamicId.length >= 5}
            size="large"
            type="primary"
            onClick={getDynamicCode}>
            获取验证码
          </Button>
        </Space>
      </Space>
      <Input.Password
        size="large"
        prefix={<AiOutlineLock />}
        placeholder="请输入密码"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      <Input
        size="large"
        placeholder="请输入姓名"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <Input
        size="large"
        placeholder="请输入座右铭"
        value={formData.remark}
        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
      />
      <Button block type="primary" size="large" onClick={registerAction}>
        注册
      </Button>
      <div style={{ fontSize: 22, gap: 10, color: '#666666' }}>
        <span style={{ fontSize: 14 }}>已有账号？</span>
        <Button type="link" onClick={() => to('login')}>
          返回登录
        </Button>
      </div>
      <ShowPrivateKey />
    </Space>
  );
};
export default PassportRegister;
