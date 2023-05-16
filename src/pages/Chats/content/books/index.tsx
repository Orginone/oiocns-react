import { Badge, Card, Empty, List, Tag } from 'antd';
import React from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { AiOutlineWechat } from 'react-icons/ai';
import useCtrlUpdate from '@/hooks/useCtrlUpdate';
import { IMsgChat, MessageType, msgChatNotify } from '@/ts/core';
import { filetrText } from '../chat/GroupContent/common';

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<any> = ({
  chats,
  filter,
}: {
  chats: IMsgChat[];
  filter: string;
}) => {
  const [msgKey] = useCtrlUpdate(msgChatNotify);
  if (chats === undefined) {
    chats = orgCtrl.chat.chats.filter((i) => i.isMyChat);
  }
  chats = chats
    .filter(
      (a) =>
        a.chatdata.chatName.includes(filter) ||
        a.chatdata.chatRemark.includes(filter) ||
        a.chatdata.labels.filter((l) => l.includes(filter)).length > 0,
    )
    .sort((a, b) => {
      const num = (b.chatdata.isToping ? 10 : 0) - (a.chatdata.isToping ? 10 : 0);
      if (num === 0) {
        return b.chatdata.lastMsgTime > a.chatdata.lastMsgTime ? 1 : -1;
      }
      return num;
    });
  const showMessage = (chat: IMsgChat) => {
    if (chat.chatdata.lastMessage) {
      let text = '最新消息[' + chat.chatdata.lastMessage.createTime + ']:';
      if (chat.chatdata.lastMessage.msgType === MessageType.Text) {
        // return text + chat.chatdata.lastMessage.showTxt;
        return text + filetrText(chat.chatdata.lastMessage);
      }
      return text + '[' + chat.chatdata.lastMessage.msgType + ']';
    }
    return '简介信息:' + chat.chatdata.chatRemark;
  };
  return (
    <Card key={msgKey}>
      {chats.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={chats}
          renderItem={(item: IMsgChat) => {
            return (
              <List.Item
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  orgCtrl.currentKey = item.chatdata.fullId;
                  orgCtrl.changCallback();
                }}
                actions={[
                  <a
                    key="打开会话"
                    title="打开会话"
                    onClick={async () => {
                      orgCtrl.currentKey = item.chatdata.fullId;
                      orgCtrl.changCallback();
                    }}>
                    <AiOutlineWechat style={{ fontSize: 18 }}></AiOutlineWechat>
                  </a>,
                ]}>
                <List.Item.Meta
                  avatar={
                    <Badge
                      count={item.chatdata.noReadCount}
                      overflowCount={99}
                      size="small">
                      <TeamIcon share={item.share} size={40} fontSize={40} />
                    </Badge>
                  }
                  title={
                    <div>
                      <span style={{ marginRight: 10 }}>{item.chatdata.chatName}</span>
                      {item.chatdata.labels
                        .filter((i) => i.length > 0)
                        .map((label) => {
                          return (
                            <Tag key={label} color="success">
                              {label}
                            </Tag>
                          );
                        })}
                    </div>
                  }
                  description={showMessage(item)}
                />
              </List.Item>
            );
          }}
        />
      )}

      {chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
  );
};
export default Book;
