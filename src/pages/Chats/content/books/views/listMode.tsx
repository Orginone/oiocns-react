import React from 'react';
import { IMsgChat } from '@/ts/core';
import { Badge, Checkbox, Dropdown, List, Tag, Typography } from 'antd';
import css from '../index.module.less';
import { showChatTime } from '@/utils/tools';
import SuperMsgs from '@/ts/core/chat/message/supermsg';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import { selectChange, loadChatOperation } from './common';
const { Text } = Typography;

const ListMode = ({
  chats,
  isSupervise,
}: {
  chats: IMsgChat[];
  isSupervise: boolean;
}) => {
  let selectMenus: string[] = [];
  return (
    <List
      className="demo-loadmore-list"
      itemLayout="horizontal"
      dataSource={chats}
      renderItem={(item: IMsgChat) => {
        return (
          <div className={css.book_ul}>
            {isSupervise ? (
              <Checkbox
                className={css.check}
                defaultChecked={SuperMsgs.chatIds.includes(item.chatId)}
                key={item.key}
                onChange={(e) => {
                  selectMenus = selectChange(
                    e,
                    item.chatId,
                    SuperMsgs.chatIds,
                    selectMenus,
                  );
                }}
              />
            ) : (
              ''
            )}
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
                      <TeamIcon typeName={item.typeName} entityId={item.id} size={40} />
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
