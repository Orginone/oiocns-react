import userCtrl from '@/ts/controller/setting';
import { TargetType } from '@/ts/core';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ImHome } from 'react-icons/im';
import { MenuItemType, TabItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { GroupMenuType } from '../config/menuType';
/**
 * 设置菜单刷新hook
 * @returns key ,变更后的标识
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
    label: '关系',
    itemType: '关系',
    item: userCtrl.space,
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
    const children: MenuItemType[] = [];
    children.push(await operate.getSpaceMenu());
    if (userCtrl.isCompanySpace) {
      children.push(
        await operate.loadGroupMenus({
          key: GroupMenuType.InnerAgency,
          item: userCtrl.company,
          typeName: TargetType.Department,
          subTeam: await userCtrl.company.loadSubTeam(),
        }),
        await operate.loadGroupMenus({
          key: GroupMenuType.OutAgency,
          item: userCtrl.company,
          typeName: TargetType.Group,
          subTeam: await userCtrl.company.getJoinedGroups(),
        }),
        await operate.loadGroupMenus({
          key: GroupMenuType.StationSetting,
          item: userCtrl.company,
          typeName: TargetType.Station,
          subTeam: await userCtrl.company.getStations(),
        }),
        await operate.loadGroupMenus({
          key: GroupMenuType.CompanyCohort,
          item: userCtrl.company,
          typeName: TargetType.Cohort,
          subTeam: await userCtrl.company.getCohorts(),
        }),
      );
    } else {
      children.push(
        await operate.loadGroupMenus({
          key: GroupMenuType.UserCohort,
          item: userCtrl.user,
          typeName: TargetType.Cohort,
          subTeam: await userCtrl.user.getCohorts(),
        }),
      );
    }
    const standrads = await operate.loadStandardSetting();
    standrads.push(operate.loadUserSetting());
    standrads.push(operate.loadSpaceSetting());
    setMenu([
      {
        key: '1',
        label: '关系',
        menu: {
          children: children,
          key: 'setting',
          label: '关系',
          item: userCtrl.space,
          itemType: 'group',
          icon: <SettingOutlined />,
        },
      },
      {
        key: '2',
        label: '标准',
        menu: {
          children: standrads,
          key: 'setting',
          label: '标准',
          item: userCtrl.space,
          itemType: 'group',
          icon: <SettingOutlined />,
        },
      },
    ]);
    const item = findMenuItemByKey(children, userCtrl.currentKey);
    if (item) {
      setSelectMenu(item);
    } else {
      userCtrl.currentKey = children[0].key;
      setSelectMenu(children[0]);
    }
  };

  useEffect(() => {
    const id = userCtrl.subscribe((key) => {
      setKey(key);
      refreshMenu();
    });
    return () => {
      userCtrl.unsubscribe(id);
    };
  }, []);
  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
