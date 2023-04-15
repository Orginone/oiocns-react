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

  return (
    <MainLayout
      title={{ label: '办事', icon: <IconFont type={'icon-todo'} /> }}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      checkedList={[]}
      onTabChanged={(key) => {
        let menu = menus.find((a) => a.key == key)?.menu;
        if (menu) {
          setSelectMenu(menu);
        }
      }}
      tabKey={'1'}
      onCheckedChange={(checkedList: any[]) => {}}
      siderMenuData={menus[0]?.menu}
      tabs={menus}>
      <Content key={key} selectMenu={selectMenu} reflashMenu={refreshMenu} />
    </MainLayout>
  );
};

export default Todo;
