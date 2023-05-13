import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictItemModel } from '@/ts/base/model';
import { XDictItem } from '@/ts/base/schema';
import { IDict } from '@/ts/core';

interface Iprops {
  open: boolean;
  data?: XDictItem;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: IDict;
}
/*
  字典子项编辑模态框
*/
const DictItemModal = ({ open, handleOk, current, data, handleCancel }: Iprops) => {
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
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];

  return (
    <SchemaForm<DictItemModel>
      formRef={formRef}
      title={data ? `修改[${data.name}]字典项` : '新增字典项'}
      open={open}
      width={640}
      initialValues={data || {}}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (data) {
          values.id = data.id;
          handleOk(await current.updateItem(values));
        } else {
          handleOk((await current.createItem(values)) != undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default DictItemModal;
