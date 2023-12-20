import React, { useState } from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Input } from 'antd';
import { ImSearch } from 'react-icons/im';
<<<<<<< HEAD
=======
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
>>>>>>> fba29b5bf6084e336c5d8988fd86ed97535f91a3

const Setting: React.FC<any> = () => {
  const [filter, setFilter] = useState('');
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() => {
    return {
      key: 'disk',
      label: '沟通',
      itemType: 'Tab',
      children: [],
      icon: <OrgIcons chat selected />,
    };
  });

  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      rightShow
<<<<<<< HEAD
=======
      leftShow={false}
>>>>>>> fba29b5bf6084e336c5d8988fd86ed97535f91a3
      previewFlag={'chat'}
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
