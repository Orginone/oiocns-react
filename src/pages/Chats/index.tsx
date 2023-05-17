import React, { useState } from 'react';
import Content from './content';
import * as config from './config/menuOperate';
import MainLayout from '@/components/MainLayout';
import Supervise from './components/Supervise';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Input } from 'antd';
import { ImSearch } from 'react-icons/im';
import { IMsgChat, msgChatNotify } from '@/ts/core';
import { flatten } from './commont';
const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [isSupervise, setIsSupervise] = useState<boolean>(false); // 查看所有会话
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadChatMenu);

  if (!selectMenu || !rootMenu) return <></>;
  [selectMenu].map((res) => {
    // console.log(flatten(res.children));
  });
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      rightBar={
        <Input
          style={{ height: 30, fontSize: 15 }}
          placeholder="搜索"
          prefix={<ImSearch />}
          onChange={(e) => {
            setFilter(e.target.value);
          }}
        />
      }
      onMenuClick={async (data, key) => {
        const chat = data.item as IMsgChat;
        switch (key) {
          case '查看会话':
            setIsSupervise(!isSupervise);
            break;
          case '清空消息':
            await chat.clearMessage();
            break;
          case '会话详情':
            setOpenDetail(!openDetail);
            break;
          case '标记为未读':
            setSelectMenu(rootMenu);
            chat.chatdata.noReadCount += 1;
            msgChatNotify.changCallback();
            break;
        }
      }}
      siderMenuData={rootMenu}>
      {isSupervise ? (
        <Supervise belong={selectMenu.company!} />
      ) : (
        <Content
          key={key}
          belong={selectMenu.company!}
          selectMenu={selectMenu}
          openDetail={openDetail}
          filter={filter}
        />
      )}
    </MainLayout>
  );
};

export default Setting;
