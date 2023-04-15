import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { emitter, WorkType } from '@/ts/core';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType, TabItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  string,
  TabItemType[],
  () => void,
  MenuItemType,
  (items: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<TabItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: 'todo',
    label: '待办',
    itemType: 'group',
    icon: <SettingOutlined />,
    children: [],
  });

  /** 刷新菜单 */
  const refreshMenu = async () => {
    setMenu([
      {
        key: '1',
        label: '待办',
        menu: {
          key: 'todo',
          label: '待办',
          itemType: 'group',
          icon: <SettingOutlined />,
          children: [
            ...(await operate.loadPlatformTodoMenu()),
            {
              key: 'todoWork',
              label: '事项',
              itemType: WorkType.WorkTodo,
              icon: <SettingOutlined />,
              count: (await todoCtrl.loadWorkTodo()).length,
              children: [],
            },
          ],
        },
      },
      {
        key: '2',
        label: '发起',
        menu: {
          key: 'work',
          label: '发起',
          itemType: 'group',
          icon: <SettingOutlined />,
          children: [
            ...(await operate.loadPlatformApplyMenu()),
            {
              key: '办事项',
              label: '办事项',
              itemType: 'group',
              icon: <SettingOutlined />,
              children: await operate.loadThingMenus('work'),
            },
          ],
        },
      },
    ]);
  };

  useEffect(() => {
    const id = todoCtrl.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      emitter.unsubscribe(id);
    };
  }, []);
  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
