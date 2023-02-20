import SchemaForm from '@/components/SchemaForm';
import { OperationModel } from '@/ts/base/model';
import { XOperation } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem, ITarget } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useRef } from 'react';

interface Iprops {
  title: string;
  open: boolean;
  data: XOperation | undefined;
  handleCancel: () => void;
  handleOk: (res: any) => void;
  current: ISpeciesItem;
  target?: ITarget;
}

/**
 * 默认备注：表单默认布局
 */
export const defaultRemark: any = {
  type: 'object',
  properties: {},
  labelWidth: 120,
  displayType: 'row',
  column: 2,
};

/*
  业务标准编辑模态框
*/
const OperationModal = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();

  const columns: ProFormColumnsType<OperationModel>[] = [
    {
      title: '表单名称',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: true, message: '特性名称为必填项' }],
      },
    },
    {
      title: '业务代码',
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
      title: '流程',
      dataIndex: 'defineId',
      valueType: 'select',
      request: async () => {
        const res = await current.loadFlowDefines(userCtrl.space.id, {
          offset: 0,
          limit: 1000000,
          filter: '',
        });
        const flowDefines = res.result || [];
        console.log('flowDefines', flowDefines);
        return flowDefines.map((def) => {
          return { label: def.name, value: def.id };
        });
      },
    },
    {
      title: '角色',
      dataIndex: 'beginAuthId',
      valueType: 'select',
    },
    // {
    //   title: '业务内容',
    //   dataIndex: 'remark',
    //   valueType: 'textarea',
    //   colProps: { span: 24 },
    //   formItemProps: {
    //     rules: [{ required: true, message: '业务内容为必填项' }],
    //   },
    // },
  ];

  return (
    <SchemaForm<OperationModel>
      destroyOnClose={true}
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
          handleCancel();
        }
        formRef.current?.resetFields();
        formRef.current?.setFieldsValue(data);
      }}
      rowProps={{
        gutter: [24, 0],
      }}
      layoutType="ModalForm"
      onFinish={async (value) => {
        value = { ...{ remark: JSON.stringify(defaultRemark) }, ...data, ...value };
        if (title.includes('新增')) {
          handleOk(await current.createOperation(value));
        } else {
          handleOk(await current.updateOperation(value));
        }
      }}
      columns={columns}></SchemaForm>
  );
};

export default OperationModal;
