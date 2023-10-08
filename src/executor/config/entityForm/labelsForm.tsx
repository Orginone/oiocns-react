import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IDirectory, IForm } from '@/ts/core';
import UploadItem from '../../tools/uploadItem';
import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';

interface Iprops {
  formType: string;
  typeName: string;
  current: IDirectory | IForm;
  finished: () => void;
}
/*
  编辑
*/
const LabelsForm = (props: Iprops) => {
  let title = '';
  let directory: IDirectory;
  let form: IForm | undefined;
  const readonly = props.formType === 'remark';
  let initialValue: any = props.current.metadata;
  switch (props.formType) {
    case 'new':
      title = '新建' + props.typeName;
      initialValue = {};
      directory = props.current as IDirectory;
      break;
    case 'update':
      form = props.current as IForm;
      directory = form.directory;
      title = '更新' + props.typeName;
      break;
    case 'remark':
      form = props.current as IForm;
      directory = form.directory;
      title = '查看' + props.typeName;
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<schema.XForm>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            readonly={readonly}
            typeName={props.typeName}
            icon={initialValue.icon}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={directory}
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
      title: '类型',
      dataIndex: 'typeName',
      valueType: 'select',
      initialValue: '实体配置',
      readonly: readonly,
      fieldProps: {
        options: ['实体配置', '事项配置', '报表'].map((i) => {
          return {
            value: i,
            label: i,
          };
        }),
      },
      formItemProps: {
        rules: [{ required: true, message: '类型为必填项' }],
      },
    },
  ];
  if (readonly) {
    columns.push(...EntityColumns(props.current!.metadata));
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
    <SchemaForm<schema.XForm>
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
        console.log(values, 'values');
        switch (props.formType) {
          case 'update':
            await form!.update(values);
            break;
          case 'new':
            await directory.standard.createForm(values);
            break;
        }
        props.finished();
      }}></SchemaForm>
  );
};

export default LabelsForm;
