import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { schema } from '@/ts/base';
import { ISpecies } from '@/ts/core';
import { SpeciesItemModel } from '@/ts/base/model';
import UploadItem from '../../../tools/uploadItem';

interface Iprops {
  open: boolean;
  typeName: string;
  operateType: string;
  data?: schema.XSpeciesItem;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: ISpecies;
}
/*
  字典子项编辑模态框
*/
const SpeciesItemModal = ({
  open,
  typeName,
  operateType,
  handleOk,
  current,
  data,
  handleCancel,
}: Iprops) => {
  const title =
    operateType == '新增' ? `新增${typeName}项` : `编辑[${data?.name}]${typeName}项`;
  const formRef = useRef<ProFormInstance>();

  const columns: ProFormColumnsType<SpeciesItemModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={typeName}
            icon={data?.icon || ''}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={current.directory}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: typeName + '项名称为必填项' }],
      },
    },
    {
      title: '附加信息',
      dataIndex: 'info',
      formItemProps: {
        rules: [{ required: true, message: typeName + '项附加信息为必填项' }],
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
    <SchemaForm<SpeciesItemModel>
      formRef={formRef}
      title={title}
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
        if (operateType == '编辑') {
          values.id = data!.id;
          handleOk(await current.updateItem(values));
        } else {
          if (data) {
            values.parentId = data.id;
          }
          handleOk((await current.createItem(values)) != undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default SpeciesItemModal;
