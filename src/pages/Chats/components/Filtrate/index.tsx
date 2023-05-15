import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IMsgChat } from '@/ts/core';

interface IProps {
  dataSource: IMsgChat[];
  rowSelection: any;
}

type DataSourceType = {
  name: string;
  chatId: string;
  key: string;
};

const Filtrate: React.FC<IProps> = ({ dataSource, rowSelection }) => {
  const [dataSources, setDataSources] = useState<DataSourceType[]>([]);

  // 处理数据源
  useEffect(() => {
    if (dataSource.length > 0) {
      let dataArr: DataSourceType[] = [];
      dataSource.forEach((item) => {
        dataArr.push({ name: item.share.name, chatId: item.chatId, key: item.key });
      });
      setDataSources(dataArr);
    }
  }, [dataSource]);

  // 表头
  const columns: ColumnsType<any[]> = [
    {
      title: '名称',
      dataIndex: 'name',
    },
  ];

  return (
    <div>
      <Table
        rowKey={'key'}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection,
        }}
        pagination={false}
        columns={columns}
        dataSource={dataSources as any}
      />
    </div>
  );
};

export default Filtrate;
