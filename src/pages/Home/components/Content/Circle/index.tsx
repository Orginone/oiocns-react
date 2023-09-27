import React from 'react';
import { Col, Row } from 'antd';
import cls from './index.module.less';
import Activity from '@/components/Activity';
import orgCtrl from '@/ts/controller';

const Circle: React.FC = () => {
  return (
    <Row gutter={[24, 24]} style={{ padding: '0 36px' }}>
      <Col span={24} className={cls.content}>
        <Activity activity={orgCtrl.user.friendsActivity} title="好友圈"></Activity>
      </Col>
    </Row>
  );
};

export default Circle;
