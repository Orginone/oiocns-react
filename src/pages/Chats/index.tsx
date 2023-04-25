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
          case '打开会话':
            setSelectMenu(data);
            break;
          case '置顶会话':
            (data.item! as IChat).isToping = true;
            setSelectMenu(data);
            break;
          case '取消置顶':
            (data.item! as IChat).isToping = false;
            setSelectMenu(data);
            break;
          case '清空消息':
            await (data.item! as IChat).clearMessage();
            break;
          // case '删除会话':
          //   chatCtrl.deleteChat(data.item);
          //   break;
          case '会话详情':
            setOpenDetail(!openDetail);
            break;
          // case '标记为未读':
          //   if (chatCtrl.chat) {
          //     chatCtrl.chat.noReadCount = 1;
          //     chatCtrl.changCallback();
          //   }
          //   break;
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
