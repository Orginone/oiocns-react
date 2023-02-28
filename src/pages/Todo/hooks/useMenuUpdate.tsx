import { kernel } from '@/ts/base';
import { XOperation } from '@/ts/base/schema';
import userCtrl from '@/ts/controller/setting';
import todoCtrl from '@/ts/controller/todo/todoCtrl';
import { emitter, ISpeciesItem } from '@/ts/core';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';
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
  MenuItemType,
  (items: MenuItemType) => void,
  MenuItemType[],
  XOperation[],
  (checkedList: MenuItemType[]) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<TabItemType[]>([]);
  const [checkedList, setCheckedList] = useState<MenuItemType[]>([]);
  const [operations, setOperations] = useState<XOperation[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>({
    key: 'work',
    label: '办事',
    itemType: 'group',
    icon: <SettingOutlined />,
    children: [],
  });

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const todoMenus: MenuItemType[] = await operate.loadPlatformMenu();
    setMenu([
      {
        key: '1',
        label: '待办',
        menu: {
          key: 'todo',
          label: '待办',
          itemType: 'group',
          icon: <SettingOutlined />,
          children: [...todoMenus, ...(await operate.loadThingMenus('todo'))],
        },
      },
      {
        key: '2',
        label: '办事',
        menu: {
          key: 'work',
          label: '办事',
          itemType: 'group',
          icon: <SettingOutlined />,
          children: await operate.loadThingMenus('work', true),
        },
      },
    ]);
  };

  const LoadWorkOperation = async (items: MenuItemType[]) => {
    setCheckedList(items);
    if (items.length > 0) {
      const res = await kernel.queryOperationBySpeciesIds({
        ids: items.map((a) => (a.item as ISpeciesItem).id),
        spaceId: userCtrl.space.id,
      });
      setOperations(res.data.result ?? []);
    } else {
      setOperations([]);
    }
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
  return [
    key,
    menus,
    refreshMenu,
    selectMenu,
    setSelectMenu,
    checkedList,
    operations,
    LoadWorkOperation,
  ];
};

export default useMenuUpdate;
