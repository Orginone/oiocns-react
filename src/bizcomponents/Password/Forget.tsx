import { Button, Form, Input, message, Modal } from 'antd';
import React, { useState } from 'react';
import './index.less';

const PassportForget: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const submit = async (val: any) => {
    console.log(val);
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
    console.log(body);
    // const res = await $API.person.reset({ data: body });
    // if (res.success) {
    //   message.success('重置密码成功！');
    // } else {
    //   message.error(res.msg || '重置密码失败！');
    // }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  // 提交

  return (
    <div>
      <Button type="link" onClick={showModal}>
        修改密码
      </Button>
      <Modal
        title="忘记密码"
        footer={null}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}>
        <Form onFinish={submit} labelCol={{ span: 7 }} layout="vertical">
          <Form.Item
            label="账号"
            name="account"
            rules={[{ required: true, message: '请输入账户' }]}>
            <Input size="large" placeholder="请输入账户" />
          </Form.Item>
          <Form.Item
            label="密钥"
            name="privateKey"
            rules={[{ required: true, message: '请输入注册时保存的账户私钥' }]}>
            <Input size="large" placeholder="请输入注册时保存的账户私钥" />
          </Form.Item>
          <Form.Item
            label="新密码"
            name="firstPassword"
            rules={[{ required: true, message: '请输入新密码' }]}>
            <Input.Password
              size="large"
              placeholder="请输入密码(6-15位：包含大小写字母数字和符号)"
            />
          </Form.Item>
          <Form.Item
            label="确认新密码"
            name="secondPassword"
            rules={[{ required: true, message: '请再次输入密码' }]}>
            <Input.Password size="large" placeholder="请再次输入密码" />
          </Form.Item>
          <Form.Item>
            <div>
              <Button
                className="button-position-confirm"
                type="primary"
                htmlType="submit"
                size="middle">
                确认
              </Button>
              <Button className="button-position" onClick={handleCancel}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default PassportForget;
