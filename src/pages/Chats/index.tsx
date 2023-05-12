import React, { useState } from 'react';
import Content from './content';
import Supervise from './components/Supervise';
import * as config from './config/menuOperate';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Input, Button } from 'antd';
import { ImSearch } from 'react-icons/im';
import { orgAuth } from '@/ts/core/public/consts';
import { IMsgChat, msgChatNotify } from '@/ts/core';
const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [isSupervise, setIsSupervise] = useState<boolean>(false);
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadChatMenu);

  const changeSupervise = () => {
    setIsSupervise(false);
  };
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      rightBar={
        <React.Fragment>
          {selectMenu?.company?.hasAuthoritys([orgAuth.RelationAuthId]) ? (
            <React.Fragment>
              {isSupervise ? (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setIsSupervise(false);
                  }}>
                  沟通
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="small"
                  onClick={() => {
                    setIsSupervise(true);
                  }}>
                  监察
                </Button>
              )}
            </React.Fragment>
          ) : (
            ''
          )}
          <Input
            style={{ height: 30, fontSize: 15 }}
            placeholder="搜索"
            prefix={<ImSearch />}
            onChange={(e) => {
              setFilter(e.target.value);
            }}
          />
        </React.Fragment>
      }
      onMenuClick={async (data, key) => {
        const chat = data.item as IMsgChat;
        switch (key) {
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
        <Supervise
          key={key}
          selectMenu={selectMenu}
          current={selectMenu.company}
          changeSupervise={changeSupervise}
        />
      ) : (
        <Content
          key={key}
          selectMenu={selectMenu}
          openDetail={openDetail}
          filter={filter}
        />
      )}
    </MainLayout>
  );
};

export default Setting;
