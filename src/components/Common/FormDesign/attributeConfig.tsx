import { Select, Form, Radio, InputNumber, Input, TreeSelect, Drawer } from 'antd';
import React, { useEffect } from 'react';
import { loadRegexpOpts, loadWidgetsOpts } from './rule';
import { XAttribute, XAuthority } from '@/ts/base/schema';

interface IProps {
  attr: XAttribute;
  superAuth: XAuthority;
  onChanged: (data: any) => void;
  onClose: () => void;
}

const AttributeConfig = ({ attr, onChanged, superAuth, onClose }: IProps) => {
  const [form] = Form.useForm();
  useEffect(() => {
    const rule = JSON.parse(attr.rule || '{}');
    form.setFieldsValue({ ...attr, ...rule });
  }, [attr]);
  return (
    <Drawer title="特性配置" open={true} onClose={onClose}>
      <Form form={form} onValuesChange={onChanged}>
        <Form.Item label="标题" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="组件" name="widget">
          <Select options={loadWidgetsOpts(attr?.property!.valueType)} />
        </Form.Item>
        <Form.Item label="编号" name="code">
          <Input />
        </Form.Item>
        <Form.Item label="必填" name="required">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>是</Radio.Button>
            <Radio.Button value={false}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="只读" name="readOnly">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>是</Radio.Button>
            <Radio.Button value={false}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="隐藏" name="hidden">
          <Radio.Group buttonStyle="solid">
            <Radio.Button value={true}>是</Radio.Button>
            <Radio.Button value={false}>否</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="最小值" name="min">
          <InputNumber />
        </Form.Item>
        <Form.Item label="最大值" name="max">
          <InputNumber />
        </Form.Item>
        <Form.Item label="输入提示" name="placeholder">
          <Input />
        </Form.Item>
        <Form.Item label="管理权限" name="authId">
          <TreeSelect
            treeData={[superAuth]}
            fieldNames={{
              label: 'name',
              value: 'id',
              children: 'nodes',
            }}
          />
        </Form.Item>
        <Form.Item label="特性定义" name="remark">
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="正则校验" name="rules" tooltip="示例：^[A-Za-z0-9]+$">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="请输入或者选择正则表达式"
            options={loadRegexpOpts(attr.property?.valueType)}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AttributeConfig;
