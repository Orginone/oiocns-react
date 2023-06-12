import { XForm } from '@/ts/base/schema';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useRef } from 'react';
import SchemaForm from '@/components/SchemaForm';
import { IForm, IWorkClass, IThingClass } from '@/ts/core';

interface Iprops {
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  current?: IForm;
  species?: IWorkClass | IThingClass;
}
/**
 * 默认备注：表单默认布局
 */
export const defaultRemark: any = {
  type: 'object',
  properties: {},
  labelWidth: 120,
  layout: 'horizontal',
  col: 12,
};

/*
  业务标准编辑模态框
*/
const Modal = ({ open, handleOk, species, current, handleCancel }: Iprops) => {
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<XForm>[] = [
    {
      title: '表单名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '请输入表单名称' }],
      },
    },
    {
      title: '表单代码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '请输入表单代码' }],
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
        rules: [{ required: true, message: '请选择是否对下级组织公开' }],
      },
    },
    {
      title: '表单定义',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '表单定义为必填项' }],
      },
    },
  ];
  return (
    <SchemaForm<XForm>
      formRef={formRef}
      layoutType="ModalForm"
      width={640}
      title={current ? `修改[${current.name}]表单` : '新增表单'}
      open={open}
      rowProps={{
        gutter: [24, 0],
      }}
      columns={columns}
      initialValues={current?.metadata || {}}
      onOpenChange={(open: boolean) => {
        if (!open) {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      onFinish={async (values: XForm) => {
        let success = false;
        if (current) {
          success = await current.update({ ...current.metadata, ...values });
        } else if (species) {
          success = (await species.createForm(values)) != undefined;
        }
        if (success) {
          formRef.current?.resetFields();
          handleOk();
        }
      }}
    />
  );
};

export default Modal;
