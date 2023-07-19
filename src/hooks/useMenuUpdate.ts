import orgCtrl, { Controller } from '@/ts/controller';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { findMenuItemByKey } from '@/utils/tools';
import { generateUuid } from '@/ts/base/common';
/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */

const useMenuUpdate = (
  loadMenu: () => MenuItemType,
  controller?: Controller,
): [
  string,
  MenuItemType | undefined,
  MenuItemType | undefined,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [rootMenu, setRootMenu] = useState<MenuItemType>();
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();
  const ctrl = controller || orgCtrl;

  /** 刷新菜单 */
  const refreshMenu = () => {
    setKey(generateUuid());
    const newMenus = loadMenu();
    var item = findMenuItemByKey(newMenus, ctrl.currentKey);
    if (item === undefined) {
      item = newMenus;
    }
    ctrl.currentKey = item.key;
    setSelectMenu(item);
    setRootMenu(newMenus);
  };

  /** 选中菜单 */
  const onSelectMenu = (item: MenuItemType | string) => {
    if (typeof item === 'string') {
      ctrl.currentKey = item;
    } else {
      ctrl.currentKey = item.key;
    }
    refreshMenu();
  };

  useEffect(() => {
    const id = ctrl.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      ctrl.unsubscribe(id);
    };
  }, []);
  return [key, rootMenu, selectMenu, onSelectMenu];
};

export default useMenuUpdate;
