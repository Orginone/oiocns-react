import { Form, Input, Modal } from 'antd';
import React from 'react';
interface Iprops {
  open: boolean;
  setCreateWay: Function;
}
const { TextArea } = Input;
const CreateAppByCustomModal: React.FC<Iprops> = ({ open, setCreateWay }: Iprops) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="定制需求填报"
      width={670}
      destroyOnClose={true}
      onCancel={() => setCreateWay(undefined)}
      onOk={async () => {
        let valid = await form.validateFields();
        if (valid) {
          setCreateWay(undefined);
        }
      }}
      open={open}
      bodyStyle={{ padding: 0, border: 0 }}>
      <Form
        layout={'horizontal'}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        form={form}
        onValuesChange={() => {}}
        style={{ maxWidth: 800 }}>
        <Form.Item name="company" label="企业名称" rules={[{ required: true }]}>
          <Input placeholder="请输入企业名称" />
        </Form.Item>
        <Form.Item name="linkman" label="联系人" rules={[{ required: true }]}>
          <Input placeholder="请输入联系人" />
        </Form.Item>
        <Form.Item name="phone" label="联系电话" rules={[{ required: true }]}>
          <Input placeholder="请输入联系电话" />
        </Form.Item>
        <Form.Item name="remark" label="需求简述及要求" rules={[{ required: true }]}>
          <TextArea placeholder="请输入需求" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default CreateAppByCustomModal;
