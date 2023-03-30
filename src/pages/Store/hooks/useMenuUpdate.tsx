import storeCtrl from '@/ts/controller/store';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ImHome } from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { findMenuItemByKey } from '@/utils/tools';
/**
 * 仓库菜单刷新hook
 * @returns key 变更后的标识,
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

  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: '1',
    label: '仓库',
    itemType: 'group',
    icon: <ImHome />,
    children: [],
  });

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const adminMenus = await operate.loadAdminMenus();
    const stores = await operate.loadMarketMenus();
    const newMenus = [
      {
        key: '仓库',
        label: '仓库',
        itemType: 'Tab',
        children: adminMenus,
      },
      {
        key: '商店',
        label: '商店',
        itemType: 'Tab',
        children: stores,
      },
    ];
    var item = findMenuItemByKey(newMenus, storeCtrl.currentKey);
    if (item === undefined) {
      item = adminMenus[0];
    }
    storeCtrl.currentKey = item.key;
    setSelectMenu(item);
    setMenus(newMenus);
  };

  useEffect(() => {
    const id = storeCtrl.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      storeCtrl.unsubscribe(id);
    };
  }, []);

  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
