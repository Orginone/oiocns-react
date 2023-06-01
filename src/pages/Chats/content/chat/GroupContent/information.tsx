import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMessage } from '@/ts/core';
import css from './index.module.less';
import { Drawer, Tabs } from 'antd';
import React, { useState } from 'react';
import { showChatTime } from '@/utils/tools';
import type { TabsProps } from 'antd';
import orgCtrl from '@/ts/controller'

const Information = ({ msg, onClose }: { msg: IMessage; onClose: Function }) => {
  const [tabsKey, setTabsKey] = useState<string>();
  // 展示已读的
  const readList = () => {
    return (
      <ul className={css.moreInfo}>
        {msg.labels.map((i) => {
          return (
            <li key={i.time}>
              <EntityIcon share={i.labeler} fontSize={22} size={30} />
              <strong>{i.labeler.name}</strong>
              <div>
                <span>{showChatTime(i.time)}:</span>
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
    const unreadList = msg._chat.members?.filter((v) => {
      console.log('成员1', orgCtrl.provider.user?.findShareById(v.id));
      if (msg.labels.length > 0) {
        return msg?.labels?.find((prop) => prop.userId !== v.id);
      } else {
        console.log('成员', v);

        return v;
      }
    });
    return (
      <ul className={css.moreInfo}>
        {unreadList
          ?.filter((code) => code.id !== msg._chat.userId)
          .map((i) => {
            return (
              <li key={i.time}>
                <EntityIcon share={i.icon} fontSize={22} size={30} />
                <strong>{i.name}</strong>
                <div>
                  <strong>{i.label}</strong>
                </div>
              </li>
            );
          })}
      </ul>
    );
  };

  const items: TabsProps['items'] = [
    { key: 'read', label: '已读', children: readList() },
    { key: 'Unread', label: '未读', children: unRead() },
  ];

  return (
    <Drawer title={'消息标记信息'} onClose={() => onClose()} closable open>
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
