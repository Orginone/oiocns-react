import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { AuthorityModel } from '@/ts/base/model';
import { IAuthority } from '@/ts/core';
import UploadItem from '../tools/uploadItem';
import { EntityColumns } from './entityColumns';

interface Iprops {
  formType: string;
  current: IAuthority;
  finished: () => void;
}
/*
  编辑
*/
const SpeciesForm = (props: Iprops) => {
  let title = '';
  const readonly = props.formType === 'remarkAuthority';
  let initialValue: any = props.current.metadata;
  switch (props.formType) {
    case 'newAuthority':
      title = '新建权限';
      initialValue = {};
      break;
    case 'updateAuthority':
      title = '更新权限';
      break;
    case 'remarkAuthority':
      title = '查看权限';
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<AuthorityModel>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            readonly={readonly}
            typeName={'权限'}
            icon={initialValue.icon}
            onChanged={(icon) => {
              form.setFieldValue('icon', icon);
            }}
            directory={props.current.space.directory}
          />
        );
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '权限名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '权限代码为必填项' }],
      },
    },
    {
      title: '选择共享组织',
      dataIndex: 'shareId',
      valueType: 'select',
      readonly: readonly,
      initialValue: props.current.metadata.shareId,
      formItemProps: { rules: [{ required: true, message: '请选择共享组织' }] },
      fieldProps: {
        options: props.current.space.shareTarget.map((i) => {
          return {
            label: i.name,
            value: i.id,
          };
        }),
      },
    },
    {
      title: '是否公开',
      dataIndex: 'public',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            value: true,
            label: '公开',
          },
          {
            value: false,
            label: '不公开',
          },
        ],
      },
      formItemProps: {
        rules: [{ required: true, message: '是否公开为必填项' }],
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
    <SchemaForm<AuthorityModel>
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
          case 'updateAuthority':
            await props.current!.update(values);
            break;
          case 'newAuthority':
            await props.current.create(values);
            break;
        }
        props.finished();
      }}></SchemaForm>
  );
};

export default SpeciesForm;
