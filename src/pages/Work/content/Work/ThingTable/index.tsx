import type {
  EditableFormInstance,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import { EditableProTable, ProForm } from '@ant-design/pro-components';
import { Button } from 'antd';
import React, { useRef, useState } from 'react';

type DataSourceType = {
  id: React.Key;
  title?: string;
  decs?: string;
  state?: string;
  created_at?: string;
  update_at?: string;
  children?: DataSourceType[];
};

const defaultData: DataSourceType[] = [
  {
    id: '624748504',
    title: '活动名称一',
    decs: '这个活动真好玩',
    state: 'open',
    created_at: '1590486176000',
    update_at: '1590486176000',
  },
  {
    id: '624691229',
    title: '活动名称二',
    decs: '这个活动真好玩',
    state: 'closed',
    created_at: '1590481162000',
    update_at: '1590481162000',
  },
];

let i = 0;

const ThingTable = ({ toolBarRender, headerTitle }: any) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const [NewDataPosition] = useState<'top' | 'bottom' | 'hidden'>('hidden');
  const formRef = useRef<ProFormInstance<any>>();
  const editorFormRef = useRef<EditableFormInstance<DataSourceType>>();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '活动名称',
      dataIndex: 'title',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      width: '30%',
    },
    {
      title: '状态',
      key: 'state',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
        },
      },
    },
    {
      title: '描述',
      dataIndex: 'decs',
    },
    {
      title: '活动时间',
      dataIndex: 'created_at',
      valueType: 'date',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            const tableDataSource = formRef.current?.getFieldValue(
              'table',
            ) as DataSourceType[];
            formRef.current?.setFieldsValue({
              table: tableDataSource.filter((item) => item.id !== record.id),
            });
          }}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <ProForm<{
      table: DataSourceType[];
    }>
      formRef={formRef}
      initialValues={{
        table: defaultData,
      }}
      validateTrigger="onBlur">
      <EditableProTable<DataSourceType>
        rowKey="id"
        scroll={{
          x: 960,
        }}
        editableFormRef={editorFormRef}
        headerTitle={headerTitle ?? '可编辑表格'}
        maxLength={5}
        name="table"
        recordCreatorProps={
          NewDataPosition !== 'hidden'
            ? {
                position: NewDataPosition as 'top',
                record: () => ({ id: (Math.random() * 1000000).toFixed(0) }),
              }
            : false
        }
        toolBarRender={toolBarRender}
        columns={columns}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, config, defaultDom) => {
            return [
              defaultDom.save,
              defaultDom.delete || defaultDom.cancel,
              <a
                key="set"
                onClick={() => {
                  i++;
                  editorFormRef.current?.setRowData?.(config.index!, {
                    title: '动态设置的title' + i,
                  });
                }}>
                动态设置此行
              </a>,
            ];
          },
        }}
      />
    </ProForm>
  );
};
export default ThingTable;
