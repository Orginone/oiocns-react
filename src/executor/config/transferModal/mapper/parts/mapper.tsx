import { IMapping } from '@/ts/core/thing/config';
import { Col, Layout, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import Center from './center';
import Fields from './fields';
import { Controller } from '@/ts/controller';

interface IProps {
  current: IMapping;
  ctrl: Controller;
}

const Mapper: React.FC<IProps> = ({ current, ctrl }) => {
  return (
    <Layout>
      <Content>
        <Row>
          <Col span={6}>
            <Fields
              current={current}
              targetForm={'sourceForm'}
              targetAttrs={'sourceAttrs'}
              targetAttr={'source'}
            />
          </Col>
          <Col span={6}>
            <Fields
              current={current}
              targetForm={'targetForm'}
              targetAttrs={'targetAttrs'}
              targetAttr={'target'}
            />
          </Col>
          <Col span={12}>
            <Center current={current} ctrl={ctrl} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Mapper;
