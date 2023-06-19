import React, { useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Typography } from 'antd';
import { IWork } from '@/ts/core';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';

const TableContent = ({
  pageData,
  parentRef,
  setApplyWork,
}: {
  parentRef: any;
  setApplyWork: Function;
  pageData: IWork[];
}) => {
  const [tableHeight, setTableHeight] = useState<number | 'auto'>('auto'); //计算高度
  // 监听父级高度
  useEffect(() => {
    setTimeout(() => {
      if (parentRef?.current) {
        let _height = parentRef.current.offsetHeight;
        // let width = parentRef.current.offsetWidth;
        // console.log('展示高度', _height);
        setTableHeight(_height > 100 ? _height - 72 : 100);
      }
    }, 50);
  }, [parentRef]);

  return (
    pageData && (
      <ProTable
        cardProps={{
          bodyStyle: { padding: 0, cursor: 'pointer' },
        }}
        search={false}
        pagination={false}
        options={false}
        columns={[
          {
            dataIndex: 'name',
            title: '名称',
            ellipsis: {
              showTitle: false,
            },
            render: (_, record) => {
              return <EntityIcon entityId={record.id} showName />;
            },
          },
          {
            dataIndex: 'code',
            title: '代码',
            width: 100,
            render: (_, record) => <Typography>{record.code}</Typography>,
          },
          {
            dataIndex: 'typeName',
            title: '类型',
            width: 100,
            render: (_, record) => <Typography>{record.typeName}</Typography>,
          },
          {
            dataIndex: ['metadata', 'createTime'],
            title: '创建时间',
            valueType: 'dateTime',
            width: 200,
            render: (_, record) => showChatTime(record.metadata.createTime),
          },
          {
            dataIndex: ['metadata', 'updateTime'],
            title: '更新时间',
            valueType: 'dateTime',
            width: 200,
            render: (_, record) => showChatTime(record.metadata.updateTime),
          },
        ]}
        expandable={{
          childrenColumnName: 'nochild',
        }}
        onRow={(record) => {
          return {
            onDoubleClick: async () => {
              setApplyWork(record);
            },
          };
        }}
        rowKey={'key'}
        dataSource={pageData}
        scroll={{ y: tableHeight }}
      />
    )
  );
};
export default TableContent;
