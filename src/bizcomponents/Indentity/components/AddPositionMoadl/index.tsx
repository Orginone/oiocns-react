import React, { useRef } from 'react';
import { message } from 'antd';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import {
  IDepartment,
  IPerson,
  IGroup,
  ICompany,
  ICohort,
} from '@/ts/core/target/itarget';
import SchemaForm from '@/components/SchemaForm';
import { XIdentity } from '@/ts/base/schema';
import { IIdentity } from '@/ts/core/target/authority/iidentity';

/* 
  编辑
*/
interface Iprops {
  title: string;
  open: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  editData?: IIdentity;
  reObject: IDepartment | IPerson | IGroup | ICompany | ICohort;
}
const EditCustomModal = (props: Iprops) => {
  const { open, title, handleOk, reObject, editData, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const columns: ProFormColumnsType<XIdentity>[] = [
    {
      title: '身份名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '名称为必填项' }],
      },
    },
    {
      title: '身份编号',
      dataIndex: 'code',
      formItemProps: {
        rules: [{ required: true, message: '编码为必填项' }],
      },
    },
    {
      title: '所属角色',
      dataIndex: 'authId',
      colProps: { span: 24 },
      valueType: 'treeSelect',
      formItemProps: { rules: [{ required: true, message: '所属角色为必填项' }] },
      request: async () => {
        const data = await reObject.selectAuthorityTree(false);
        return data ? [data] : [];
      },
      fieldProps: {
        disabled: title === '编辑',
        fieldNames: { label: 'name', value: 'id' },
        showSearch: true,
        filterTreeNode: true,
        // multiple: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
    },

    {
      title: '身份简介',
      dataIndex: 'remark',
      valueType: 'textarea',
      colProps: { span: 24 },
    },
  ];

  return (
    // <div className={cls['edit-custom-modal']}>
    <SchemaForm<XIdentity>
      formRef={formRef}
      title={title}
      open={open}
      width={520}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (editData) {
            formRef.current?.setFieldsValue({
              ...editData.target,
              authId: editData.target.authId,
            });
          }
        } else {
          formRef.current?.resetFields();
        }
      }}
      modalProps={{
        onCancel: () => handleCancel(),
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (title === '新增') {
          const res = await reObject.createIdentity({
            name: values.name,
            code: values.code,
            remark: values.remark,
            authId: values.authId,
          });
          if (res) {
            message.success('新增成功');
            handleOk();
          } else {
            message.error('新增失败');
            return false;
          }
        } else {
          if (!editData) return;
          const res = await editData.updateIdentity(
            values.name,
            values.code,
            values.remark,
          );
          if (res.success) {
            message.success('修改成功');
            handleOk();
          } else {
            message.error(res.msg);
            return false;
          }
        }
      }}
      columns={columns}
    />
  );
};

export default EditCustomModal;
