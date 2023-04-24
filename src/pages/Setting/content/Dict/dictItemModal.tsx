import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictItemModel } from '@/ts/base/model';
import { XDict, XDictItem } from '@/ts/base/schema';
import { ISpace } from '@/ts/core';

interface Iprops {
  open: boolean;
  data?: XDictItem;
  space: ISpace;
  handleCancel: () => void;
  handleOk: (newItem: boolean | undefined) => void;
  current: XDict;
}
/*
  字典子项编辑模态框
*/
const DictItemModal = ({
  open,
  handleOk,
  current,
  data,
  space,
  handleCancel,
}: Iprops) => {
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
      title={data ? '修改字典项' : '新增字典项'}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          formRef.current?.setFieldsValue(data);
        } else {
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
          handleOk(
            (await space.dict?.updateDictItem({ ...data, ...values })) != undefined,
          );
        } else {
          values.dictId = current.id;
          handleOk((await space.dict?.createDictItem(values)) != undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default DictItemModal;
