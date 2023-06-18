import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IAuthority } from '@/ts/core';
import UploadItem from '../../../tools/uploadItem';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (result: boolean) => void;
  current: IAuthority;
}
/*
  权限编辑模态框
*/
const createAuthority = (props: Iprops) => {
  if (!props.open) return <></>;
  const columns: ProFormColumnsType<any>[] = [
    {
      title: '图标',
      dataIndex: 'icon',
      colProps: { span: 24 },
      renderFormItem: (_, __, form) => {
        return (
          <UploadItem
            typeName={'权限'}
            icon={props.current.metadata.icon}
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
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '选择共享组织',
      dataIndex: 'shareId',
      valueType: 'select',
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
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '备注' }],
      },
    },
  ];
  return (
    <SchemaForm
      title={
        props.title.includes('编辑') ? `编辑[${props.current.name}]权限` : '新增权限'
      }
      open={props.open}
      width={640}
      layoutType="ModalForm"
      rowProps={{
        gutter: [24, 0],
      }}
      initialValues={props.title.includes('编辑') ? props.current.metadata : {}}
      onOpenChange={(open: boolean) => {
        if (!open) {
          props.handleCancel();
        }
      }}
      onFinish={async (values) => {
        if (props.title.includes('新增')) {
          props.handleOk((await props.current.create(values)) != undefined);
        } else {
          props.handleOk(await props.current.update(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default createAuthority;
