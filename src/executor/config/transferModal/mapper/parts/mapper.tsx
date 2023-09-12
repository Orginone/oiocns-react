import { MappingNode } from '@/ts/base/model';
import { ITransfer } from '@/ts/core';
import { Col, Layout, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React from 'react';
import Center from './center';
import Fields from './fields';

interface IProps {
  link: ITransfer;
  current: MappingNode;
}

const Mapper: React.FC<IProps> = ({ link, current }) => {
  return (
    <Layout style={{ marginTop: 10 }}>
      <Content>
        <Row>
          <Col span={6}>
            <Fields key={'source'} target={'source'} link={link} current={current} />
          </Col>
          <Col span={6}>
            <Fields key={'target'} target={'target'} link={link} current={current} />
          </Col>
          <Col span={12}>
            <Center key={'center'} link={link} current={current} />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default Mapper;
