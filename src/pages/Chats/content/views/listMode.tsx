import React, { useState } from 'react';
import { ISession } from '@/ts/core';
import { Badge, Dropdown, List, Tag, Typography } from 'antd';
import css from '../index.module.less';
import { showChatTime } from '@/utils/tools';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { loadChatOperation } from './common';
const { Text } = Typography;

const ListMode = ({
  chats,
  select,
  sessionOpen,
}: {
  chats: ISession[];
  select: ISession | undefined;
  sessionOpen: (file: ISession | undefined, dblclick: boolean) => void;
}) => {
  const [cxtItem, setCxtItem] = useState<ISession>();
  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={chats}
      renderItem={(item: ISession) => {
        const style: any = {};
        if (select?.id === item.id) {
          style.backgroundColor = '#e6f1ff';
        }
        return (
          <div className={css.book_ul} style={style}>
            <Dropdown
              menu={{ items: loadChatOperation(cxtItem) }}
              trigger={['contextMenu']}>
              <List.Item
                className={css.book_item}
                extra={
                  <Text type="secondary">
                    {item.chatdata.lastMessage
                      ? showChatTime(item.chatdata.lastMessage?.createTime)
                      : ''}
                  </Text>
                }
                onContextMenu={() => setCxtItem(item)}
                onClick={() => {
                  sessionOpen(item, false);
                }}
                onDoubleClick={() => {
                  sessionOpen(item, true);
                }}>
                <List.Item.Meta
                  avatar={
                    <Badge count={item.chatdata.noReadCount} size="small">
                      <TeamIcon entity={item.metadata} size={40} />
                    </Badge>
                  }
                  title={
                    <div>
                      <span style={{ marginRight: 10 }}>{item.chatdata.chatName}</span>
                      {item.chatdata.labels
                        .filter((i) => i.length > 0)
                        .map((label) => {
                          return (
                            <Tag key={label} color={label === '置顶' ? 'red' : 'success'}>
                              {label}
                            </Tag>
                          );
                        })}
                    </div>
                  }
                  description={
                    <>
                      {item.chatdata.mentionMe && (
                        <span style={{ color: 'red' }}>[有人@我]</span>
                      )}
                      <span>{item.information}</span>
                    </>
                  }></List.Item.Meta>
              </List.Item>
            </Dropdown>
          </div>
        );
      }}
    />
  );
};
export default ListMode;
