import React, { useEffect } from 'react';
import { Form, Input, Modal } from 'antd';

interface IProps {
  baseInfoModal: any;
  setBaseInfoModal: Function;
  onOk: Function;
}

/** 基础信息 */
const BaseInfo = (props: IProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldValue('label', props.baseInfoModal?.data?.label);
    form.setFieldValue('remark', props.baseInfoModal?.data?.remark);
  }, [props]);

  return (
    props.baseInfoModal && (
      <Modal
        title={`${props.baseInfoModal.type.includes('form') ? '表单' : '分组'}信息`}
        destroyOnClose={true}
        onCancel={() => {
          props.setBaseInfoModal(undefined);
        }}
        onOk={async () => {
          let valid = await form.validateFields();
          if (valid) {
            let values = form.getFieldsValue();
            props.onOk(values);
            form.resetFields();
          }
        }}
        open={props.baseInfoModal}
        bodyStyle={{ padding: 0, border: 0 }}>
        <Form
          layout={'horizontal'}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          form={form}
          onValuesChange={() => {}}
          style={{ maxWidth: 800 }}>
          <Form.Item name="label" label="名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="remark" label="备注">
            <Input placeholder="请输入备注信息" />
          </Form.Item>
        </Form>
      </Modal>
    )
  );
};

export default BaseInfo;
