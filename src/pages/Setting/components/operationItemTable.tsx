import { kernel } from '@/ts/base';
import { ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import React, { useState } from 'react';
import userCtrl from '@/ts/controller/setting';
import useObjectUpdate from '@/hooks/useObjectUpdate';
import { ISpeciesItem } from '@/ts/core';
import { XOperationItem } from '@/ts/base/schema';
import { OperationItemModel } from '@/ts/base/model';
import { message } from 'antd';

type OperationItemExt = {
  id: string;
  name: string;
  code: string;
  remark: string;
  belongId: string;
  operationId: string;
  title: string;
  type: string;
  widget: string;
  required: string;
  readOnly: string;
  hidden: string;
  min: string;
  max: string;
  description: string;
  placeholder: string;
  groupName: string;
  rules: string;
};

/**
 * 字段列
 */
const fieldColumns: ProColumns<OperationItemExt>[] = [
  {
    title: '字段名称',
    dataIndex: 'name',
    fixed: 'left',
    readonly: true,
    width: 120,
  },
  // {
  //   title: '字段编码',
  //   dataIndex: 'code',
  //   readonly: true,
  //   width: 100,
  // },
  {
    title: '共享组织',
    dataIndex: 'belongId',
    readonly: true,
    render: (_, record) => {
      const team = userCtrl.findTeamInfoById(record.belongId);
      if (team) {
        return team.name;
      }
    },
  },
  {
    title: '默认组件',
    dataIndex: 'widget',
    valueType: 'select',
    fieldProps: {
      options: [],
      width: 90,
    },
  },
  {
    title: '必须',
    dataIndex: 'required',
    valueType: 'select',
    fieldProps: {
      width: 70,
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
  },
  {
    title: '只读',
    dataIndex: 'readOnly',
    valueType: 'select',
    fieldProps: {
      width: 70,
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
  },
  {
    title: '隐藏',
    dataIndex: 'hidden',
    valueType: 'select',
    fieldProps: {
      width: 70,
      options: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
    },
  },
  {
    title: '最小值',
    dataIndex: 'min',
    valueType: 'digit',
    width: 80,
  },
  {
    title: '最大值',
    dataIndex: 'max',
    valueType: 'digit',
    width: 80,
  },
  {
    title: '字段说明',
    dataIndex: 'description',
    valueType: 'text',
    width: 160,
    ellipsis: true,
  },
  {
    title: '输入描述',
    dataIndex: 'placeholder',
    valueType: 'text',
    width: 160,
    ellipsis: true,
  },
  {
    title: '分组名称',
    dataIndex: 'groupName',
    valueType: 'text',
  },
  {
    title: '规则',
    dataIndex: 'rules',
    tooltip: `示例：[
      {
        pattern: '^[A-Za-z0-9]+$',
        message: '只允许填写英文字母和数字',
      },
    ]`,
  },
];

/**
 * 转换前端显示
 */
const transformExt = (xitems: XOperationItem[]) => {
  const items: OperationItemExt[] = xitems.map((i) => {
    const rule: any = JSON.parse(i.rule) || {
      title: i.name,
      type: 'string',
      widget: 'input',
      required: false,
      readOnly: false,
      hidden: false,
    };
    return {
      id: i.id,
      name: i.name,
      code: i.code,
      remark: i.remark,
      belongId: i.belongId,
      operationId: i.operationId,
      title: i.name,
      type: rule.type,
      widget: rule.widget,
      required: rule.required,
      readOnly: rule.readOnly,
      hidden: rule.hidden,
      min: rule.min,
      max: rule.max,
      description: rule.description,
      placeholder: rule.placeholder,
      groupName: rule.groupName,
      rules: rule.rules,
    };
  });
  return items;
};

/**
 * 转换后台修改
 */
const transformItemModel = (i: OperationItemExt) => {
  const item: OperationItemModel = {
    id: i.id,
    name: i.name,
    code: i.code,
    remark: i.remark,
    belongId: i.belongId,
    operationId: i.operationId,
    rule: JSON.stringify({
      title: i.name,
      type: i.type,
      widget: i.widget,
      required: i.required,
      readOnly: i.readOnly,
      hidden: i.hidden,
      min: i.min,
      max: i.max,
      description: i.description,
      placeholder: i.placeholder,
      groupName: i.groupName,
      rules: i.rules,
    }),
  };
  return item;
};

export type OperationItemTableProps = {
  current: ISpeciesItem;
  operationId: string;
};

const OperationItemTable: React.FC<OperationItemTableProps> = ({
  operationId,
  current,
}) => {
  const [tkey, tforceUpdate] = useObjectUpdate(current);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<OperationItemExt>[] = [
    ...fieldColumns,
    {
      title: '操作',
      valueType: 'option',
      width: 140,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}>
          编辑
        </a>,
      ],
    },
  ];

  // 保存
  const save = async (itemExt: OperationItemExt) => {
    const item = transformItemModel(itemExt);
    const res = await kernel.updateOperationItem(item);
    if (res.success) {
      tforceUpdate();
      message.success('修改成功!');
    } else {
      message.error('修改成功!');
    }
  };

  return (
    <>
      <EditableProTable<OperationItemExt>
        rowKey="id"
        scroll={{
          x: 2000,
        }}
        params={{ id: tkey }}
        loading={false}
        columns={columns}
        request={async () => {
          const res = await kernel.queryOperationItems({
            id: operationId,
            spaceId: userCtrl.space.id,
            page: { offset: 0, limit: 100000, filter: '' },
          });
          return {
            data: transformExt(res.data.result || []),
            success: res.success,
            total: res.data?.total,
          };
        }}
        recordCreatorProps={false}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
            save(data);
          },
          onChange: setEditableRowKeys,
          actionRender: (row, config, dom) => [dom.save, dom.cancel],
        }}
      />
    </>
  );
};

export default OperationItemTable;
