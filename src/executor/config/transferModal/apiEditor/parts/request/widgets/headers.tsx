import { IRequest } from '@/ts/core/thing/config';
import { AxiosHeaderValue, AxiosHeaders, RawAxiosRequestHeaders } from 'axios';
import React, { useEffect, useState } from 'react';
import EditableTable from './editable';

export interface IProps {
  current: IRequest;
}

export type Header = RawAxiosRequestHeaders | AxiosHeaders;

interface HeaderData {
  id: string;
  key?: string;
  value?: AxiosHeaderValue;
}

const toAxiosHeader = (headers: readonly HeaderData[]): Header => {
  const final: Header = {};
  for (const header of headers) {
    if (header.key) {
      final[header.key] = header.value;
    }
  }
  return final;
};

const Header: React.FC<IProps> = ({ current }) => {
  const [headers, setHeaders] = useState<readonly HeaderData[]>(current.metadata.headers);
  useEffect(() => {
    const id = current.subscribe(() => {
      setHeaders(current.metadata.headers);
    });
    return () => {
      current.unsubscribe(id);
    };
  }, [current.axios.headers]);

  const onChange = (headers: readonly HeaderData[]) => {
    current.metadata.headers = headers;
    current.axios.headers = toAxiosHeader(headers);
    current.refresh(current.metadata);
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
