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

  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: '1',
    label: '管理的',
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
    let tabName_1 = userCtrl.isCompanySpace ? '管理的' : '我的';
    const anyThingMenus = await operate.loadAnythingMenus();
    const children: MenuItemType[] = [
      operate.getAppliactionMenus(),
      operate.getFileSystemMenus(),
      operate.getResourceMenus(),
      operate.getDataMenus(),
      operate.getSoftware()
    ];
    if (anyThingMenus) {
      children.push(anyThingMenus);
    }
    setMenu([
      {
        key: '1',
        label: tabName_1,
        menu: {
          key: tabName_1,
          label: tabName_1,
          itemType: tabName_1,
          icon: <im.ImTree />,
          children,
        },
      },
      {
        key: '2',
        label: '可见的',
        menu: {
          key: '可见的',
          label: '可见的',
          itemType: '可见的',
          icon: <im.ImCoinDollar />,
          children,
        },
      },
    ]);

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
