import { emitter } from '@/ts/core';
import chatCtrl from '@/ts/controller/chat';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { findMenuItemByKey } from '@/utils/tools';
import { IconFont } from '@/components/IconFont';
import React from 'react';
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
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [rootMenu, setRootMenu] = useState<MenuItemType>({
    key: '沟通',
    label: '沟通',
    itemType: 'Tab',
    children: [],
    icon: <IconFont type={'icon-message'} />,
  });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const newMenus = { ...rootMenu };
    newMenus.children = await operate.loadBookMenu();
    var item = findMenuItemByKey(newMenus.children, chatCtrl.currentKey);
    if (item === undefined) {
      item = newMenus;
    }
    chatCtrl.currentKey = item.key;
    setSelectMenu(item);
    setRootMenu(newMenus);
  };

  useEffect(() => {
    const id = chatCtrl.subscribe((key) => {
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
