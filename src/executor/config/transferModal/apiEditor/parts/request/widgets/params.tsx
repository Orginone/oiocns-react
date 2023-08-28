import { IRequest } from '@/ts/core/thing/config';
import React, { useEffect, useState } from 'react';
import EditableTable from './editable';

export interface IProps {
  current: IRequest;
}
export interface Param {
  id: string;
  key?: string;
  value?: string;
  description?: string;
}

const toUrlParams = (url: string = '', params: readonly Param[]): string => {
  let parts = url.split('?');
  let ans = params.map((item) => `${item.key ?? ''}=${item.value ?? ''}`).join('&');
  return parts[0] + '?' + ans;
};

const Params: React.FC<IProps> = ({ current }) => {
  const [params, setParams] = useState<readonly Param[]>(current.metadata.params);

  useEffect(() => {
    const id = current.subscribe(() => {
      setParams(current.metadata.params);
    });
    return () => {
      current.unsubscribe(id!);
    };
  }, [current.axios.params]);

  const onChange = (params: readonly Param[]) => {
    const url = toUrlParams(current.metadata.axios.url, params);
    current.metadata.axios.url = url;
    current.metadata.params = params;
    current.refresh(current.metadata);
  };

  return (
    <EditableTable<Param>
      value={params}
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
              onClick={() => onChange(params.filter((item) => item.id != record.id))}>
              删除
            </a>,
          ],
        },
      ]}
    />
  );
};

export default Params;
