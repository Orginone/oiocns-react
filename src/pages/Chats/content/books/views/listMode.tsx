import React from 'react';
import { ISession } from '@/ts/core';
import { Badge, Dropdown, List, Tag, Typography } from 'antd';
import css from '../index.module.less';
import { showChatTime } from '@/utils/tools';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { loadChatOperation } from './common';
const { Text } = Typography;

const ListMode = ({ chats }: { chats: ISession[] }) => {
  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={chats}
      renderItem={(item: ISession) => {
        return (
          <div className={css.book_ul}>
            <Dropdown menu={{ items: loadChatOperation(item) }} trigger={['contextMenu']}>
              <List.Item
                style={{ cursor: 'pointer' }}
                extra={
                  <Text type="secondary">
                    {item.chatdata.lastMessage
                      ? showChatTime(item.chatdata.lastMessage?.createTime)
                      : ''}
                  </Text>
                }
                onClick={() => {
                  orgCtrl.currentKey = item.chatdata.fullId;
                  orgCtrl.changCallback();
                }}>
                <List.Item.Meta
                  avatar={
                    <Badge count={item.chatdata.noReadCount} size="small">
                      <TeamIcon
                        typeName={item.metadata.typeName}
                        entityId={item.sessionId}
                        size={40}
                      />
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
