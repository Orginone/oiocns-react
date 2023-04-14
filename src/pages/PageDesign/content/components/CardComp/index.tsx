import React from 'react';
import { Card, Col, Row, Tag } from 'antd';
import './index.less';
import Meta from 'antd/lib/card/Meta';
import pageCtrl from '@/pages/PageDesign/pageCtrl';
import { CompTypeItem } from '../../list/funs';

interface CardCompType {
  type?: string;
}
const Index: React.FC<CardCompType> = ({ type }) => {
  const list: CompTypeItem[] =
    pageCtrl.dataSource.find((v) => v.title === type)?.list || [];
  console.log('type', type, list);

  return (
    <>
      <Row gutter={[10, 10]}>
        {list?.map((item: any, idx: number) => {
          return (
            <Col span={6} key={item.i}>
              <Card title={item.name} extra={<span>序号：{idx + 1}</span>}>
                <Meta
                  title={<Tag color="#55acee">{type}</Tag>}
                  description={item.remark ?? '--'}
                />
              </Card>
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default Index;
