import cls from './index.module.less';
import React, { useEffect } from 'react';
import HeadBanner from '@/pages/Home/components/HeadBanner';
import { Col, Row } from 'antd';

const Home: React.FC = () => {
  useEffect(() => {}, []);
  return (
    <div className={cls.homepage}>
      <HeadBanner
        backgroundImageUrl={'src/assets/img/activity-bg.png'}
        title="群动态"></HeadBanner>
      <Row>
        <Col span={12}>左边区域</Col>
        <Col span={12}>右边区域</Col>
      </Row>
    </div>
  );
};
export default Home;
