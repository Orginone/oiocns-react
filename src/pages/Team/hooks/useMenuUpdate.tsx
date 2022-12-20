import userCtrl from '@/ts/controller/setting/userCtrl';
import { emitter, TargetType } from '@/ts/core';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { ImStackoverflow } from 'react-icons/im';
import { MenuItemType } from 'typings/globelType';
import * as operate from '../config/menuOperate';
import { GroupMenuType } from '../config/menuType';
/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  string,
  MenuItemType,
  () => void,
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [key, setKey] = useState<string>('');
  const [menus, setMenu] = useState<MenuItemType>({
    key: 'setting',
    label: '设置',
    itemType: 'group',
    icon: <SettingOutlined />,
    children: [],
  });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>(menus);

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
        {
          children: [],
          key: '流程设置',
          label: '流程设置',
          itemType: '流程设置',
          item: userCtrl.space,
          icon: <ImStackoverflow />,
        },
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
      children.push(operate.loadUserSetting());
    }
    children.push(operate.loadSpaceSetting());
    setMenu({
      key: 'setting',
      label: '设置',
      itemType: 'group',
      icon: <SettingOutlined />,
      children: children,
    });
    const item: MenuItemType | undefined = findMenuItemByKey(
      children,
      userCtrl.currentKey,
    );
    if (item) {
      setSelectMenu(item);
    } else {
      userCtrl.currentKey = children[0].key;
      setSelectMenu(children[0]);
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
  return [key, menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
