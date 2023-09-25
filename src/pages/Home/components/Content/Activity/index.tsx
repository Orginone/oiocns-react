import { Col, Row } from 'antd';
import React, { useEffect } from 'react';

import cls from './index.module.less';
import Activity from '@/components/Activity';
import orgCtrl from '@/ts/controller';

const Index: React.FC = () => {
  useEffect(() => {}, []);

  return (
    <Row
      gutter={[24, 24]}
      className={cls.content}
      style={{ height: '900px', overflowY: 'auto' }}>
      {orgCtrl.chats
        .filter((i) => i.isMyChat && i.isGroup)
        .map((i) => {
          return (
            <Col span={24} key={i.key}>
              <div style={{ overflowY: 'auto', height: '100%' }}>
                <Activity activity={i.activity} title={i.name + '群动态'}></Activity>
              </div>
            </Col>
          );
        })}
    </Row>
  );
};

export default Index;
