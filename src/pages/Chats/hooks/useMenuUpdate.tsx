import { emitter } from '@/ts/core';
import chatCtrl from '@/ts/controller/chat';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { findMenuItemByKey } from '@/utils/tools';
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
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenus] = useState<MenuItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    // const chats = operate.loadChatMenu();
    const books = await operate.loadBookMenu();
    const newMenus = [
      // {
      //   key: '会话',
      //   label: '会话',
      //   itemType: 'Tab',
      //   children: chats,
      // },
      {
        key: '沟通',
        label: '沟通',
        itemType: 'Tab',
        children: books,
      },
    ];
    var item = findMenuItemByKey(newMenus, chatCtrl.currentKey);
    if (item === undefined) {
      item = books[0];
    }
    chatCtrl.currentKey = item.key;
    setSelectMenu(item);
    setMenus(newMenus);
  };

  useEffect(() => {
    const id = chatCtrl.subscribe((key) => {
      if (chatCtrl.inited) {
        setKey(key);
        refreshMenu();
      }
    });
    return () => {
      emitter.unsubscribe(id);
    };
  }, []);
  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
