import React, { useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget } from '@/ts/core';
import { message } from 'antd';
import { XTarget } from '@/ts/base/schema';
interface Iprops {
  title: string;
  open: boolean;
  handleOk: () => void;
  onCancel: () => void;
  current: ITarget; //原部门
  needTransferUser: XTarget; // 需要转移部门的人员
}

const TransferDepartment = (props: Iprops) => {
  const { title, open, handleOk, current, needTransferUser, onCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [newDept, setNewDept] = useState<ITarget>();
  const [reload] = useState<boolean>(false);
  const loadTreeData = async (reload: boolean) => {
    const createTeeDom: any = async (n: ITarget) => {
      const { target } = n;
      let result: any = {
        value: target.id,
        label: target.name,
        intans: n,
        children: [],
      };
      const children = await n.loadSubTeam(reload);
      if (children.length > 0) {
        for (const child of children) {
          if (child.target) {
            result.children.push(await createTeeDom(child));
          }
        }
      }
      return result;
    };
    const depts = await userCtrl.company.loadSubTeam(reload);
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
        onSelect: (_: any, info: { intans: ITarget }) => {
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
            id: current.target.id,
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
        if (values.id === current.target.id) {
          onCancel();
          return;
        }
        if (newDept) {
          if (await current.removeMember(needTransferUser)) {
            if (await newDept.pullMember(needTransferUser)) {
              message.success('操作成功');
              handleOk();
            } else {
              return false;
            }
          }
        }
      }}
      columns={columns}></SchemaForm>
  );
};
export default TransferDepartment;
