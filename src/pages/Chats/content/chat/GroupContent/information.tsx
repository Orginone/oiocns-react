import { IMessage, IMessageLabel } from '@/ts/core';
import { Drawer, List, Tabs } from 'antd';
import React, { useState } from 'react';
import TeamIcon from '@/components/Common/GlobalComps/entityIcon';
import { showChatTime } from '@/utils/tools';
import type { TabsProps } from 'antd';

const Information = ({ msg, onClose }: { msg: IMessage; onClose: Function }) => {
  const [tabsKey, setTabsKey] = useState<string>();
  const unreadInfo = msg.unreadInfo;
  // 展示已读的
  const readList = () => {
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={msg.labels}
        renderItem={loadLabelItem}
      />
    );
  };

  // 展示未读
  const unRead = () => {
    return (
      <List
        className="demo-loadmore-list"
        itemLayout="horizontal"
        dataSource={msg.unreadInfo}
        renderItem={loadLabelItem}
      />
    );
  };

  const loadLabelItem = (item: IMessageLabel) => {
    return (
      <List.Item
        style={{ cursor: 'pointer', padding: 6 }}
        actions={
          item.time.length > 0
            ? [<div key={item.time}>{showChatTime(item.time)}</div>]
            : []
        }>
        <List.Item.Meta
          avatar={<TeamIcon entityId={item.userId} size={42} />}
          title={<strong>{item.labeler.name}</strong>}
          description={item.label}
        />
      </List.Item>
    );
  };

  const items: TabsProps['items'] = [
    {
      key: 'unRead',
      label: `未读(${unreadInfo.length})`,
      children: unRead(),
    },
    { key: 'read', label: `已读(${msg.readedIds.length})`, children: readList() },
  ];

  return (
    <Drawer title={'消息接收人列表'} onClose={() => onClose()} closable open>
      <Tabs
        centered
        items={items}
        defaultActiveKey={'unRead'}
        activeKey={tabsKey}
        onChange={(e) => setTabsKey(e)}
      />
    </Drawer>
  );
};
export default Information;
