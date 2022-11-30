import React, { useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Space, Image, Dropdown, Button, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { docsCtrl } from '@/ts/controller/store/docsCtrl';
import { getItemMenu } from '../CommonMenu';
import cls from '../../index.module.less';
import { IFileSystemItem } from '@/ts/core/store/ifilesys';

const TableContent = ({
  pageData,
  getThumbnail,
  getPreview,
  handleMenuClick,
  parentRef,
}: {
  parentRef: any;
  pageData: IFileSystemItem[];
  getThumbnail: (item: IFileSystemItem) => string;
  handleMenuClick: (key: string, node: IFileSystemItem) => void;
  getPreview: (node: IFileSystemItem) => false | { src: string };
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
          bodyStyle: { padding: 0 },
        }}
        search={false}
        pagination={false}
        options={false}
        columns={[
          {
            dataIndex: 'name',
            title: '名称',
            render: (_, record) => {
              return (
                <Space>
                  <Image
                    height={32}
                    src={getThumbnail(record)}
                    fallback="/icons/default_file.svg"
                    preview={getPreview(record)}
                  />
                  <Typography>{_}</Typography>
                </Space>
              );
            },
          },
          {
            dataIndex: ['target', 'dateCreated'],
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
