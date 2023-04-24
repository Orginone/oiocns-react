import React, { useState } from 'react';
import Content from './content';
import * as config from './config/menuOperate';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import orgCtrl from '@/ts/controller';
import { IChat } from '@/ts/core/target/chat/ichat';
import { Input } from 'antd';
import { ImSearch } from 'react-icons/im';
const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadChatMenu);
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        orgCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      rightBar={
        <Input
          style={{ height: 30, fontSize: 15 }}
          placeholder="搜索"
          prefix={<ImSearch />}
          onChange={(e) => {
            setFilter(e.target.value);
          }}></Input>
      }
      onMenuClick={async (data, key) => {
        switch (key) {
          case '清空消息':
            await (data.item! as IChat).clearMessage();
            break;
          case '会话详情':
            setOpenDetail(!openDetail);
            break;
          case '标记为未读':
            setSelectMenu(rootMenu);
            (data.item! as IChat).noReadCount += 1;
            break;
        }
      }}
      siderMenuData={rootMenu}>
      <Content
        key={key}
        selectMenu={selectMenu}
        openDetail={openDetail}
        filter={filter}
      />
    </MainLayout>
  );
};

export default Setting;
