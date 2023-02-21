import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { emitter } from '@/ts/core';
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
  // MenuItemType,
  TabItemType[],
  () => void,
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<TabItemType[]>([]);
  // const [menus, setMenu] = useState<MenuItemType>({
  //   key: 'work',
  //   label: '办事',
  //   itemType: 'group',
  //   icon: <SettingOutlined />,
  //   children: [],
  // });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: 'work',
    label: '办事',
    itemType: 'group',
    icon: <SettingOutlined />,
    children: [],
  });

  /** 查找菜单 */
  const findMenuItemByKey: any = (items: MenuItemType[], key: string) => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      } else if (Array.isArray(item.children)) {
        const find = findMenuItemByKey(item.children, key);
        if (find) {
          return find;
        }
      }
    }
    return undefined;
  };
  /** 刷新菜单 */
  const refreshMenu = async () => {
    const todoMenus: MenuItemType[] = await operate.loadPlatformMenu();
    let appMenu: MenuItemType = await operate.loadApplicationMenu();
    let menus = [];
    menus.push(
      {
        key: '1',
        label: '办事',
        menu: {
          key: 'work',
          label: '办事',
          itemType: 'group',
          icon: <SettingOutlined />,
          children: [appMenu],
        },
      },
      {
        key: '2',
        label: '待办',
        menu: {
          key: 'todo',
          label: '待办',
          itemType: 'group',
          icon: <SettingOutlined />,
          children: todoMenus,
        },
      },
    );
    setMenu(menus);
    let children = [];
    switch (todoCtrl.tabIndex) {
      case '1':
        children = [appMenu];
        break;
      default:
        children = todoMenus;
        break;
    }
    const item: MenuItemType | undefined = findMenuItemByKey(
      children,
      todoCtrl.currentKey,
    );
    if (item) {
      setSelectMenu(item);
    } else {
      todoCtrl.currentKey = children[0].key;
      setSelectMenu(children[0]);
    }
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
