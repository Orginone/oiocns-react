import { useState } from 'react';

import PageCtrl from '../pageCtrl';
import { emitter } from '@/ts/core';
import { findMenuItemByKey } from '@/utils/tools';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { MenuItemType } from 'typings/globelType';
import { loadTypeMenus } from '../config/menuOperate';

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
  const [key, setKey] = useState<string>('1');
  const [menus, setMenu] = useState<MenuItemType[]>([]);
  const [selectMenu, setSelectMenu] = useState<MenuItemType>();

  /** 刷新菜单 */
  const refreshMenu = async () => {
    const newMenus: any = [
      {
        key: '页面管理',
        label: '页面管理',
        itemType: 'Tab',
        children: [
          {
            key: '页面列表',
            label: '页面列表',
            itemType: 'group',
            menus: await loadTypeMenus(item),
            icon: <SettingOutlined />,
            children: [],
          },
        ],
      },
      {
        key: '组件管理',
        label: '组件管理',
        itemType: 'Tab',
        children: [
          {
            key: '组件列表',
            label: '组件列表',
            itemType: 'group',
            icon: <SettingOutlined />,
            children: [
              {
                key: '系统组件',
                label: '系统组件',
                itemType: 'group',
                icon: <SettingOutlined />,
                children: [],
              },
              {
                key: '图形组件',
                label: '图形组件',
                itemType: 'group',
                icon: <SettingOutlined />,
                children: [],
              },
              {
                key: '自定义组件',
                label: '自定义组件',
                itemType: 'group',
                icon: <SettingOutlined />,
                children: [],
              },
            ],
          },
          {
            key: '组件配置',
            label: '组件配置',
            itemType: 'group',
            icon: <SettingOutlined />,
            children: [],
          },
        ],
      },
    ];
    var item = findMenuItemByKey(newMenus, PageCtrl.currentKey);
    if (item === undefined) {
      item = newMenus[0].children[0];
    }
    PageCtrl.currentKey = item?.key ?? '页面管理';
    setSelectMenu(item);
    setMenu(newMenus);
  };

  useEffect(() => {
    const id = PageCtrl.subscribe((key) => {
      setKey(key ?? 1);
      refreshMenu();
    });
    return () => {
      emitter.unsubscribe(id);
    };
  }, []);
  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
