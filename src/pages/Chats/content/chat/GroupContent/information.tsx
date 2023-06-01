import EntityIcon from '@/bizcomponents/GlobalComps/entityIcon';
import { IMessage } from '@/ts/core';
import css from './index.module.less';
import { Drawer, Tabs } from 'antd';
import React, { useState } from 'react';
import { showChatTime } from '@/utils/tools';
import type { TabsProps } from 'antd';
import orgCtrl from '@/ts/controller';
import { ShareIcon } from '@/ts/base/model';
interface IMessageType extends IMessage {
  _chat: any;
}

interface TypeUnread {
  time: string;
  id: string;
  name: string;
  label: string;
}

const Information = ({ msg, onClose }: { msg: IMessageType; onClose: Function }) => {
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
    const unreadList = msg._chat.members?.filter((v: { id: string }) => {
      if (msg.labels.length === 0) {
        return v;
      } else {
        return msg?.labels?.find((prop) => prop.userId !== v.id);
      }
    });
    return (
      <ul className={css.moreInfo}>
        {unreadList
          ?.filter((code: { id: string }) => code.id !== msg._chat.userId)
          .map((i: TypeUnread) => {
            return (
              msg.labels.length !== msg._chat.members.length - 1 && (
                <li key={i.time}>
                  <EntityIcon
                    share={orgCtrl.provider.user?.findShareById(i.id) as ShareIcon}
                    fontSize={22}
                    size={30}
                  />
                  <strong>{i.name}</strong>
                  <div>
                    <strong>{i.label}</strong>
                  </div>
                </li>
              )
            );
          })}
      </ul>
    );
  };

  const items: TabsProps['items'] = [
    { key: 'read', label: `${msg.labels.length}人已读`, children: readList() },
    {
      key: 'Unread',
      label: `${msg._chat.members.length - msg.labels.length - 1}人未读`,
      children: unRead(),
    },
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
