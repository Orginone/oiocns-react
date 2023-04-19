import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { emitter } from '@/ts/core';
import { findMenuItemByKey } from '@/utils/tools';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import userCtrl from '@/ts/controller/setting';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  string,
  MenuItemType[],
  () => void,
  MenuItemType | undefined,
  (items: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<MenuItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const children: MenuItemType[] = [await operate.getUserMenu(userCtrl.user)];
    for (const company of await userCtrl.user.getJoinedCompanys()) {
      children.push(await operate.getUserMenu(company));
    }
    const newMenus = [
      {
        key: '办事',
        label: '',
        itemType: 'Tab',
        children: children,
      },
    ];
    var item = findMenuItemByKey(children, todoCtrl.currentKey);
    if (item === undefined) {
      item = newMenus[0].children[0];
    }
    todoCtrl.currentKey = item.key;
    setSelectMenu(item);
    setMenu(newMenus);
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
