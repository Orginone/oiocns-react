import { IconFont } from '@/components/IconFont';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import React, { useEffect } from 'react';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';

const Todo: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  useEffect(() => {
    refreshMenu();
    todoCtrl.loadWorkTodo();
  }, [userCtrl.space.id]);

  if (!selectMenu) return <></>;

  return (
    <MainLayout
      title={{ label: '办事', icon: <IconFont type={'icon-todo'} /> }}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        todoCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {}}
      siderMenuData={menus}>
      <Content key={key} selectMenu={selectMenu} reflashMenu={refreshMenu} />
    </MainLayout>
  );
};

export default Todo;
