import { XOperation } from '@/ts/base/schema';
import { ISpeciesItem } from '@/ts/core';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import React, { useEffect, useRef, useState } from 'react';
import { targetsToTreeData } from '../../..';
import SchemaForm from '@/components/SchemaForm';
import { getUuid } from '@/utils/tools';
import orgCtrl from '@/ts/controller';

interface Iprops {
  title: string;
  open: boolean;
  data: XOperation | undefined;
  handleCancel: () => void;
  handleOk: (res: any) => void;
  current: ISpeciesItem;
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
const OperationModal = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();
  const [formKey, setFormKey] = useState<string>();
  const columns: ProFormColumnsType<XOperation>[] = [
    {
      title: '表单名称',
      dataIndex: 'name',
      // placeholder="请输入表单名称",
      formItemProps: {
        rules: [{ required: true, message: '表单名称为必填项' }],
      },
    },
    {
      title: '表单代码',
      dataIndex: 'code',
      // placeholder="请输入表单代码",
      formItemProps: {
        rules: [{ required: true, message: '表单代码为必填项' }],
      },
    },
    {
      title: '选择制定组织',
      dataIndex: 'belongId',
      valueType: 'treeSelect',
      initialValue: current.team.space.id,
      formItemProps: { rules: [{ required: true, message: '组织为必填项' }] },
      request: async () => {
        const res = await orgCtrl.getTeamTree(current.team.space);
        return targetsToTreeData(res);
      },
      fieldProps: {
        disabled: title === '修改',
        showSearch: true,
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
  ];

  useEffect(() => {
    setFormKey(getUuid());
  }, [open, current]);

  return (
    <SchemaForm<XOperation>
      key={formKey}
      formRef={formRef}
      layoutType="ModalForm"
      width={640}
      title={data?.name || title}
      open={open}
      rowProps={{
        gutter: [24, 0],
      }}
      columns={columns}
      onOpenChange={(open: boolean) => {
        if (open) {
          if (data && (title.includes('修改') || title.includes('编辑'))) {
            formRef.current?.setFieldsValue(data);
          }
        } else {
          formRef.current?.resetFields();
          handleCancel();
        }
      }}
      onFinish={async (values: XOperation) => {
        const value = {
          ...{ remark: JSON.stringify(defaultRemark) },
          ...data,
          ...values,
          speciesId: current.id,
        };
        let success = false;
        if (title.includes('新增')) {
          success = (await current.createOperation({ ...value, items: [] })) != undefined;
        } else {
          success = await current.updateOperation({ ...value, items: [] });
        }
        if (success) {
          handleOk(true);
          formRef.current?.resetFields();
        }
      }}></SchemaForm>
  );
};

export default OperationModal;
