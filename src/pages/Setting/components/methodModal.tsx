import React, { useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { AttributeModel } from '@/ts/base/model';
import { ISpeciesItem, ITarget } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { XAttribute } from '@/ts/base/schema';

interface Iprops {
  title: string;
  open: boolean;
  data: XAttribute | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
  current: ISpeciesItem;
  target?: ITarget;
}
/*
  业务标准编辑模态框
*/
const MethodModal = (props: Iprops) => {
  const [selectType, setSelectType] = useState<string>();
  const { open, title, handleOk, data, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const getFromColumns = () => {
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
        title: '特性类型',
        dataIndex: 'valueType',
        valueType: 'select',
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
          ],
          onSelect: (select: string) => {
            setSelectType(select);
          },
        },
        formItemProps: {
          rules: [{ required: true, message: '是否公开为必填项' }],
        },
      },
    ];
    if (selectType === '选择型') {
      columns.push({
        title: '选择枚举分类',
        dataIndex: 'dictId',
        valueType: 'treeSelect',
        formItemProps: { rules: [{ required: true, message: '枚举分类为必填项' }] },
        request: async () => {
          const data = await props.target?.loadSpeciesTree();
          return data ? [data] : [];
        },
        fieldProps: {
          disabled: selectType !== '选择型',
          fieldNames: { label: 'name', value: 'id', children: 'children' },
          showSearch: true,
          filterTreeNode: true,
          treeNodeFilterProp: 'name',
          treeDefaultExpandAll: true,
        },
      });
    }
    columns.push({
      title: '特性定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '特性定义为必填项' }],
      },
    });
    return columns;
  };
  return (
    <SchemaForm<AttributeModel>
      formRef={formRef}
      title={title}
      open={open}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          formRef.current?.setFieldValue('belongId', props.target?.id);
          if (title.includes('修改')) {
            setSelectType(data?.valueType);
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
        values = { ...data, ...values };
        if (title.includes('新增')) {
          handleOk(await current.createAttr(values));
        } else {
          handleOk(await current.updateAttr(values));
        }
      }}
      columns={getFromColumns()}></SchemaForm>
  );
};

export default MethodModal;
