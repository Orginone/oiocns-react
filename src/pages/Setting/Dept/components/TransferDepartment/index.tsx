import React, { useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { IDepartment } from '@/ts/core';
import { message } from 'antd';
import { XTarget } from '@/ts/base/schema';
interface Iprops {
  title: string;
  open: boolean;
  handleOk: () => void;
  onCancel: () => void;
  OriginDept: IDepartment; //原部门
  needTransferUser: XTarget | undefined; // 需要转移部门的人员
}

const TransferDepartment = (props: Iprops) => {
  const { title, open, handleOk, OriginDept, needTransferUser, onCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [newDept, setNewDept] = useState<IDepartment>();
  const [reload] = useState<boolean>(false);
  const loadTreeData = async (reload: boolean) => {
    const createTeeDom: any = async (n: IDepartment) => {
      const { target } = n;
      let result: any = {
        value: target.id,
        label: target.name,
        intans: n,
        children: [],
      };
      const children = await n.getDepartments(reload);
      if (children.length > 0) {
        for (const child of children) {
          if (child.target) {
            result.children.push(await createTeeDom(child));
          }
        }
      }
      return result;
    };
    const depts = await userCtrl.Company.getDepartments(reload);
    const data = [];
    if (depts.length > 0) {
      for (const child of depts) {
        if (child.target) {
          data.push(await createTeeDom(child));
        }
      }
    }
    return data;
  };
  const columns: ProFormColumnsType<{ id: string }>[] = [
    {
      title: '人员名称',
      dataIndex: 'username',
      width: 'md',
      colProps: { span: 24 },
      fieldProps: {
        readOnly: true,
      },
    },
    {
      title: '所属部门',
      key: 'id',
      dataIndex: 'id',
      width: 'md',
      colProps: { span: 24 },
      valueType: 'treeSelect',
      request: async () => loadTreeData(reload),
      fieldProps: {
        onSelect: (_: any, info: { intans: IDepartment }) => {
          setNewDept(info.intans);
        },
        fieldNames: { label: 'label', value: 'value' },
        showSearch: true,
        filterTreeNode: true,
        // multiple: true,
        treeNodeFilterProp: 'name',
        treeDefaultExpandAll: true,
      },
    },
  ];
  return (
    <SchemaForm<{ id: string }>
      formRef={formRef}
      title={title}
      open={open}
      width={520}
      onOpenChange={(open: boolean) => {
        if (open) {
          formRef.current?.setFieldsValue({
            id: OriginDept.target.id,
            username: needTransferUser?.team?.name,
          });
        } else {
          formRef.current?.resetFields();
          onCancel();
        }
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (values) => {
        if (values.id === OriginDept.target.id) {
          onCancel();
          return;
        }
        if (needTransferUser) {
          const { success } = await OriginDept.removePerson([needTransferUser.id]);
          if (success) {
            const res = await newDept?.pullPerson([needTransferUser]);
            if (res?.success) {
              message.success('操作成功');
              handleOk();
            } else {
              message.error(res?.msg || '操作失败');
              return false;
            }
          }
        }
      }}
      columns={columns}></SchemaForm>
  );
};
export default TransferDepartment;
