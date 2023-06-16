import React, { useEffect, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Dropdown, Button, Typography } from 'antd';
import { AiOutlineEllipsis } from 'react-icons/ai';
import style from '../../index.module.less';
import { IFileInfo, ISysFileInfo } from '@/ts/core';
import { command, schema } from '@/ts/base';
import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import { formatSize } from '@/ts/base/common';

const TableContent = ({
  pageData,
  parentRef,
  loadMenus,
}: {
  parentRef: any;
  pageData: IFileInfo<schema.XEntity>[];
  loadMenus: (file: IFileInfo<schema.XEntity>) => any[];
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
            dataIndex: 'size',
            title: '大小',
            width: 100,
            render: (_, record) => {
              if ('filedata' in record) {
                return formatSize((record as ISysFileInfo).filedata.size);
              }
              return '';
            },
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
          {
            dataIndex: 'opration',
            title: '操作',
            width: 80,
            render: (_, record) => {
              return (
                <Dropdown
                  className={style['operation-btn']}
                  menu={{
                    items: loadMenus(record),
                    onClick: ({ key }) => {
                      command.emitter('config', key, record);
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
              command.emitter('config', 'open', record);
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
