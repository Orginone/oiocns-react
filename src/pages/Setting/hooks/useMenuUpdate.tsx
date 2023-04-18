import userCtrl from '@/ts/controller/setting';
import { findMenuItemByKey } from '@/utils/tools';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
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
  MenuItemType[],
  () => void,
  MenuItemType | undefined,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();
  /** 刷新菜单 */
  const refreshMenu = async () => {
    const children = [await operate.getUserMenu(), await operate.getTeamMenu()];
    const newMenus = [
      {
        key: '设置',
        label: '设置',
        itemType: 'Tab',
        children: children,
      } as MenuItemType,
    ];
    var item = findMenuItemByKey(children, userCtrl.currentKey);
    if (item === undefined) {
      item = children[0];
    }
    userCtrl.currentKey = item.key;
    setSelectMenu(item);
    setMenus(newMenus);
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
  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
