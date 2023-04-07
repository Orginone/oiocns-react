import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { emitter, WorkType } from '@/ts/core';
import { findMenuItemByKey } from '@/utils/tools';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  string,
  MenuItemType[],
  () => void,
  MenuItemType | undefined,
  (items: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<MenuItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const newMenus = [
      {
        key: '待办',
        label: '待办',
        itemType: 'Tab',
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
      {
        key: '发起',
        label: '发起',
        itemType: 'Tab',
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
    ];
    var item = findMenuItemByKey(newMenus, todoCtrl.currentKey);
    if (item === undefined) {
      item = newMenus[0].children[0];
    }
    todoCtrl.currentKey = item.key;
    setSelectMenu(item);
    setMenu(newMenus);
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
