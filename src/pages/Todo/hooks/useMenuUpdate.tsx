import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { emitter } from '@/ts/core';
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
  MenuItemType,
  () => void,
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<MenuItemType>({
    key: 'work',
    label: '办事',
    itemType: 'group',
    icon: <SettingOutlined />,
    children: [],
  });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>(menus);

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
    const children: MenuItemType[] = await operate.loadPlatformMenu();
    children.push(await operate.loadApplicationMenu());
    setMenu({
      key: 'work',
      label: '办事',
      itemType: 'group',
      icon: <SettingOutlined />,
      children: children,
    });
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
