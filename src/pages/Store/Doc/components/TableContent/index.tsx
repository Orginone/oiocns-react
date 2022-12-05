import React, { useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Space, Image, Dropdown, Button, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import docsCtrl from '@/ts/controller/store/docsCtrl';
import { getItemMenu } from '../CommonMenu';
import cls from '../../index.module.less';
import { FileItemModel } from '@/ts/base/model';
import { formatSize } from '@/ts/base/common';

const TableContent = ({
  pageData,
  getThumbnail,
  getPreview,
  handleMenuClick,
  parentRef,
}: {
  parentRef: any;
  pageData: FileItemModel[];
  getThumbnail: (item: FileItemModel) => string;
  handleMenuClick: (key: string, node: FileItemModel) => void;
  getPreview: (node: FileItemModel) => false | { src: string };
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
              return (
                <Space>
                  <Image
                    width={32}
                    height={32}
                    src={getThumbnail(record)}
                    fallback="/icons/default_file.svg"
                    preview={getPreview(record)}
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
            dataIndex: 'size',
            title: '大小',
            valueType: 'number',
            width: 100,
            render: (_, record) => <Typography>{formatSize(record.size)}</Typography>,
          },
          {
            dataIndex: 'dateCreated',
            title: '创建时间',
            valueType: 'dateTime',
            width: 200,
          },
          {
            dataIndex: 'dateModified',
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
                  className={cls['operation-btn']}
                  menu={{
                    items: getItemMenu(record),
                    onClick: ({ key }) => {
                      handleMenuClick(key, record);
                    },
                  }}
                  key={record.key}
                  trigger={['click']}>
                  <Button shape="round" size="small">
                    <EllipsisOutlined />
                  </Button>
                </Dropdown>
              );
            },
          },
        ]}
        expandable={{
          childrenColumnName: 'nochild',
        }}
        onRow={(recod) => {
          return {
            onDoubleClick: () => {
              docsCtrl.open(recod.key);
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
