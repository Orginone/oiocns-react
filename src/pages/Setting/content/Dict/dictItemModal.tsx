import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { DictItemModel } from '@/ts/base/model';
import { XDict, XDictItem } from '@/ts/base/schema';
import { message } from 'antd';
import thingCtrl from '@/ts/controller/thing';

interface Iprops {
  open: boolean;
  data?: XDictItem;
  handleCancel: () => void;
  handleOk: (newItem: boolean | undefined) => void;
  current: XDict;
}
/*
  字典子项编辑模态框
*/
const DictItemModal = (props: Iprops) => {
  const { open, handleOk, current, data, handleCancel } = props;
  if (!current) {
    message.warn('请先选择代码字典');
  }

  let title: string = data ? '修改字典项' : '新增字典项';
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
          values.dictId = current.id;
          handleOk((await thingCtrl.dict?.createDictItem(values)) != undefined);
        } else {
          let formdata = Object.assign(data ? data : {}, values);
          handleOk((await thingCtrl.dict?.updateDictItem(formdata)) != undefined);
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default DictItemModal;
