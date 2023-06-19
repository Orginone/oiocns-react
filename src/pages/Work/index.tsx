import MainLayout from '@/components/MainLayout';
import React, { useState } from 'react';
import Content from './content';
import { ImSearch } from 'react-icons/im';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { loadWorkMenu } from './config/menuOperate';
import { Input } from 'antd';

const Todo: React.FC<any> = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(loadWorkMenu);
  const [filter, setFilter] = useState('');

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
          prefix={<ImSearch />}
          onChange={(e) => {
            setFilter(e.target.value);
          }}></Input>
      }
      siderMenuData={rootMenu}>
      <Content key={key} selectMenu={selectMenu} filter={filter} />
    </MainLayout>
  );
};

export default Todo;
