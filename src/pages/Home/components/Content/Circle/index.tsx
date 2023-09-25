import React from 'react';
import { Col, Row } from 'antd';
import cls from './index.module.less';
import Activity from '@/components/Activity';
import orgCtrl from '@/ts/controller';

const Circle: React.FC = () => {
  return (
    <Row
      gutter={[24, 24]}
      className={cls.content}
      style={{ height: '900px', overflowY: 'auto' }}>
      <Col span={24}>
        <div style={{ overflowY: 'auto', height: '100%' }}>
          <Activity activity={orgCtrl.user.friendsActivity} title="好友圈"></Activity>
        </div>
      </Col>
    </Row>
  );
};

export default Circle;
