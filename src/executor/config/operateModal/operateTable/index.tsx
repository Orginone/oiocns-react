import { schema } from '@/ts/base';
import { getUuid } from '@/utils/tools';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { Button, Form, Space } from 'antd';
import React, { useRef, useState } from 'react';

type IProps<T> = {
  title?: string;
  defaultValue?: T;
  columns: ProColumns<T>[];
  dataSource: T[];
  onSave: (data: T) => void;
};

/*
  弹出框表格查询
*/
const operateTable: <T extends schema.XEntity>(
  props: IProps<T>,
) => React.ReactElement = ({ title, defaultValue, dataSource, columns, onSave }) => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  return (
    <EditableProTable
      style={{ width: '100vh' }}
      rowKey="id"
      recordCreatorProps={false}
      actionRef={actionRef}
      headerTitle={title}
      columns={columns}
      value={dataSource}
      toolBarRender={() => {
        return [
          <Space>
            <Button
              type="primary"
              onClick={() => {
                actionRef.current?.addEditRecord?.(
                  defaultValue || {
                    id: '0',
                    name: '',
                    code: '',
                    remark: '',
                  },
                );
              }}
              icon={<PlusOutlined />}>
              新增
            </Button>
          </Space>,
        ];
      }}
      editable={{
        form,
        editableKeys,
        onSave: async (_, record) => {
          onSave(record);
        },
        onChange: setEditableRowKeys,
        actionRender: (_row, _config, dom) => [dom.save, dom.cancel],
      }}
    />
  );
};

export default operateTable;
