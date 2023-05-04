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
  const refreshMenu = async () => {
    const newMenus = await loadMenu();
    var item = findMenuItemByKey(newMenus, orgCtrl.currentKey);
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
  return [
    key,
    rootMenu,
    selectMenu,
    (item) => {
      orgCtrl.currentKey = item.key;
      setSelectMenu(item);
      refreshMenu();
    },
  ];
};

export default useMenuUpdate;
