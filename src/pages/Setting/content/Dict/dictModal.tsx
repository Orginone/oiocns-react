import React, { useRef } from 'react';
import SchemaForm from '@/components/SchemaForm';
import { DictModel } from '@/ts/base/model';
import { XDict } from '@/ts/base/schema';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import { ISpace } from '@/ts/core';

interface Iprops {
  title: string;
  open: boolean;
  space: ISpace;
  data: XDict | undefined;
  handleCancel: () => void;
  handleOk: (success: boolean) => void;
}
/*
  特性编辑模态框
*/
const DictModal = (props: Iprops) => {
  const { title, open, data, handleCancel, handleOk } = props;
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
      layoutType="ModalForm"
      onOpenChange={(open: boolean) => {
        if (open) {
          if (data) {
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
      onFinish={async (values) => {
        if (title.includes('新增')) {
          handleOk((await props.space.dict.createDict(values)) !== undefined);
        } else {
          let formdata = Object.assign(data ? data : {}, values);
          handleOk((await props.space.dict.updateDict(formdata)) !== undefined);
        }
      }}
      columns={columns}
    />
  );
};

export default DictModal;
