import { Card, Empty, List, Tag } from 'antd';
import React from 'react';
import { IChat } from '@/ts/core';
import chatCtrl from '@/ts/controller/chat';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { WechatOutlined } from '@ant-design/icons';

/**
 * @description: 通讯录
 * @return {*}
 */

const Book: React.FC = () => {
  return (
    <Card>
      {chatCtrl.chats.length > 0 && (
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={chatCtrl.chats}
          renderItem={(item: IChat) => (
            <List.Item
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
                  </div>
                }
                description={item.target.remark}
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
