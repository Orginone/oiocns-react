import React, { useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Space, Image, Dropdown, Button, Typography } from 'antd';
import { AiOutlineEllipsis } from 'react-icons/ai';
import style from '../../index.module.less';
import { formatSize } from '@/ts/base/common';
import { IFileSystemItem } from '@/ts/core';
import { FileItemModel } from '@/ts/base/model';
import { loadFileSysItemMenus } from '@/pages/Store/config/menuOperate';

const TableContent = ({
  pageData,
  getThumbnail,
  handleMenuClick,
  parentRef,
}: {
  parentRef: any;
  pageData: IFileSystemItem[];
  getThumbnail: (item: FileItemModel) => string;
  handleMenuClick: (key: string, node: IFileSystemItem) => void;
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
            dataIndex: ['metadata', 'name'],
            title: '名称',
            ellipsis: {
              showTitle: false,
            },
            render: (_, record) => {
              return (
                <Space>
                  <Image
                    width={32}
                    height={32}
                    preview={false}
                    src={getThumbnail(record.metadata)}
                    fallback="/icons/default_file.svg"
                  />
                  <Typography.Text
                    style={{ width: 300 }}
                    ellipsis={true}
                    title={_?.toString()}>
                    {_}
                  </Typography.Text>
                </Space>
              );
            },
          },
          {
            dataIndex: ['metadata', 'size'],
            title: '大小',
            valueType: 'number',
            width: 100,
            render: (_, record) => (
              <Typography>{formatSize(record.metadata.size)}</Typography>
            ),
          },
          {
            dataIndex: ['metadata', 'dateCreated'],
            title: '创建时间',
            valueType: 'dateTime',
            width: 200,
          },
          {
            dataIndex: ['metadata', 'dateModified'],
            title: '更新时间',
            valueType: 'dateTime',
            width: 200,
          },
          {
            dataIndex: 'opration',
            title: '操作',
            width: 80,
            render: (_, record) => {
              return (
                <Dropdown
                  className={style['operation-btn']}
                  menu={{
                    items: loadFileSysItemMenus(record),
                    onClick: ({ key }) => {
                      handleMenuClick(key, record);
                    },
                  }}
                  key={record.key}
                  trigger={['click']}>
                  <Button shape="round" size="small">
                    <AiOutlineEllipsis />
                  </Button>
                </Dropdown>
              );
            },
          },
        ]}
        expandable={{
          childrenColumnName: 'nochild',
        }}
        onRow={(record) => {
          return {
            onDoubleClick: async () => {
              handleMenuClick('双击', record);
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
