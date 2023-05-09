import { ProForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { IFlowDefine, IWorkItem } from '@/ts/core';

interface Iprops {
  open: boolean;
  title: string;
  current?: IFlowDefine;
  item: IWorkItem;
  handleOk: () => void;
  handleCancel: () => void;
}

/*
  业务标准编辑模态框
*/
const DefineModal = ({ open, title, handleOk, handleCancel, item, current }: Iprops) => {
  const [form] = useForm<any>();
  if (current) {
    form.setFieldsValue({
      ...current.metadata,
    });
  } else {
    form.setFieldsValue({});
  }

  return (
    <Modal
      title={title}
      open={open}
      onOk={async () => {
        const value = {
          ...current,
          ...form.getFieldsValue(),
        };
        if (current) {
          value.id = current.metadata.id;
          await current.updateDefine(value);
        } else {
          await item.createWorkDefine(value);
        }
        handleOk();
      }}
      onCancel={() => {
        form.resetFields();
        handleCancel();
      }}
      destroyOnClose={true}
      cancelText={'关闭'}
      width={700}>
      <ProForm<any>
        layout="vertical"
        grid={true}
        form={form}
        rowProps={{
          gutter: [12, 0],
        }}
        submitter={{
          searchConfig: {
            resetText: '重置',
            submitText: '提交',
          },
          resetButtonProps: {
            style: { display: 'none' },
          },
          submitButtonProps: {
            style: { display: 'none' },
          },
        }}>
        <ProFormText
          width="md"
          name="name"
          label="办事名称"
          placeholder="请输入办事名称"
          required={true}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: '办事名称为必填项' }]}
        />
        <ProFormText
          width="md"
          name="code"
          label="办事标识"
          placeholder="请输入办事标识"
          required={true}
          colProps={{ span: 12 }}
          rules={[{ required: true, message: '办事标识为必填项' }]}
        />
        <ProFormTextArea
          width="md"
          name="remark"
          label="备注"
          placeholder="请输入备注信息"
          required={false}
          colProps={{ span: 24 }}
        />
      </ProForm>
    </Modal>
  );
};

export default DefineModal;
