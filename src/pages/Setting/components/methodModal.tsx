import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { MethodModel } from '@/ts/base/model';
import { ISpeciesItem, ITarget } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { XMethod } from '@/ts/base/schema';

interface Iprops {
  title: string;
  open: boolean;
  data: XMethod | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: ISpeciesItem;
  target?: ITarget;
}
/*
  业务标准编辑模态框
*/
const MethodModal = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const getFromColumns = () => {
    const columns: ProFormColumnsType<MethodModel>[] = [
      {
        title: '业务名称',
        dataIndex: 'name',
        formItemProps: {
          rules: [{ required: true, message: '特性名称为必填项' }],
        },
      },
      {
        title: '业务代码',
        dataIndex: 'code',
        formItemProps: {
          rules: [{ required: true, message: '特性代码为必填项' }],
        },
      },
      {
        title: '选择制定组织',
        dataIndex: 'belongId',
        valueType: 'treeSelect',
        formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
        request: async () => {
          return await userCtrl.getTeamTree();
        },
        fieldProps: {
          disabled: title === '修改',
          fieldNames: { label: 'teamName', value: 'id', children: 'subTeam' },
          showSearch: true,
          filterTreeNode: true,
          treeNodeFilterProp: 'teamName',
        },
      },
      {
        title: '选择管理职权',
        dataIndex: 'authId',
        valueType: 'treeSelect',
        formItemProps: { rules: [{ required: true, message: '管理职权为必填项' }] },
        request: async () => {
          const data = await userCtrl.company.loadAuthorityTree(false);
          return data ? [data] : [];
        },
        fieldProps: {
          disabled: title === '编辑',
          fieldNames: { label: 'name', value: 'id' },
          showSearch: true,
          filterTreeNode: true,
          treeNodeFilterProp: 'name',
          treeDefaultExpandAll: true,
        },
      },
      {
        title: '向下级组织公开',
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
        title: '业务分类',
        dataIndex: 'methodType',
        valueType: 'select',
        fieldProps: {
          options: [
            {
              value: '创建',
              label: '创建',
            },
            {
              value: '修改',
              label: '修改',
            },
            {
              value: '删除',
              label: '删除',
            },
          ],
        },
        formItemProps: {
          rules: [{ required: true, message: '业务分类为必填项' }],
        },
      },
      {
        title: '业务内容',
        dataIndex: 'content',
        valueType: 'textarea',
        colProps: { span: 24 },
        formItemProps: {
          rules: [{ required: true, message: '业务内容为必填项' }],
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
        valueType: 'textarea',
        colProps: { span: 24 },
        formItemProps: {
          rules: [{ required: true, message: '业务定义为必填项' }],
        },
      },
    ];
    return columns;
  };
  return (
    <SchemaForm<MethodModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
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
        values = { ...data, ...values };
        if (title.includes('新增')) {
          handleOk(await current.createMethod(values));
        } else {
          handleOk(await current.updateMethod(values));
        }
      }}
      columns={getFromColumns()}></SchemaForm>
  );
};

export default MethodModal;
