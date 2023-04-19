import React, { useEffect, useMemo, useState } from 'react';
import { Card, Col, Row, Table, Tag } from 'antd';
import './index.less';
import pageCtrl from '@/pages/Setting/content/PageDesign/pageCtrl';
import CreatIfream from './addIfream';
interface CardCompType {}
const Index: React.FC<CardCompType> = () => {
  const [active, setActive] = useState<string>('1');
  useEffect(() => {
    pageCtrl.subscribePart('DataSource', () => {
      setTimeout(() => {
        console.log('777777', pageCtrl.dataSource);
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
  const columns: any = [
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
  ];

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
          pagination={false}
          dataSource={DataSource}
        />
        {/* <Row gutter={[10, 10]}>
          {(
            pageCtrl.dataSource.find(
              (v) => v.title === (active == '1' ? '系统组件' : '图形组件'),
            )?.list || []
          )?.map((item: any, idx: number) => {
            return (
              <Col span={6} key={item.i + '-' + idx}>
                <Card title={item.name} extra={<span>序号：{idx + 1}</span>}>
                  <Meta
                    title={
                      <Tag color="#55acee">{active == '1' ? '系统组件' : '图形组件'}</Tag>
                    }
                    description={item.remark ?? '--'}
                  />
                </Card>
              </Col>
            );
          })}
        </Row> */}
      </Card>
    </>
  );
};

export default Index;
