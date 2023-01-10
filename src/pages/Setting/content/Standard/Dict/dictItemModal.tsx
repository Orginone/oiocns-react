import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictItemModel } from '@/ts/base/model';
import { IDict } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { XDictItem } from '@/ts/base/schema';

interface Iprops {
  open: boolean;
  data?: XDictItem;
  handleCancel: () => void;
  handleOk: (newItem: boolean | undefined) => void;
  current?: IDict;
  targetId?: string;
}
/*
  分类编辑模态框
*/
const DictItemModal = (props: Iprops) => {
  const { open, handleOk, current, data, handleCancel } = props;
  let title: string = data ? '修改字典项' : '新增字典项目';
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<DictItemModel>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '字典项名称为必填项' }],
      },
    },
    {
      title: '值',
      dataIndex: 'value',
      formItemProps: {
        rules: [{ required: true, message: '字典项值为必填项' }],
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
    // {
    //   title: '选择管理职权',
    //   dataIndex: 'authId',
    //   valueType: 'treeSelect',
    //   formItemProps: { rules: [{ required: true, message: '管理职权为必填项' }] },
    //   request: async () => {
    //     const data = await userCtrl.space.loadAuthorityTree(false);
    //     return data ? [data] : [];
    //   },
    //   fieldProps: {
    //     disabled: title === '修改',
    //     fieldNames: { label: 'name', value: 'id' },
    //     showSearch: true,
    //     filterTreeNode: true,
    //     treeNodeFilterProp: 'name',
    //     treeDefaultExpandAll: true,
    //   },
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];
  return (
    <SchemaForm<DictItemModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          // formRef.current?.setFieldValue('belongId', props.targetId);
          if (title.includes('修改')) {
            formRef.current?.setFieldsValue(data);
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
        if (title.includes('新增')) {
          handleOk(await current?.createItem(values));
        } else {
          let formdata = Object.assign(data ? data : {}, values);
          handleOk(await current?.updateItem(formdata));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default DictItemModal;
