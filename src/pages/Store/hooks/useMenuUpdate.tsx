import storeCtrl from '@/ts/controller/store';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ImHome } from 'react-icons/im';
import { MenuItemType, TabItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import userCtrl from '@/ts/controller/setting';
import * as im from 'react-icons/im';
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
  TabItemType[],
  () => void,
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<TabItemType[]>([]);
  // const [menus, setMenu] = useState<MenuItemType>({
  //   key: 'store',
  //   label: '仓库',
  //   itemType: 'group',
  //   icon: <ImHome />,
  //   children: [],
  // });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: '1',
    label: '物',
    itemType: 'group',
    icon: <ImHome />,
    children: [],
  });
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
    const childrenCommon: MenuItemType[] = [];
    //数据
    childrenCommon.push(operate.getDataMenus());
    //应用
    childrenCommon.push(operate.getAppliactionMenus());
    // children.push(operate.getAssetMenus());
    //文档
    childrenCommon.push(operate.getFileSystemMenus());
    //资源
    childrenCommon.push(operate.getResourceMenus());

    let thingMenus = await operate.getThingMenus();
    let welMenus = await operate.getWelMenus();
    // children.push(thingMenus);
    // const chats = await operate.loadChatMenu();
    // const books = await operate.loadBookMenu();

    let menus = [];
    menus.push(
      {
        key: '1',
        label: '物',
        menu: {
          key: '物',
          label: '物',
          itemType: '物',
          icon: <im.ImTree />,
          children: [...childrenCommon, thingMenus],
        },
      },
      {
        key: '2',
        label: '财',
        menu: {
          key: '财',
          label: '财',
          itemType: '财',
          icon: <im.ImCoinDollar />,
          children: [...childrenCommon, welMenus],
        },
      },
    );
    setMenu(menus);
    let children = [];
    switch (storeCtrl.tabIndex) {
      case '1':
        children = [...childrenCommon, thingMenus];
        break;
      default:
        children = [...childrenCommon, welMenus];
        break;
    }

    // const item: MenuItemType | undefined = findMenuItemByKey(
    //   children,
    //   chatCtrl.currentKey,
    // );
    // if (item) {
    //   setSelectMenu(item);
    // } else {
    //   if (children.length > 0) {
    //     chatCtrl.currentKey = children[0].key;
    //     setSelectMenu(children[0]);
    //   }
    // }
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
    const id2 = userCtrl.subscribe((key) => {
      // setKey(key);
      refreshMenu();
    });
    return () => {
      storeCtrl.unsubscribe(id);
      userCtrl.unsubscribe(id2);
    };
  }, []);

  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
