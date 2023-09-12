import { Dropdown, Card, Typography, Badge } from 'antd';

import React from 'react';
import cls from './less/icon.module.less';
import { ISession } from '@/ts/core';
import orgCtrl from '@/ts/controller';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { loadChatOperation } from './common';

const IconMode = ({ chats }: { chats: ISession[] }) => {
  const FileCard = (el: ISession) => (
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
            {el.chatdata.isToping && <Badge status="error" />}
            <EntityIcon entity={el.metadata} size={50} />
          </Badge>
        </div>
        <div className={cls.fileName} title={el.name}>
          <Typography.Text title={el.name} ellipsis>
            {el.name}
          </Typography.Text>
        </div>
        <div className={cls.fileName} title={el.typeName}>
          <Typography.Text
            style={{ fontSize: 12, color: '#888' }}
            title={el.typeName}
            ellipsis>
            {el.typeName}
          </Typography.Text>
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
      {chats.map((el) => FileCard(el))}
    </div>
  );
};
export default IconMode;
