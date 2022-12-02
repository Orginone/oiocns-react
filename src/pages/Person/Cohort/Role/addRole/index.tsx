import React from 'react';
import type { ProFormColumnsType } from '@ant-design/pro-components';
import JsonFrom from '../../../../../components/SchemaForm';
import { schema } from '../../../../../../src/ts/base';

interface indexType {
  open: boolean;
  setOpen: Function;
  data: schema.XAuthority;
  id: string;
  [key: string]: any;
}
type target = {
  name: string;
  code: string;
  team: teamValueType;
};
type teamValueType = {
  remark: string;
};

interface DataItem {
  Switch: boolean;
  cascader: string[];
  target: target;
}

function getColumns(data: schema.XAuthority): ProFormColumnsType<DataItem>[] {
  const columns: ProFormColumnsType<DataItem>[] = [
    {
      name: 'name',
      title: '角色名称',
      dataIndex: ['target', 'name'],
      formItemProps: {
        rules: [],
      },
    },

    {
      valueType: 'group',
      width: 'md',
      colProps: { md: 24 },
      columns: [
        {
          name: 'code',
          title: '角色编号',
          dataIndex: ['target', 'code'],
          formItemProps: {
            rules: [],
          },
        },
      ],
    },
    {
      valueType: 'switch',
      title: '是否公开',
      dataIndex: 'Switch',
      fieldProps: {
        style: {
          width: '200px',
        },
      },
      colProps: {
        xs: 12,
        md: 20,
      },
    },
    {
      title: '上级节点',
      key: 'cascader',
      dataIndex: 'cascader',
      width: 270,
      fieldProps: {
        options: [data],
        fieldNames: {
          children: 'nodes',
          label: 'name',
          value: 'id',
        },
        changeOnSelect: true,
        multiple: false,
      },
      valueType: 'cascader',
    },
    {
      valueType: 'group',
      columns: [
        {
          valueType: 'textarea',
          name: 'remark',
          title: '角色简介',
          dataIndex: ['target', 'team', 'remark'],
          formItemProps: {},
        },
      ],
    },
  ];
  return columns;
}

const AddRole: React.FC<indexType> = ({ setOpen, open, data, id }) => {
  const handleAddRole = async (values: DataItem) => {
    console.log(id);
    console.log('输出表单值', values);
  };
  console.log('列信息', data);
  return (
    <>
      <JsonFrom<DataItem>
        layoutType="ModalForm"
        open={open}
        width={550}
        title="新增角色"
        onFinish={handleAddRole}
        modalProps={{
          destroyOnClose: true,
          onCancel: () => setOpen(false),
        }}
        colProps={{ span: 24 }}
        columns={getColumns(data)}
      />
    </>
  );
};

export default AddRole;
