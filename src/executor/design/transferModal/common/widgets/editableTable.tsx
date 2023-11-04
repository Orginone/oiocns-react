import { generateUuid } from '@/ts/base/common';
import {
  EditableProTable,
  ProColumns,
  ProFormInstance,
} from '@ant-design/pro-components';
import TextArea from 'antd/lib/input/TextArea';
import React, { useRef, useState } from 'react';
import cls from '../index.module.css';

export interface IProps<T> {
  value: readonly T[];
  onChange: (value: readonly T[]) => void;
  columns?: ProColumns<T, 'text'>[];
}

export interface Row {
  id: string;
}

function EditableTable<T extends Row>({ value, onChange, columns }: IProps<T>) {
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const edited = useRef<boolean>(true);
  if (columns) {
    columns.forEach((item) => {
      if (!item.valueType || item.valueType == 'text') {
        item.renderFormItem = () => <AutoTextArea edited={edited} />;
      }
    });
  }
  return (
    <EditableProTable
      rowKey="id"
      formRef={formRef}
      value={value}
      maxLength={1000}
      onChange={onChange}
      controlled={true}
      onRow={(row) => {
        return {
          onMouseDown: () => {
            setEditableRowKeys([row.id]);
          },
        };
      }}
      columns={columns}
      recordCreatorProps={{
        creatorButtonText: '新增',
        position: 'bottom',
        newRecordType: 'dataSource',
        record: (_index, _params) =>
          ({
            id: generateUuid(),
          } as T),
      }}
      editable={{
        type: 'multiple',
        editableKeys,
      }}
    />
  );
}

export const AutoTextArea: React.FC<{
  value?: string;
  onChange?: (value?: string) => void;
  edited: React.MutableRefObject<boolean>;
}> = ({ value, onChange, edited }) => {
  return (
    <TextArea
      className={cls.textarea}
      autoSize={true}
      defaultValue={value}
      onCompositionStart={() => (edited.current = false)}
      onCompositionEnd={(event) => {
        edited.current = true;
        onChange?.((event.target as HTMLTextAreaElement).value);
      }}
      onChange={(event) => {
        if (edited.current) {
          onChange?.(event.target.value);
        }
      }}
    />
  );
};

export { EditableTable };
