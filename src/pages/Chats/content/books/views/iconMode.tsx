import { Dropdown, Card, Typography, Badge } from 'antd';

import React from 'react';
import cls from './less/icon.module.less';
import { ISession } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import { loadChatOperation } from './common';

const IconMode = ({
  chats,
  select,
  sessionOpen,
}: {
  chats: ISession[];
  select: ISession | undefined;
  sessionOpen: (file: ISession | undefined, dblclick: boolean) => void;
}) => {
  const FileCard = (item: ISession) => (
    <Dropdown menu={{ items: loadChatOperation(item) }} trigger={['contextMenu']}>
      <Card
        size="small"
        className={select?.id === item.id ? cls.fileCard_select : cls.fileCard}
        bordered={false}
        key={item.key}
        onClick={async () => {
          await sessionOpen(item, false);
        }}
        onDoubleClick={async () => {
          await sessionOpen(item, true);
        }}
        onContextMenu={(e) => {
          e.stopPropagation();
        }}>
        <div className={cls.fileImage}>
          <Badge count={item.chatdata.noReadCount} size="small">
            {item.chatdata.isToping && <Badge status="error" />}
            <EntityIcon entity={item.metadata} size={50} />
          </Badge>
        </div>
        <div className={cls.fileName} title={item.name}>
          <Typography.Text title={item.name} ellipsis>
            {item.name}
          </Typography.Text>
        </div>
        <div className={cls.fileName} title={item.typeName}>
          <Typography.Text
            style={{ fontSize: 12, color: '#888' }}
            title={item.typeName}
            ellipsis>
            {item.typeName}
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
