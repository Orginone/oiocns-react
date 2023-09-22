import React from 'react';
import { Col, Row } from 'antd';
import cls from './index.module.less';

const Circle: React.FC = () => {
  return (
    <Row gutter={[24, 24]} className={cls.content}>
      <Col span={12}></Col>
    </Row>
  );
};

export default Circle;
