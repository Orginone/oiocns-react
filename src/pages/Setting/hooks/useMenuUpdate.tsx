import userCtrl from '@/ts/controller/setting';
import { TargetType } from '@/ts/core';
import { findMenuItemByKey } from '@/utils/tools';
import { useEffect } from 'react';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
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
    const children: MenuItemType[] = [];
    children.push(await operate.getSpaceMenu());
    if (userCtrl.isCompanySpace) {
      children.push(
        await operate.loadGroupMenus(
          {
            key: GroupMenuType.InnerAgency,
            item: userCtrl.company,
            typeName: TargetType.Department,
            subTeam: await userCtrl.company.loadSubTeam(),
          },
          userCtrl.company.subTeamTypes,
        ),
        await operate.loadGroupMenus(
          {
            key: GroupMenuType.OutAgency,
            item: userCtrl.company,
            typeName: TargetType.Group,
            subTeam: await userCtrl.company.getJoinedGroups(),
          },
          [TargetType.Group],
        ),
        await operate.loadGroupMenus(
          {
            key: GroupMenuType.StationSetting,
            item: userCtrl.company,
            typeName: TargetType.Station,
            subTeam: await userCtrl.company.getStations(),
          },
          [TargetType.Station],
        ),
        await operate.loadGroupMenus(
          {
            key: GroupMenuType.CompanyCohort,
            item: userCtrl.company,
            typeName: TargetType.Cohort,
            subTeam: await userCtrl.company.getCohorts(),
          },
          [TargetType.Cohort],
        ),
      );
    } else {
      children.push(
        await operate.loadGroupMenus(
          {
            key: GroupMenuType.UserCohort,
            item: userCtrl.user,
            typeName: TargetType.Cohort,
            subTeam: await userCtrl.user.getCohorts(),
          },
          [TargetType.Cohort],
        ),
      );
    }
    const newMenus = [
      {
        key: '设置',
        label: '',
        itemType: 'Tab',
        children: children,
      },
    ];
    var item = findMenuItemByKey(children, userCtrl.currentKey);
    if (item === undefined) {
      item = children[0];
    }
    userCtrl.currentKey = item.key;
    setSelectMenu(item);
    setMenus(newMenus);
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
