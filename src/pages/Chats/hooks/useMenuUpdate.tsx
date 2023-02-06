import { emitter } from '@/ts/core';
import chatCtrl from '@/ts/controller/chat';
import { useEffect } from 'react';
import React, { useState } from 'react';
import * as im from 'react-icons/im';
import { MenuItemType, TabItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  string,
  TabItemType[],
  () => void,
  string,
  (item: string) => void,
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  // const [viewkey, setViewkey] = useState<string>('');
  const [menus, setMenu] = useState<TabItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: '会话',
    label: '会话',
    itemType: '会话',
    icon: <im.ImTree />,
    children: [],
  });
  const [selectTab, setSelectTab] = useState<string>('1');

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
    const chats = await operate.loadChatMenu();
    const books = await operate.loadBookMenu();

    let menus = [];
    menus.push(
      {
        key: '1',
        label: '会话',
        menu: chats,
      },
      {
        key: '2',
        label: '通讯录',
        menu: books,
      },
    );
    setMenu(menus);
    let children = [];
    switch (chatCtrl.tabIndex) {
      case '1':
        children = chats.children;
        break;
      default:
        children = books.children;
        break;
    }

    const item: MenuItemType | undefined = findMenuItemByKey(
      children,
      chatCtrl.currentKey,
    );
    if (item) {
      setSelectMenu(item);
    } else {
      if (children.length > 0) {
        chatCtrl.currentKey = children[0].key;
        setSelectMenu(children[0]);
      }
    }
  };

  useEffect(() => {
    const id = emitter.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      emitter.unsubscribe(id);
    };
  }, []);
  return [key, menus, refreshMenu, selectTab, setSelectTab, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
