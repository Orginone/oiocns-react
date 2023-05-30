import React, { useEffect, useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { AttributeModel } from '@/ts/base/model';
import { XAttribute } from '@/ts/base/schema';
import { IDict, IForm, SpeciesType } from '@/ts/core';

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
  const [dicts, setDicts] = useState<IDict[]>([]);
  const [selectType, setSelectType] = useState<string>();
  useEffect(() => {
    form.species.current.space.loadDicts().then((value) => {
      setDicts([...value]);
    });
  }, [selectType]);
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
      hideInForm: form.typeName === SpeciesType.Work,
      valueType: 'treeSelect',
      request: async () => {
        return [];
      },
    },
    {
      title: '特性类型',
      dataIndex: 'valueType',
      valueType: 'select',
      hideInForm: form.typeName !== SpeciesType.Work,
      fieldProps: {
        options: [
          {
            value: '数值型',
            label: '数值型',
          },
          {
            value: '描述型',
            label: '描述型',
          },
          {
            value: '选择型',
            label: '选择型',
          },
          {
            value: '分类型',
            label: '分类型',
          },
          {
            value: '附件型',
            label: '附件型',
          },
          {
            value: '日期型',
            label: '日期型',
          },
          {
            value: '时间型',
            label: '时间型',
          },
          {
            value: '用户型',
            label: '用户型',
          },
        ],
        onSelect: (select: string) => {
          setSelectType(select);
        },
      },
      formItemProps: {
        rules: [{ required: true, message: '特性类型为必填项' }],
      },
    },
    {
      title: '选择枚举字典',
      dataIndex: 'dictId',
      valueType: 'select',
      hideInForm: selectType !== '选择型',
      formItemProps: { rules: [{ required: true, message: '枚举分类为必填项' }] },
      fieldProps: {
        disabled: selectType !== '选择型',
        showSearch: true,
        options: dicts.map((i) => {
          return {
            value: i.id,
            label: i.name,
          };
        }),
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
          await form.createAttribute(values);
          handleOk(true);
        }
      }}
    />
  );
};

export default AttributeModal;
