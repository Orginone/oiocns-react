import React, { useEffect, useRef, useState } from 'react';
import { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-components';
import SchemaForm from '@/components/SchemaForm';
import { OperationItemModel, OperationModel } from '@/ts/base/model';
import { ISpeciesItem, ITarget } from '@/ts/core';
import userCtrl from '@/ts/controller/setting';
import { XAttribute, XOperation } from '@/ts/base/schema';
import { kernel } from '@/ts/base';

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
 * 默认备注：xrender默认布局
 */
export const defaultRemark: any = {
  type: 'object',
  properties: {},
  labelWidth: 120,
  displayType: 'row',
  column: 2,
};

/**
 * 特性转业务标准项
 * @param attrs 特性列表
 * @param operation 业务标准
 * @returns 业务标准项
 */
export const transformItemModel = (
  attrs: XAttribute[],
  operation: XOperation,
): OperationItemModel[] => {
  return attrs.map((attr, index) => {
    let widget = 'input';
    let type = 'string';
    let dictId: string | undefined = undefined;
    if (attr.valueType === '数值型') {
      widget = 'number';
      type = 'number';
    } else if (attr.valueType === '选择型') {
      widget = 'dict';
      dictId = attr.dictId;
    }
    const item: OperationItemModel = {
      id: undefined,
      name: attr.name,
      code: attr.id,
      remark: `${index + 1}`,
      belongId: attr.belongId,
      operationId: operation.id,
      rule: JSON.stringify({
        title: attr.name,
        type,
        widget,
        required: false,
        readOnly: false,
        hidden: attr.code === 'thingId',
        placeholder: `请输入${attr.name}`,
        description: attr.remark,
        dictId,
      }),
    };
    return item;
  });
};

/*
  业务标准编辑模态框
*/
const OperationModal = (props: Iprops) => {
  const { open, title, handleOk, data, current, handleCancel } = props;
  const formRef = useRef<ProFormInstance>();

  const getFromColumns = () => {
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
        // request: async () => {
        //   const res = await current.loadFlowDefines(userCtrl.space.id, false, {
        //     offset: 0,
        //     limit: 1000000,
        //     filter: '',
        //   });
        //   const flowDefines = res.result || [];
        //   console.log('flowDefines', flowDefines);
        //   return flowDefines.map((def) => {
        //     return { label: def.name, value: def.id };
        //   });
        // },
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
    return columns;
  };
  // 生成业务标准子项
  const generateItems = async (operation: XOperation) => {
    // 1. 查询特性
    const res = await current.loadAttrs(userCtrl.space.id, {
      offset: 0,
      limit: 100000,
      filter: '',
    });
    const attrs = res.result || [];
    const items = transformItemModel(attrs, operation);
    for (const item of items) {
      const res = await kernel.createOperationItem(item);
      console.log(res);
    }
  };
  return (
    <SchemaForm<OperationModel>
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
      onFinish={async (value) => {
        value = { ...{ remark: JSON.stringify(defaultRemark) }, ...data, ...value };
        if (title.includes('新增')) {
          const res = await current.createOperation(value);
          if (res.success) {
            generateItems(res.data);
          }
          handleOk(res);
        } else {
          handleOk(await current.updateOperation(value));
        }
      }}
      columns={getFromColumns()}></SchemaForm>
  );
};

export default OperationModal;
