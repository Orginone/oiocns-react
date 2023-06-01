import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMessage } from '@/ts/core';
import css from './index.module.less';
import { Drawer, Tabs } from 'antd';
import React, { useState } from 'react';
import { formatZhDate } from '@/utils/tools';
import type { TabsProps } from 'antd';

const Information = ({ msg, onClose }: { msg: IMessage; onClose: Function }) => {
  const [tabsKey, setTabsKey] = useState<string>();
  const unreadInfo = msg.unreadInfo;
  // 展示已读的
  const readList = () => {
    return (
      <ul className={css.moreInfo}>
        {msg.labels.map((i) => {
          return (
            <li key={i.time}>
              <EntityIcon share={i.labeler} fontSize={30} size={30} />
              <strong style={{ marginLeft: 6 }}>{i.labeler.name}</strong>
              <div>
                <span>{formatZhDate(i.time)}:</span>
                <strong>{i.label}</strong>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // 展示未读
  const unRead = () => {
    return (
      <ul className={css.moreInfo}>
        {unreadInfo.map((i) => {
          return (
            <li key={i.name}>
              <EntityIcon share={i} fontSize={30} size={30} />
              <strong style={{ marginLeft: 6 }}>{i.name}</strong>
            </li>
          );
        })}
      </ul>
    );
  };

  const items: TabsProps['items'] = [
    { key: 'read', label: `已读(${msg.readedIds.length})`, children: readList() },
    {
      key: 'unRead',
      label: `未读(${unreadInfo.length})`,
      children: unRead(),
    },
  ];

  return (
    <Drawer title={'消息接收人列表'} onClose={() => onClose()} closable open>
      <Tabs
        items={items}
        defaultActiveKey={'read'}
        activeKey={tabsKey}
        onChange={(e) => setTabsKey(e)}
      />
    </Drawer>
  );
};
export default Information;
