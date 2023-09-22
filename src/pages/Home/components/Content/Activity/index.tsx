import { Col, Row } from 'antd';
import React, { useEffect } from 'react';

import cls from './index.module.less';

const Index: React.FC = () => {
  useEffect(() => {}, []);

  return (
    <Row gutter={[24, 24]} className={cls.content}>
      <Col span={12}></Col>
      <Col span={12}></Col>
    </Row>
  );
};

export default Index;
