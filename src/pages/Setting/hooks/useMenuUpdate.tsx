import userCtrl from '@/ts/controller/setting';
import { findMenuItemByKey } from '@/utils/tools';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { SettingOutlined } from '@ant-design/icons';
import React from 'react';
/**
 * 设置菜单刷新hook
 * @returns key ,变更后的标识
 * menus 新的菜单,
 * refreshMenu 强制重新加载,
 * selectMenu 选中菜单,
 * setSelectMenu 设置选中
 */
const useMenuUpdate = (): [
  string,
  MenuItemType,
  () => void,
  MenuItemType | undefined,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [rootMenu, setRootMenu] = useState<MenuItemType>({
    key: '设置',
    label: '设置',
    itemType: 'Tab',
    children: [],
    icon: <SettingOutlined />,
  } as MenuItemType);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();
  /** 刷新菜单 */
  const refreshMenu = async () => {
    const newMenu = { ...rootMenu };
    newMenu.children = [await operate.getUserMenu(), ...(await operate.getTeamMenu())];
    var item = findMenuItemByKey(newMenu.children, userCtrl.currentKey);
    if (item === undefined) {
      item = newMenu;
    }
    userCtrl.currentKey = item.key;
    setSelectMenu(item);
    setRootMenu(newMenu);
  };

  useEffect(() => {
    const id = userCtrl.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);
  return [key, rootMenu, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
