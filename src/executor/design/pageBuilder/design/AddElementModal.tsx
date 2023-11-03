import { defineFC } from '@/utils/react/fc';
import { Form, Input, Modal, Select } from 'antd';
import React, { useContext, useMemo } from 'react';
import { DesignContext, PageContext } from '../render/PageContext';

interface Props {
  parentId: string;
  onFinished: () => void;
  prop?: string;
}

export default defineFC({
  render(props: Props) {
    const ctx = useContext<DesignContext>(PageContext as any);

    const [form] = Form.useForm();

    const elementTypes = useMemo(() => {
      const ret: { label: string; value: string }[] = [];
      for (const [name, meta] of Object.entries(ctx.view.elements.elementMeta)) {
        if (name != 'Root') {
          ret.push({
            value: name,
            label: meta?.label,
          });
        }
      }
      return ret;
    }, []);

    async function handleCreate() {
      const res = await form.validateFields();
      const { kind, name } = res;
      ctx.view.addElement(kind, name, props.prop, props.parentId);
      props.onFinished();
    }

    return (
      <Modal
        title="新建元素"
        destroyOnClose={true}
        open
        onCancel={() => props.onFinished()}
        onOk={handleCreate}>
        <Form form={form}>
          <Form.Item
            name="kind"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}>
            <Select
              optionLabelProp="label"
              onChange={(v) => {
                for (const item of elementTypes) {
                  if (item.value == v) {
                    form.setFieldValue('name', item.label);
                  }
                }
              }}>
              {elementTypes.map((o) => {
                return (
                  <Select.Option key={o.value} value={o.value} label={o.label}>
                    <div style={{ display: 'flex' }}>
                      <span>{o.value}</span>
                      <span style={{ flex: 'auto' }}></span>
                      <span>{o.label}</span>
                    </div>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: '请输入名称' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
  defaultProps: {},
});
