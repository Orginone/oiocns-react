// import './index.less';
import React, { useState } from 'react';

import { Form, Input, Radio, Select } from 'antd';
interface indexType {
  initialValues: any; //props
  isReadOnly?: boolean;
  form: any;
  // eslint-disable-next-line no-unused-vars
  onFormLayoutChange?: ((changedValues: any, values: any) => void) | undefined;
}
const { TextArea } = Input;
const Index: React.FC<indexType> = ({
  initialValues,
  form,
  isReadOnly = false,
  onFormLayoutChange,
}) => {
  const [readOnly] = useState<boolean>(isReadOnly);
  // const onFormLayoutChange = ({ disabled }: { disabled: boolean }) => {
  //   // console.log('onFormLayoutChange', disabled);
  // };

  return (
    <>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        form={form}
        initialValues={initialValues}
        onValuesChange={onFormLayoutChange}
        autoComplete="off"
        disabled={readOnly}>
        <Form.Item
          label="上架平台"
          name="marketId"
          rules={[{ required: true, message: '请选择上架平台' }]}>
          <Select>
            <Select.Option value="demo">Demo</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="上架应用" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="应用类型" name="typeName">
          <Input />
        </Form.Item>
        <Form.Item label="应用权限" name="sellAuth">
          <Radio.Group>
            <Radio value="使用权"> 使用权 </Radio>
            <Radio value="所属权"> 所属权 </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="使用费用" name="price">
          <Input />
        </Form.Item>
        <Form.Item label="使用周期" name="days">
          <Input />
        </Form.Item>
        <Form.Item label="应用信息" name="information">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </>
  );
};

export default Index;
