import {
  ProForm,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import { useForm } from 'antd/es/form/Form';
import React from 'react';
import { XWorkDefine } from '@/ts/base/schema';
import { IWorkItem, SpeciesType } from '@/ts/core';

interface Iprops {
  open: boolean;
  title: string;
  current?: XWorkDefine;
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
      ...current,
      operationIds: current?.sourceIds?.split(',').filter((id: any) => id != '') || [],
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
        value.sourceIds = value.isCreate ? '' : value.operationIds?.join(',');
        if (current) {
          value.id = current.id;
          await item.updateWorkDefine(value);
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
        <ProFormSelect
          width="md"
          name="isCreate"
          label="是否创建实体"
          placeholder="请选择是否创建实体"
          required={true}
          colProps={{ span: 12 }}
          initialValue={current?.isCreate}
          request={async () => {
            let array: any[] = [
              {
                value: true,
                label: '是',
              },
              {
                value: false,
                label: '否',
              },
            ];
            return array;
          }}
          fieldProps={{
            showSearch: true,
            allowClear: true,
          }}
        />
        <ProFormDependency name={['isCreate']}>
          {({ isCreate }) => {
            if (!isCreate)
              return (
                <ProFormTreeSelect
                  width="md"
                  name="operationIds"
                  label="操作实体"
                  placeholder="请选择操作实体"
                  required={true}
                  colProps={{ span: 12 }}
                  request={async () => {
                    let tree = (await item.current.loadSpecies()).filter(
                      (i) => i.metadata.typeName === SpeciesType.Store,
                    );
                    return tree.map((a) => a.metadata);
                  }}
                  fieldProps={{
                    fieldNames: { label: 'name', value: 'id', children: 'nodes' },
                    showSearch: true,
                    multiple: true,
                    allowClear: true,
                  }}
                />
              );
            return null;
          }}
        </ProFormDependency>
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
