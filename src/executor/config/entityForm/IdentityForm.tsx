import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IdentityModel } from '@/ts/base/model';
import { IIdentity, ITarget } from '@/ts/core';
import { EntityColumns } from './entityColumns';

interface Iprops {
  target: ITarget;
  formType: string;
  identity?: IIdentity;
  finished: () => void;
}
/*
  编辑
*/
const IdentityForm = (props: Iprops) => {
  let title = '';
  const readonly = props.formType === 'remarkIdentity';
  let initialValue: any = props.identity?.metadata || {};
  switch (props.formType) {
    case 'newIdentity':
      title = '新建角色';
      initialValue = {};
      break;
    case 'updateIdentity':
      title = '更新角色';
      break;
    case 'remarkIdentity':
      title = '查看角色';
      break;
    default:
      return <></>;
  }
  const columns: ProFormColumnsType<IdentityModel>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '角色名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      readonly: readonly,
      formItemProps: {
        rules: [{ required: true, message: '角色代码为必填项' }],
      },
    },
    {
      title: '设置权限',
      dataIndex: 'authId',
      colProps: { span: 24 },
      valueType: 'treeSelect',
      readonly: readonly,
      formItemProps: { rules: [{ required: true, message: '设置权限为必填项' }] },
      request: async () => {
        const data = await props.target.space.loadSuperAuth(false);
        return data ? [data.metadata] : [];
      },
      fieldProps: {
        disabled: title === '编辑',
        fieldNames: { label: 'name', value: 'id', children: 'nodes' },
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
    },
  ];
  if (readonly) {
    columns.push(...EntityColumns(props.identity!.metadata));
  }
  columns.push({
    title: '角色简介',
    dataIndex: 'remark',
    valueType: 'textarea',
    colProps: { span: 24 },
    readonly: readonly,
    formItemProps: {
      rules: [{ required: true, message: '角色简介为必填项' }],
    },
  });
  return (
    <SchemaForm<IdentityModel>
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
          case 'updateIdentity':
            await props.identity!.update(values);
            break;
          case 'newIdentity':
            await props.target.createIdentity(values);
            break;
        }
        props.finished();
      }}></SchemaForm>
  );
};

export default IdentityForm;
