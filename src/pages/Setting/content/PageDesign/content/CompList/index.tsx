import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table } from 'antd';
import './index.less';
import pageCtrl from '@/pages/Setting/content/PageDesign/pageCtrl';
import CreatIfream from './addIfream';
interface CardCompType {}
const Index: React.FC<CardCompType> = () => {
  const [active, setActive] = useState<string>('1');
  useEffect(() => {
    pageCtrl.subscribePart('DataSource', () => {
      setTimeout(() => {
        console.log('DataSource变化', pageCtrl.dataSource);
      }, 50);
    });
    return () => {
      pageCtrl.unsubscribe(['DataSource']);
    };
  }, []);
  const DataSource = useMemo(() => {
    return (
      pageCtrl.dataSource.find(
        (v) =>
          v.title ===
          (active == '1' ? '系统组件' : active == '2' ? '图形组件' : '自定义组件'),
      )?.list || []
    );
  }, [active]);
  const columns: any = useMemo(() => {
    const extra = [];
    if (active === '3') {
      extra.push(
        {
          title: '创建人',
          dataIndex: 'CREAT_NAME',
        },
        {
          title: '更新时间',
          dataIndex: 'UPDATE_TIME',
          key: 'address',
        },
        {
          title: '操作',
          dataIndex: 'other',
          width: 200,
        },
      );
    }
    return [
      {
        title: '序号',
        dataIndex: 'name',
        width: 60,
        render: (_key: any, _record: any, index: number) => {
          return index + 1;
        },
      },
      {
        title: '页面名称',
        dataIndex: 'name',
      },
      {
        title: '组件类型',
        dataIndex: 'type',
        render: (text: any) => {
          return text ?? '自定义组件';
        },
      },

      ...extra,
    ];
  }, [active]);

  return (
    <>
      <Card
        className="CompWrap"
        tabList={[
          { tab: '系统组件', key: '1' },
          { tab: '图表组件', key: '2' },
          { tab: '自定义组件', key: '3' },
        ]}
        defaultActiveTabKey={'1'}
        activeTabKey={active}
        onTabChange={(k) => {
          setActive(k);
        }}
        tabBarExtraContent={<>{active == '3' && <CreatIfream title={'新增组件'} />}</>}>
        <Table
          className="ListWrap"
          columns={columns}
          rowKey={(record) => {
            return record.name + record.i;
          }}
          scroll={{ y: 600 }}
          pagination={false}
          dataSource={DataSource}
        />
      </Card>
    </>
  );
};

export default Index;
