import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IDirectory } from '@/ts/core';
import UploadItem from '../../tools/uploadItem';
import { EntityColumns } from './entityColumns';
import { schema } from '@/ts/base';
import orgCtrl from '@/ts/controller';

interface Iprops {
  formType: string;
  target: { metadata: any; [key: string]: any };
  //   current: ICompany;
  finished: (args: any) => void;
}
/*
  编辑
*/
const HomeSettingForm = (props: Iprops) => {
  let title = '';
  //临时文件夹
  let directory: IDirectory = orgCtrl.user.directory.children.find(
    (directory) => directory.id === '510763133825064961',
  )!;

  const typeName = '首页配置';
  const readonly = props.formType === 'remark';
  let initialValue: any = {
    ...props.target.metadata,
    name: props.target.name,
    tag: props.target.tag,
    sort: props.target.sort,
  };
  switch (props.formType) {
    case 'new':
      title = '新建' + typeName;
      initialValue = {};
      break;
    case 'update':
      title = '更新' + typeName;
      break;
    case 'remark':
      title = '查看' + typeName;
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
            typeName={typeName}
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
      title: '标记名称',
      dataIndex: 'tag',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '标记名称为必填项' }],
      },
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      valueType: 'select',
      initialValue: '表单',
      readonly: true,
      fieldProps: {
        options: ['表单'].map((i) => {
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
    {
      title: '排序',
      dataIndex: 'sort',
      readonly: readonly,
    },
  ];
  if (readonly) {
    columns.push(...EntityColumns(props.target!.metadata));
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
          props.finished(undefined);
        }
      }}
      onFinish={(values) => {
        console.log('props.target!.metadata', values);
        props.finished(values);
      }}></SchemaForm>
  );
};

export default HomeSettingForm;
