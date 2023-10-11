import React from 'react';
import { ProFormColumnsType } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IdentityModel } from '@/ts/base/model';
import { IIdentity, ITarget } from '@/ts/core';

interface IProps {
  current: ITarget | IIdentity;
  finished: (success: boolean) => void;
}
/*
  编辑
*/
const IdentityForm: React.FC<IProps> = ({ current, finished }) => {
  const isEdit = 'current' in current;
  const columns: ProFormColumnsType<IdentityModel>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '角色名称为必填项' }],
      },
    },
    {
      title: '代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '角色代码为必填项' }],
      },
    },
    {
      title: '设置权限',
      dataIndex: 'authId',
      colProps: { span: 24 },
      valueType: 'treeSelect',
      formItemProps: { rules: [{ required: true, message: '设置权限为必填项' }] },
      request: async () => {
        const superAuth = await (isEdit
          ? current.current.space
          : current.space
        ).loadSuperAuth();
        return superAuth ? [superAuth] : [];
      },
      fieldProps: {
        disabled: isEdit,
        fieldNames: {
          label: 'name',
          value: 'id',
          children: 'children',
        },
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
    },
    {
      title: '角色简介',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '角色简介为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<IdentityModel>
      open
      title={isEdit ? '编辑角色' : '新建角色'}
      width={640}
      columns={columns}
      initialValues={isEdit ? current.metadata : {}}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (!open) {
          finished(false);
        }
      }}
      onFinish={async (values) => {
        if (isEdit) {
          await current.update(values);
        } else {
          await current.createIdentity(values);
        }
        finished(true);
      }}></SchemaForm>
  );
};

export default IdentityForm;
