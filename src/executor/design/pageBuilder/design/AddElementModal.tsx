import { useSignal } from '@/hooks/useSignal';
import { defineFC } from '@/utils/react/fc';
import { useSignalEffect } from '@preact/signals-react';
import { Form, Input, Modal, Select } from 'antd';
import React, { useContext, useEffect, useMemo } from 'react';
import { ElementMeta } from '../core/ElementMeta';
import { DesignContext, PageContext } from '../render/PageContext';

interface Props {
  visible: boolean;
  parentId: string;
  onVisibleChange: (v: boolean) => void;
  prop?: string;
}

export default defineFC({
  render(props: Props) {
    const ctx = useContext<DesignContext>(PageContext as any);

    const form = useSignal({
      kind: '',
      name: '',
    });
    const [formInst] = Form.useForm();
    const meta = useSignal<ElementMeta | null>(null);
    useSignalEffect(() => {
      if (form.value.kind) {
        meta.value = ctx.view.elements.elementMeta[form.value.kind] || {
          props: {},
          label: form.value.kind,
        };
      } else {
        meta.value = null;
      }
    });

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

    const modalVisible = useSignal(false);
    useEffect(() => {
      modalVisible.value = props.visible;
      if (props.visible) {
        form.value = {
          kind: '',
          name: '新元素',
        };
      }
    }, [props.visible]);
    function visibleChange(v: boolean) {
      modalVisible.value = v;
      props.onVisibleChange?.(v);
    }

    async function handleCreate() {
      const res = await formInst.validateFields();
      const { kind, name } = res;
      ctx.view.addElement(kind, name, props.prop, props.parentId);
      visibleChange(false);
    }

    return (
      <Modal
        title="新建元素"
        destroyOnClose={true}
        open={modalVisible.value}
        onCancel={() => visibleChange(false)}
        onOk={handleCreate}>
        <Form initialValues={form.value} form={formInst}>
          <Form.Item
            name="kind"
            label="类型"
            rules={[{ required: true, message: '请选择类型' }]}>
            <Select
              optionLabelProp="label"
              value={form.value.kind}
              onChange={(v) => (form.value.kind = v)}>
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
            <Input
              value={form.value.name}
              onChange={(v) => (form.value.name = v.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    );
  },
  defaultProps: {
    visible: false,
  },
});
