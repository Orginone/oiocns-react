import { Col, Row } from 'antd';
import React, { useState } from 'react';
import Activity from '@/components/Activity';
import orgCtrl from '@/ts/controller';
import cls from './index.module.less';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';

const Index: React.FC = () => {
  const [current, setCurrent] = useState(0);

  return (
    <Row className={cls.content}>
      <Col span={8} style={{ height: '100%' }}>
        <div className={cls.groupList}>
          {orgCtrl.chats
            .filter((i) => i.isMyChat && i.isGroup)
            .map((i, index) => {
              return (
                <div
                  className={cls.groupListItem}
                  key={i.key}
                  onClick={() => setCurrent(index)}>
                  <EntityIcon entityId={i.id} showName size={50}></EntityIcon>
                </div>
              );
            })}
        </div>
      </Col>
      <Col span={16} style={{ height: '100%' }}>
        {orgCtrl.chats
          .filter((i) => i.isMyChat && i.isGroup)
          .map((i, index) => {
            return index === current ? (
              <Activity
                key={i.key}
                activity={i.activity}
                title={i.name + '群动态'}></Activity>
            ) : (
              <></>
            );
          })}
      </Col>
    </Row>
  );
};

export default Index;
