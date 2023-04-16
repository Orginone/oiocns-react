import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import userCtrl from '@/ts/controller/setting';
import { targetsToTreeData } from '../..';
import { AuthorityModel } from '@/ts/base/model';

interface Iprops {
  openType: string;
  handleCancel: () => void;
  handleOk: (result: AuthorityModel) => void;
  current: IAuthority;
}
/*
  权限编辑模态框
*/
const AuthorityModal = (props: Iprops) => {
  const { openType, handleOk, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '编码',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '是否公开',
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
      title: '备注',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
      formItemProps: {
        rules: [{ required: true, message: '备注' }],
      },
    },
  ];
  return (
    <SchemaForm
      formRef={formRef}
      title={openType == 'edit' ? '修改权限' : '新建权限'}
      open={openType != ''}
      width={640}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (openType == 'edit' && current) {
            formRef.current?.setFieldsValue(current.target);
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
      onFinish={handleOk}
      columns={columns}></SchemaForm>
  );
};

export default AuthorityModal;
