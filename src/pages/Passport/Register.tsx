import { RegisterType } from '@/ts/base/model';
import userCtrl from '@/ts/controller/setting';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, Modal, Steps } from 'antd';
import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';

import cls from './index.module.less';

const { Step } = Steps;

const steps = ['账户验证', '填写信息'];

const PassportRegister: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [body, setBody] = useState<RegisterType>();
  const [nextValue, setNextValue] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [privateKey, setPrivateKey] = useState<String>();
  const history = useHistory();
  const [form] = Form.useForm();
  const [nextForm] = Form.useForm();

  // 上一步
  const prev = async () => {
    const nextFormValue = await nextForm.getFieldsValue();
    form.setFieldsValue(body);
    setNextValue(nextFormValue);
    setCurrent(current - 1);
  };

  // 下一步
  const next = (val: any) => {
    const password = val.firstPassword;
    setCurrent(current + 1);
    nextForm.setFieldsValue(nextValue);
    setBody({ account: val.account, password } as RegisterType);
  };

  // 注册
  const registerAction = async (val: any) => {
    const res = await userCtrl.register({ ...val, ...body });
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
          <Form onFinish={next} form={form}>
            <Form.Item
              name="account"
              rules={[{ required: true, message: '请输入用户名' }]}>
              <Input size="large" placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item
              name="firstPassword"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                () => ({
                  validator(_, value) {
                    let reg = /(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,15}/;
                    if (value.length < 6) {
                      return Promise.reject(new Error('密码的长度不能小于6!'));
                    } else if (value.length > 15) {
                      return Promise.reject(new Error('密码的长度不能大于15!'));
                    } else if (!reg.test(value)) {
                      return Promise.reject(
                        new Error('密码必须包含：数字、字母、特殊字符!'),
                      );
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}>
              <Input.Password
                size="large"
                placeholder="请输入密码(6-15位：包含大小写字母数字和符号)"
              />
            </Form.Item>
            <Form.Item
              name="secondPassword"
              rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('firstPassword') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码输入不一致!'));
                  },
                }),
              ]}>
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
          <Form onFinish={registerAction} form={nextForm}>
            <Form.Item
              name="phone"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('请输入电话号码!'));
                    }
                    if (!/(^1[3|4|5|7|8|9]\d{9}$)|(^09\d{8}$)/.test(value)) {
                      return Promise.reject(new Error('请输入正确的手机号!'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}>
              <Input size="large" placeholder="请输入电话号码" />
            </Form.Item>
            <Form.Item
              name="nickName"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('请输入昵称!'));
                    } else if (value && value.trim() === '') {
                      return Promise.reject(new Error('请输入正确的昵称!'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}>
              <Input size="large" placeholder="请输入昵称" />
            </Form.Item>
            <Form.Item
              name="name"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('请输入真实姓名!'));
                    } else if (!/^[\u4e00-\u9fa5]{2,8}$/.test(value)) {
                      return Promise.reject(new Error('请输入正确的姓名!'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}>
              <Input size="large" placeholder="请输入真实姓名" />
            </Form.Item>
            <Form.Item
              name="motto"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error('请输入座右铭!'));
                    } else if (value.trim() === '') {
                      return Promise.reject(new Error('请输入正确的座右铭!'));
                    } else {
                      return Promise.resolve();
                    }
                  },
                }),
              ]}>
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
