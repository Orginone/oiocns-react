import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { AttributeModel } from '@/ts/base/model';
import { XAttribute } from '@/ts/base/schema';
import { IForm } from '@/ts/core';

interface Iprops {
  open: boolean;
  current?: XAttribute;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  form: IForm;
}
/*
  特性编辑模态框
*/
const AttributeModal = (props: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const { open, handleOk, current, form, handleCancel } = props;
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
        return (await props.form.loadPropertys()).map((item) => {
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
        const data = await props.form.species.current.space.loadSuperAuth();
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
      title={current ? `编辑[${current.name}]特性` : '新增特性'}
      open={open}
      width={640}
      layoutType="ModalForm"
      columns={columns}
      rowProps={{
        gutter: [24, 0],
      }}
      initialValues={current || {}}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      onFinish={async (values) => {
        if (current) {
          values = { ...current, ...values };
          handleOk(await form.updateAttribute(values));
        } else {
          const property = (await props.form.loadPropertys()).find(
            (i) => i.id === values.propId,
          );
          if (property) {
            await form.createAttribute(values, property);
          }
          handleOk(true);
        }
      }}
    />
  );
};

export default AttributeModal;
