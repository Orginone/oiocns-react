import { emitter } from '@/ts/core';
import { findMenuItemByKey } from '@/utils/tools';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { IconFont } from '@/components/IconFont';
import React from 'react';
import orgCtrl from '@/ts/controller/';

/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  string,
  MenuItemType,
  () => void,
  MenuItemType | undefined,
  (items: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [rootMenu, setRootMenu] = useState<MenuItemType>({
    key: '办事',
    label: '办事',
    itemType: 'Tab',
    children: [],
    icon: <IconFont type={'icon-todo'} />,
  });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const newMenus = { ...rootMenu };
    newMenus.children = await operate.loadWorkMenu();
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
      emitter.unsubscribe(id);
    };
  }, []);
  return [key, rootMenu, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
