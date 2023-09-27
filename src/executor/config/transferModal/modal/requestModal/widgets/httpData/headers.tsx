import { EditableTable } from '@/executor/config/transferModal';
import { model } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';
import { ITransfer } from '@/ts/core';
import React, { useState } from 'react';

export interface IProps {
  transfer: ITransfer;
  current: model.Request;
}

interface HeaderData {
  id: string;
  key?: string;
  value?: string;
}

const toHeader = (header: { [key: string]: string }): HeaderData[] => {
  const headers: HeaderData[] = [];
  Object.keys(header).forEach((key) => {
    headers.push({
      id: generateUuid(),
      key: key,
      value: header[key],
    });
  });
  return headers;
};

const toKvHeader = (headers: readonly HeaderData[]) => {
  const final: { [key: string]: string } = {};
  for (const header of headers) {
    if (header.key) {
      final[header.key] = header.value ?? '';
    }
  }
  return final;
};

const Header: React.FC<IProps> = ({ transfer, current }) => {
  const [headers, setHeaders] = useState(toHeader(current.data.header));

  const onChange = (headers: readonly HeaderData[]) => {
    current.data.header = toKvHeader(headers);
    transfer.updNode(current);
    setHeaders([...headers]);
  };

  return (
    <EditableTable<HeaderData>
      value={headers}
      onChange={onChange}
      columns={[
        {
          title: 'Key',
          dataIndex: 'key',
        },
        {
          title: 'Value',
          dataIndex: 'value',
        },
        {
          title: 'Description',
          dataIndex: 'description',
        },
        {
          title: 'Option',
          dataIndex: 'operate',
          editable: false,
          render: (_, record) => [
            <a
              key="delete"
              onClick={() => onChange(headers.filter((item) => item.id != record.id))}>
              删除
            </a>,
          ],
        },
      ]}
    />
  );
};

export default Header;
