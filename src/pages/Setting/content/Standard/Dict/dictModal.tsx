import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictModel } from '@/ts/base/model';
import { IDict } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core/thing/ispecies';
import { XDict } from '@/ts/base/schema';
import { targetsToTreeData } from '@/pages/Setting';

interface Iprops {
  open: boolean;
  data: XDict | undefined;
  handleCancel: () => void;
  handleOk: (newItem: IDict | boolean | undefined) => void;
  current?: ISpeciesItem;
  targetId?: string;
}
/*
  字典编辑模态框
*/
const DictModal = (props: Iprops) => {
  const { open, handleOk, current, data, handleCancel } = props;
  let title: string = data ? '修改' : '新增';
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<DictModel>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInForm: true,
    },
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
      initialValue: userCtrl.space.id,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      request: async () => {
        const res = await userCtrl.getTeamTree();
        return targetsToTreeData(res);
      },
      fieldProps: {
        disabled: title === '编辑' || title === '修改',
        showSearch: true,
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
    // {
    //   title: '选择管理权限',
    //   dataIndex: 'authId',
    //   valueType: 'treeSelect',
    //   formItemProps: { rules: [{ required: true, message: '管理权限为必填项' }] },
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
    <SchemaForm<DictModel>
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
          handleOk(await current?.createDict(values));
        } else {
          let formdata = Object.assign(data ? data : {}, values);
          handleOk(await current?.updateDict(formdata));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default DictModal;
