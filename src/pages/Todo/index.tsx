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
      onMenuClick={async (data, key) => {
        // if (key == '设为常用') {
        //   let menu_ = data;
        //   menu_.key = 'copy' + data.key;
        //   menu_.children = [];
        //   menu_.menus = data.menus?.filter((m: any) => !m.key.includes('常用'));
        //   menu_.menus?.push({
        //     key: '取消常用',
        //     label: '取消常用',
        //     icon: <im.ImHeartBroken />,
        //   });
        //   todoCtrl.setCommon(menu_, true);
        //   message.success('设置成功');
        // } else if (key == '取消常用') {
        //   todoCtrl.setCommon(data, false);
        //   message.success('取消成功');
        // }
      }}
      siderMenuData={menus}>
      <Content key={key} selectMenu={selectMenu} reflashMenu={refreshMenu} />
    </MainLayout>
  );
};

export default Todo;
