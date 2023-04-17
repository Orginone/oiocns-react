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
    children.push(
      await operate.getSpaceMenu(userCtrl.user, [
        await operate.loadGroupMenus(
          {
            key: userCtrl.user.id + GroupMenuType.UserCohort,
            label: GroupMenuType.UserCohort,
            item: userCtrl.user,
            typeName: TargetType.Cohort,
            subTeam: await userCtrl.user.getCohorts(),
          },
          [TargetType.Cohort],
        ),
      ]),
    );
    for (const company of await userCtrl.user.getJoinedCompanys()) {
      children.push(
        await operate.getSpaceMenu(company, [
          await operate.loadGroupMenus(
            {
              key: company.key + GroupMenuType.InnerAgency,
              label: GroupMenuType.InnerAgency,
              item: company,
              typeName: TargetType.Department,
              subTeam: await company.loadSubTeam(),
            },
            company.subTeamTypes,
          ),
          await operate.loadGroupMenus(
            {
              key: company.key + GroupMenuType.OutAgency,
              label: GroupMenuType.OutAgency,
              item: company,
              typeName: TargetType.Group,
              subTeam: await company.getJoinedGroups(),
            },
            [TargetType.Group],
          ),
          await operate.loadGroupMenus(
            {
              key: company.key + GroupMenuType.StationSetting,
              label: GroupMenuType.StationSetting,
              item: company,
              typeName: TargetType.Station,
              subTeam: await company.getStations(),
            },
            [TargetType.Station],
          ),
          await operate.loadGroupMenus(
            {
              key: company.key + GroupMenuType.CompanyCohort,
              label: GroupMenuType.CompanyCohort,
              item: company,
              typeName: TargetType.Cohort,
              subTeam: await company.getCohorts(),
            },
            [TargetType.Cohort],
          ),
        ]),
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
