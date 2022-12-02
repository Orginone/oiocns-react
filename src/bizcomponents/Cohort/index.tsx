import { Button, Form, Input } from 'antd';
import React from 'react';
import { Modal } from 'antd';
import { useState } from 'react';
import { IPerson } from '@/ts/core/target/itarget';
import CohortController from '../../ts/controller/cohort/index';

interface CohortServiceType {
  Person: IPerson;
}

const CreateCohort: React.FC<CohortServiceType> = ({ Person }) => {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const validateMessages = {
    required: '群组名称不能为空',
    types: {
      email: '${label} is not a valid email!',
      number: '${label} is not a valid number!',
    },
    number: {
      range: '${label} must be between ${min} and ${max}',
    },
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();
  const onSave = async () => {
    const values = await form.validateFields();
    console.log(values); //2.表单验证并获取表单值
    CohortController.createCohort(
      Person,
      values.cohort.name,
      values.cohort.code,
      values.cohort.remark,
    );
    setIsModalOpen(false);
  };
  return (
    <div>
      <Button type="link" onClick={showModal}>
        创建群组
      </Button>
      <Modal title="创建群组" open={isModalOpen} onOk={onSave} onCancel={handleOk}>
        <Form
          {...layout}
          name="nest-messages"
          labelAlign="left"
          labelCol={{ span: 7 }}
          wrapperCol={{ span: 20 }}
          layout="horizontal"
          validateMessages={validateMessages}
          form={form}>
          <Form.Item
            name={['cohort', 'name']}
            label="群组名称"
            rules={[
              {
                pattern: /^[\u4e00-\u9fa5]{2,6}$/,
                message: '群组内容只能为长度2-6的中文',
                validateTrigger: 'onBlur',
              },
              { required: true, message: '请输入群组内容' },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['cohort', 'code']}
            label="群组编号"
            rules={[
              {
                pattern: /^[a-zA-Z]+$/,
                message: '群组编号为英文字符组成',
                validateTrigger: 'onBlur',
              },
              { required: true, message: '群组编号不能为空' },
              { message: '请输入长度为2-10字符的群组编号', min: 2, max: 20 },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['cohort', 'remark']}
            label="群组简介"
            rules={[
              { required: true, message: '请输入群组简介' },
              { message: '群组简介内容不能超过200字符', max: 200 },
            ]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default CreateCohort;
