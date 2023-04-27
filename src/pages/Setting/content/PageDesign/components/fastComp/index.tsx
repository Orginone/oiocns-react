import './index.less';

import { Button } from 'antd';
import React from 'react';
import { ProList } from '@ant-design/pro-components';
const dataSource = [
  {
    name: '去办“事”',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
  {
    name: '管理“物”',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
  {
    name: '去“沟通”',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
  {
    name: '处理“关系”',
    image:
      'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
    desc: '我是一条测试的描述',
  },
];
const Index: React.FC = () => {
  return (
    <ProList<any>
      toolBarRender={() => {
        return [
          <Button key="add" type="primary">
            新建
          </Button>,
        ];
      }}
      onRow={(record: any) => {
        return {
          onMouseEnter: () => {
            console.log(record);
          },
          onClick: () => {
            console.log(record);
          },
        };
      }}
      rowKey="name"
      headerTitle="快捷入口"
      tooltip="基础列表的配置"
      dataSource={dataSource}
      showActions="hover"
      showExtra="hover"
      metas={{
        title: {
          dataIndex: 'name',
        },
        avatar: {
          dataIndex: 'image',
        },
        description: {
          dataIndex: 'desc',
        },
        actions: {
          render: (text, row) => [
            <a href={row.html_url} target="_blank" rel="noopener noreferrer" key="link">
              链路
            </a>,
          ],
        },
      }}
    />
  );
};

export default Index;
