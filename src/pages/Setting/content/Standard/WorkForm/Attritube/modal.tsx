import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { AttributeModel } from '@/ts/base/model';
import { XAttribute } from '@/ts/base/schema';
import { IForm } from '@/ts/core';

interface Iprops {
  title: string;
  open: boolean;
  data: XAttribute | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: IForm;
}
/*
  特性编辑模态框
*/
const AttributeModal = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<AttributeModel>[] = [
    {
      title: '特性名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '特性名称为必填项' }],
      },
    },
    {
      title: '特性代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '特性代码为必填项' }],
      },
    },
    {
      title: '选择属性',
      dataIndex: 'propId',
      valueType: 'select',
      formItemProps: { rules: [{ required: true, message: '属性为必填项' }] },
      request: async () => {
        return (await props.current.loadPropertys()).map((item) => {
          return { label: item.name, value: item.id };
        });
      },
    },
    {
      title: '选择管理权限',
      dataIndex: 'authId',
      valueType: 'treeSelect',
      formItemProps: { rules: [{ required: true, message: '管理权限为必填项' }] },
      request: async () => {
        const data = await props.current.current.space.loadSuperAuth();
        return data ? [data.metadata] : [];
      },
      fieldProps: {
        fieldNames: { label: 'name', value: 'id', children: 'nodes' },
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
      title: '特性定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '特性定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<AttributeModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      layoutType="ModalForm"
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (title.includes('修改')) {
            formRef.current?.setFieldsValue(data);
          }
        } else {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      onFinish={async (values) => {
        values = { ...data, ...values };
        if (title.includes('新增')) {
          handleOk((await current.createAttribute(values)) != undefined);
        } else {
          console.log(values);
          handleOk(await current.updateAttribute(values));
        }
      }}
    />
  );
};

export default AttributeModal;
