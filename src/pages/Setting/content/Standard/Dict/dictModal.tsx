import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictModel } from '@/ts/base/model';
import { Dict, IDict } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (newItem: IDict | undefined) => void;
  current?: IDict;
  speciesItem?: ISpeciesItem;
  targetId?: string;
}
/*
  分类编辑模态框
*/
const DictModal = (props: Iprops) => {
  const { open, title, handleOk, current, speciesItem, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<DictModel>[] = [
    {
      title: '字典名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '字典名称为必填项' }],
      },
    },
    {
      title: '字典代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '字典代码为必填项' }],
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
        disabled: title === '编辑',
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
        const data = await userCtrl.space.loadAuthorityTree(false);
        return data ? [data] : [];
      },
      fieldProps: {
        disabled: title === '修改',
        fieldNames: { label: 'name', value: 'id' },
        showSearch: true,
        filterTreeNode: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
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
    <SchemaForm<DictModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          formRef.current?.setFieldValue('belongId', props.targetId);
          if (title.includes('修改')) {
            formRef.current?.setFieldsValue(current?.target);
          }
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
        console.log(values);
        if (title.includes('新增')) {
          handleOk(await speciesItem?.createDict(values));
        } else {
          handleOk(await current?.update(values));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default DictModal;
