import { Card, Empty, List, Tag } from 'antd';
import React from 'react';
import { IChat, MessageType } from '@/ts/core';
import chatCtrl from '@/ts/controller/chat';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { WechatOutlined } from '@ant-design/icons';

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC<any> = ({ belongId }: { belongId: string }) => {
  const chats = chatCtrl.chats
    .filter((item) => {
      return belongId === '' || item.spaceId === belongId;
    })
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
          renderItem={(item: IChat) => (
            <List.Item
              style={{ cursor: 'pointer' }}
              onClick={async () => {
                await chatCtrl.setCurrent(item);
              }}
              actions={[
                <a
                  key="打开会话"
                  title="打开会话"
                  onClick={async () => {
                    await chatCtrl.setCurrent(item);
                  }}>
                  <WechatOutlined style={{ fontSize: 18 }}></WechatOutlined>
                </a>,
              ]}>
              <List.Item.Meta
                avatar={<TeamIcon share={item.shareInfo} size={40} fontSize={40} />}
                title={
                  <div>
                    <span style={{ marginRight: 10 }}>{item.target.name}</span>
                    <Tag color="success">{item.target.label}</Tag>
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
          )}
        />
      )}

      {chatCtrl.chats.length == 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
    </Card>
  );
};
export default Book;
