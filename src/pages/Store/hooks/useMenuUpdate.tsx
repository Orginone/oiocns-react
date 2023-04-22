import orgCtrl from '@/ts/controller';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { findMenuItemByKey } from '@/utils/tools';
import { IconFont } from '@/components/IconFont';
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
  MenuItemType,
  () => void,
  MenuItemType | undefined,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [rootMenu, setRootMenu] = useState<MenuItemType>({
    key: '仓库',
    label: '仓库',
    itemType: 'group',
    icon: <IconFont type={'icon-store'} />,
    children: [],
  });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const newMenus = { ...rootMenu };
    newMenus.children = [await operate.getUserMenu(), ...(await operate.getTeamMenu())];
    var item = findMenuItemByKey(newMenus.children, orgCtrl.currentKey);
    if (item === undefined) {
      item = newMenus;
    }
    orgCtrl.currentKey = item.key;
    setSelectMenu(item);
    setRootMenu(newMenus);
  };

  useEffect(() => {
    const id = orgCtrl.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      orgCtrl.unsubscribe(id);
    };
  }, []);

  return [key, rootMenu, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
