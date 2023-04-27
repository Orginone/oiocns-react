import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { SpeciesModel } from '@/ts/base/model';
import { ISpeciesItem } from '@/ts/core';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: ISpeciesItem | undefined) => void;
  current: ISpeciesItem;
}
/*
  分类编辑模态框
*/
const SpeciesModal = (props: Iprops) => {
  const { open, title, handleOk, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<SpeciesModel>[] = [
    {
      title: '分类名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '分类名称为必填项' }],
      },
    },
    {
      title: '分类代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '分类代码为必填项' }],
      },
    },
    {
      title: '选择制定组织',
      dataIndex: 'belongId',
      valueType: 'treeSelect',
      initialValue: current.team.id,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      request: async () => {
        return [
          {
            label: current.team.teamName,
            value: current.team.id,
          },
        ];
      },
      fieldProps: {
        // disabled: title === '修改' || title === '编辑',
        showSearch: true,
      },
    },
    {
      title: '选择管理权限',
      dataIndex: 'authId',
      valueType: 'treeSelect',
      formItemProps: { rules: [{ required: true, message: '管理权限为必填项' }] },
      request: async () => {
        const data = await current.team.space.loadSpaceAuthorityTree();
        return data ? [data] : [];
      },
      fieldProps: {
        // disabled: title === '修改',
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
      title: '分类定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '分类定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<SpeciesModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          // formRef.current?.setFieldValue('belongId', props.targetId);
          if (title.includes('修改')) {
            formRef.current?.setFieldsValue(current?.target);
          }
          formRef.current?.setFieldValue('belongId', current.team.id);
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
        if (title.includes('新增')) {
          handleOk(await current.create(values));
        } else {
          handleOk(await current.update(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default SpeciesModal;
