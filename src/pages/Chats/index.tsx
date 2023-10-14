import React, { useState } from 'react';
import Content from './content';
import * as config from './config/menuOperate';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Input } from 'antd';
import { ImSearch } from '@/icons/im';

const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadChatMenu);

  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      previewFlag={'chat'}
      rightShow
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
      siderMenuData={rootMenu}>
      <Content key={key} chats={selectMenu.item} filter={filter} />
    </MainLayout>
  );
};

export default Setting;
