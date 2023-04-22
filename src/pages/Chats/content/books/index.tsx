import { Card, Empty, List, Tag } from 'antd';
import React from 'react';
import orgCtrl from '@/ts/controller';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { WechatOutlined } from '@ant-design/icons';
import { MessageType } from '@/ts/core';
import { IChat } from '@/ts/core/target/chat/ichat';

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<any> = ({ chats, filter }: { chats: IChat[]; filter: string }) => {
  if (chats === undefined) {
    chats = orgCtrl.user.allChats();
  }
  chats = chats
    .filter((a) => a.target.name.includes(filter))
    .sort((a, b) => {
      const num = (b.isToping ? 10 : 0) - (a.isToping ? 10 : 0);
      if (num === 0) {
        return b.lastMsgTime > a.lastMsgTime ? 1 : -1;
      }
      return num;
    });
  const showMessage = (chat: IChat) => {
    if (chat.lastMessage) {
      let text = '最新消息[' + chat.lastMessage.createTime + ']:';
      if (chat.lastMessage.msgType === MessageType.Text) {
        return text + chat.lastMessage.showTxt;
      }
      return text + '[' + chat.lastMessage.msgType + ']';
    }
    return '简介信息:' + chat.target.remark;
  };
  return (
    <Card>
      {chats.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={chats}
          renderItem={(item: IChat) => {
            return (
              <List.Item
                style={{ cursor: 'pointer' }}
                onClick={async () => {
                  orgCtrl.currentKey = item.fullId;
                  orgCtrl.changCallback();
                }}
                actions={[
                  <a
                    key="打开会话"
                    title="打开会话"
                    onClick={async () => {
                      orgCtrl.currentKey = item.fullId;
                      orgCtrl.changCallback();
                    }}>
                    <WechatOutlined style={{ fontSize: 18 }}></WechatOutlined>
                  </a>,
                ]}>
                <List.Item.Meta
                  avatar={<TeamIcon share={item.shareInfo} size={40} fontSize={40} />}
                  title={
                    <div>
                      <span style={{ marginRight: 10 }}>{item.target.name}</span>
                      {item.target.labels
                        .filter((i) => i.length > 0)
                        .map((label) => {
                          return (
                            <Tag key={label} color="success">
                              {label}
                            </Tag>
                          );
                        })}
                      {item.noReadCount > 0 && (
                        <Tag
                          style={{
                            color: 'white',
                            borderRadius: 6,
                            backgroundColor: '#ff4d4f',
                          }}>
                          {item.noReadCount}
                        </Tag>
                      )}
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
