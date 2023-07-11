import { Dropdown, Row, Col, Card, Typography, Badge, Tag } from 'antd';

import React from 'react';
import cls from './less/icon.module.less';
import { IMsgChat } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { loadChatOperation } from './common';

const IconMode = ({ chats }: { chats: IMsgChat[] }) => {
  const FileCard = (el: IMsgChat) => (
    <Dropdown menu={{ items: loadChatOperation(el) }} trigger={['contextMenu']}>
      <Card
        size="small"
        className={cls.fileCard}
        bordered={false}
        key={el.key}
        onDoubleClick={async () => {
          orgCtrl.currentKey = el.chatdata.fullId;
          orgCtrl.changCallback();
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={cls.fileImage}>
          <Badge count={el.chatdata.noReadCount} size="small">
            <EntityIcon entity={el.metadata} size={50} />
          </Badge>
        </div>
        <div className={cls.fileName} title={el.name}>
          <Typography.Text title={el.name} ellipsis>
            {el.name}
          </Typography.Text>
        </div>
        <div className={cls.fileName} title={el.typeName}>
          {el.chatdata.labels
            .filter((i) => i.length > 0)
            .map((label) => {
              return (
                <Tag key={label} color={label === '置顶' ? 'red' : 'success'}>
                  {label}
                </Tag>
              );
            })}
        </div>
      </Card>
    </Dropdown>
  );
  return (
    <div
      className={cls.content}
      onContextMenu={(e) => {
        e.stopPropagation();
      }}>
      <Row gutter={[16, 16]}>
        {chats.map((el) => {
          return (
            <Col xs={8} sm={8} md={6} lg={4} xl={3} xxl={2} key={el.key}>
              {FileCard(el)}
            </Col>
          );
        })}
      </Row>
    </div>
  );
};
export default IconMode;
