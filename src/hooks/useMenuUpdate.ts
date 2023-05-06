import orgCtrl from '@/ts/controller';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import { findMenuItemByKey } from '@/utils/tools';
/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */

const useMenuUpdate = (
  loadMenu: () => MenuItemType,
): [
  string,
  MenuItemType | undefined,
  MenuItemType | undefined,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [rootMenu, setRootMenu] = useState<MenuItemType>();
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = () => {
    setKey(key + '1');
    const newMenus = loadMenu();
    var item = findMenuItemByKey(newMenus, orgCtrl.currentKey);
    if (item === undefined) {
      item = newMenus;
    }
    orgCtrl.currentKey = item.key;
    setSelectMenu(item);
    setRootMenu(newMenus);
  };

  /** 选中菜单 */
  const onSelectMenu = (item: MenuItemType | string) => {
    if (typeof item === 'string') {
      orgCtrl.currentKey = item;
    } else {
      orgCtrl.currentKey = item.key;
    }
    refreshMenu();
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
  return [key, rootMenu, selectMenu, onSelectMenu];
};

export default useMenuUpdate;
