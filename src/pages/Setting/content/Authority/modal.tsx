import React, { useRef } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { IAuthority } from '@/ts/core/target/authority/iauthority';
import orgCtrl from '@/ts/controller';
import { targetsToTreeData } from '../..';

interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: (result: boolean) => void;
  current: IAuthority;
}
/*
  权限编辑模态框
*/
const AuthorityModal = (props: Iprops) => {
  const { open, title, handleOk, current, handleCancel } = props;
  const formValue = current.target;
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
      title: '选择制定组织',
      dataIndex: 'belongId',
      valueType: 'treeSelect',
      initialValue: current.space.id,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      request: async () => {
        const res = await orgCtrl.getTeamTree(current.space);
        return targetsToTreeData(res);
      },
      fieldProps: {
        disabled: title === '修改',
        showSearch: true,
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
      title={title}
      open={open}
      width={640}
      layoutType="ModalForm"
      rowProps={{
        gutter: [24, 0],
      }}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (title.includes('修改') || title.includes('编辑')) {
            formRef.current?.setFieldsValue(formValue);
          }
        } else {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      onFinish={async (values) => {
        if (title.includes('新增')) {
          handleOk(
            (
              await current?.createSubAuthority(
                values.name,
                values.code,
                values.public,
                values.remark,
              )
            ).success,
          );
        } else {
          handleOk(
            (
              await current?.updateAuthority(
                values.name,
                values.code,
                values.public,
                values.remark,
              )
            ).success,
          );
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default AuthorityModal;
