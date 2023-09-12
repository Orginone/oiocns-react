import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IDirectory } from '@/ts/core';
import UploadItem from '../../tools/uploadItem';
import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';

interface Iprops {
  formType: string;
  current: IDirectory;
  finished: () => void;
}
/*
  编辑
*/
const DirectoryForm = (props: Iprops) => {
  let title = '';
  const readonly = props.formType === 'remarkDir';
  let initialValue: any = props.current.metadata;
  switch (props.formType) {
    case 'newDir':
      title = '新建目录';
      initialValue = { shareId: props.current.target.id };
      break;
    case 'updateDir':
      title = '更新目录';
      break;
    case 'remarkDir':
      title = '查看目录';
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<schema.XDirectory>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            readonly={readonly}
            typeName={props.current.typeName}
            icon={initialValue.icon}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={props.current}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
    },
    {
      title: '制定组织',
      dataIndex: 'shareId',
      valueType: 'select',
      hideInForm: true,
      readonly: readonly,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      fieldProps: {
        options: [
          {
            value: props.current.target.id,
            label: props.current.target.name,
          },
        ],
      },
    },
  ];
  if (readonly) {
    columns.push(...EntityColumns(props.current.metadata));
  }
  columns.push({
    title: '备注信息',
    dataIndex: 'remark',
    valueType: 'textarea',
    colProps: { span: 24 },
    readonly: readonly,
    formItemProps: {
      rules: [{ required: true, message: '备注信息为必填项' }],
    },
  });
  return (
    <SchemaForm<schema.XDirectory>
      open
      title={title}
      width={640}
      columns={columns}
      initialValues={initialValue}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          props.finished();
        }
      }}
      onFinish={async (values) => {
        switch (props.formType) {
          case 'updateDir':
            await props.current.update(values);
            break;
          case 'newDir':
            await props.current.create(values);
            break;
        }
        props.finished();
      }}></SchemaForm>
  );
};

export default DirectoryForm;
