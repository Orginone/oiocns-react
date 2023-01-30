import storeCtrl from '@/ts/controller/store';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ImHome } from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
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
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<MenuItemType>({
    key: 'store',
    label: '仓库',
    itemType: 'group',
    icon: <ImHome />,
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
    const children: MenuItemType[] = [];
    children.push(operate.getAppliactionMenus());
    // children.push(operate.getAssetMenus());
    children.push(operate.getFileSystemMenus());
    let thingMenus = await operate.getThingMenus();
    children.push(thingMenus);
    setMenu({
      key: 'store',
      label: '仓库',
      itemType: 'group',
      icon: <ImHome />,
      children: children,
    });
    const item = findMenuItemByKey(children, storeCtrl.currentKey);
    if (item) {
      setSelectMenu(item);
    } else {
      storeCtrl.currentKey = children[0].key;
      setSelectMenu(children[0]);
    }
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
