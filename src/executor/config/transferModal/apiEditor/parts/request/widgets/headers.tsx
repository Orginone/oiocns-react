import React, { useEffect, useState } from 'react';
import EditableTable from './editable';
import { ILink } from '@/ts/core/thing/link';
import { model } from '@/ts/base';
import { generateUuid } from '@/ts/base/common';

export interface IProps {
  current: ILink;
  node: model.RequestNode;
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

const Header: React.FC<IProps> = ({ current, node }) => {
  const [headers, setHeaders] = useState(toHeader(node.data.header));
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type == 'node' && cmd == 'update') {
        setHeaders(args.data.headers);
      }
    });
    return () => {
      current.unsubscribe(id);
    };
  });

  const onChange = (headers: readonly HeaderData[]) => {
    node.data.header = toKvHeader(headers);
    current.updNode(node);
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
