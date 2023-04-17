import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictModel } from '@/ts/base/model';
import { XDict } from '@/ts/base/schema';

interface Iprops {
  open: boolean;
  data: XDict | undefined;
  handleCancel: () => void;
  handleOk: (dict: DictModel) => void;
}
/*
  特性编辑模态框
*/
const DictModal = (props: Iprops) => {
  const { open, data, handleCancel, handleOk } = props;
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<DictModel>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
    },
    {
      title: '字典名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '字典名称为必填项' }],
      },
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '字典代码为必填项' }],
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<DictModel>
      formRef={formRef}
      title={data ? '编辑字典' : '新增字典'}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (data) {
            formRef.current?.setFieldsValue(data);
          }
        } else {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={(values) => {
        handleOk(values);
      }}
      columns={columns}></SchemaForm>
  );
};

export default DictModal;
