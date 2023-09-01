import React, { useState } from 'react';
import { Col, Form, Input, InputNumber, Radio, Row, Select, Slider } from 'antd';
import { IForm } from '@/ts/core';
import { debounce } from '@/utils/tools';

interface FormSettingType {
  current: IForm;
  OnFormChange: (changeVal: { [key: string]: any }) => void;
  comp: any;
}
/* 表单配置文件 */
const FormSetting: React.FC<FormSettingType> = ({ comp, OnFormChange }) => {
  const [form] = Form.useForm();

  const [inputValue, setInputValue] = useState(120);

  const onChange: any = (newValue: number) => {
    setInputValue(newValue);
    onValuesChange({ labelWidth: newValue });
  };
  const onValuesChange = debounce((changeVal: any) => {
    console.log('表单变化', changeVal);
    OnFormChange(changeVal);
  }, 500);
  return (
    <>
      <Form
        title="特性配置"
        form={form}
        layout={'vertical'}
        initialValues={{ column: 1, displayType: 'row', labelWidth: 120 }}
        onValuesChange={onValuesChange}>
        {/* <Form.Item label="标题" name="name">
          <Input />
        </Form.Item> */}
        <Form.Item label="整体布局" name="column">
          <Select
            style={{ width: '100%' }}
            placeholder="请输入布局"
            defaultValue={1}
            options={[
              { label: '一行一列', value: 1 },
              { label: '一行两列', value: 2 },
              { label: '一行三列', value: 3 },
            ]}
          />
        </Form.Item>
        <Form.Item label="标签展示模式" name="displayType">
          <Radio.Group>
            <Radio value={'row'}>同行</Radio>
            <Radio value={'column'}>单独一行</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="标签宽度" name="labelWidth">
          <Row>
            <Col span={12}>
              <Slider
                min={80}
                max={260}
                onChange={onChange}
                value={typeof inputValue === 'number' ? inputValue : 0}
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={80}
                max={260}
                style={{ margin: '0 16px' }}
                value={inputValue}
                onChange={onChange}
              />
            </Col>
          </Row>
        </Form.Item>
        {comp}
      </Form>
    </>
  );
};

export default React.memo(FormSetting);
