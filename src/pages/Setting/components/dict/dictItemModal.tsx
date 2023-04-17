import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictItemModel } from '@/ts/base/model';
import { XDictItem } from '@/ts/base/schema';

interface Iprops {
  open: boolean;
  data?: XDictItem;
  handleCancel: () => void;
  handleOk: (item: DictItemModel) => void;
}
/*
  字典子项编辑模态框
*/
const DictItemModal = ({ open, handleOk, data, handleCancel }: Iprops) => {
  const formRef = useRef<ProFormInstance>();

  const columns: ProFormColumnsType<DictItemModel>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '字典项名称为必填项' }],
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      formItemProps: {
        rules: [{ required: true, message: '字典项值为必填项' }],
      },
    },
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    //   valueType: 'textarea',
    //   colProps: { span: 24 },
    // },
  ];

  return (
    <SchemaForm<DictItemModel>
      formRef={formRef}
      title={data ? '修改字典项' : '新增字典项'}
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
      onFinish={handleOk}
      columns={columns}></SchemaForm>
  );
};

export default DictItemModal;
