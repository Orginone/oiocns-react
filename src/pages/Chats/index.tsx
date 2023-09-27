import React, { useState } from 'react';
import Content from './content';
import * as config from './config/menuOperate';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Input } from 'antd';
import { ImSearch } from '@/icons/im';
import { ISession } from '@/ts/core';
import { command } from '@/ts/base';

const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadChatMenu);

  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      menusHeight={'calc(100vh - 168px)'}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      rightBar={
        <Input
          style={{ height: 30, fontSize: 15 }}
          placeholder="搜索"
          allowClear
          prefix={<ImSearch />}
          onChange={(e) => {
            setFilter(e.target.value);
          }}></Input>
      }
      onMenuClick={async (data, key) => {
        const chat = data.item as ISession;
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
            command.emitterFlag('session');
            break;
        }
      }}
      siderMenuData={rootMenu}>
      <Content
        key={key}
        belong={selectMenu.company!}
        selectMenu={selectMenu}
        openDetail={openDetail}
        filter={filter}
      />
    </MainLayout>
  );
};

export default Setting;
