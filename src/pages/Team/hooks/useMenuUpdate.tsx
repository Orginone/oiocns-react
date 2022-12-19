import userCtrl from '@/ts/controller/setting/userCtrl';
import { emitter, ITarget, TargetType } from '@/ts/core';
import { SettingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import * as im from 'react-icons/im';
import { useState } from 'react';
import { MenuItemType } from 'typings/globelType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
/**
 * 监听控制器刷新hook
 * @param ctrl 控制器
 * @returns hooks 常量
 */
const useMenuUpdate = (): [
  MenuItemType,
  () => void,
  MenuItemType,
  (item: MenuItemType) => void,
] => {
  const [menus, setMenu] = useState<MenuItemType>({
    key: 'setting',
    label: '设置',
    itemType: 'group',
    icon: <SettingOutlined />,
    children: [],
  });
  const [selectMenu, setSelectMenu] = useState<MenuItemType>(menus);
  /** 加载右侧菜单 */
  const loadMenus = (item: ITarget) => {
    const menus: any[] = [];
    if (item.subTeamTypes.length > 0) {
      menus.push({
        key: '新建|' + item.subTeamTypes.join('|'),
        icon: <im.ImPlus />,
        label: '新建',
        item: item,
      });
    }
    menus.push(
      {
        key: '编辑',
        icon: <im.ImPencil />,
        label: '编辑',
        item: item,
      },
      {
        key: '刷新',
        icon: <im.ImSpinner9 />,
        label: '刷新',
        item: item,
      },
    );
    if (item != userCtrl.user && item != userCtrl.company) {
      menus.push({
        key: '删除',
        icon: <im.ImBin />,
        label: '删除',
        item: item,
      });
    }
    return menus;
  };
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
  const buildTargetTree = (targets: ITarget[]) => {
    const result: MenuItemType[] = [];
    for (const item of targets) {
      let label = item.teamName;
      if (item === userCtrl.user) {
        label = '个人信息';
      } else if (item === userCtrl.company) {
        label = '单位信息';
      }
      result.push({
        key: item.key,
        item: item,
        label: label,
        menus: loadMenus(item),
        itemType: item.typeName,
        icon: <TeamIcon share={item.shareInfo} size={18} fontSize={16} />,
        children: buildTargetTree(item.subTeam),
      });
    }
    return result;
  };
  const refreshMenu = async (reset: boolean = false) => {
    const children: MenuItemType[] = [];
    children.push(...buildTargetTree([userCtrl.space]));
    if (userCtrl.isCompanySpace) {
      children.push({
        key: '外部机构',
        label: '外部机构',
        itemType: 'group',
        icon: (
          <TeamIcon
            share={{
              name: '外部机构',
              typeName: TargetType.Group,
            }}
            size={18}
            fontSize={16}
          />
        ),
        menus: [
          {
            key: '新建|集团',
            icon: <im.ImPlus />,
            label: '新建',
          },
        ],
        item: userCtrl.company,
        children: buildTargetTree(await userCtrl.company.getJoinedGroups()),
      });
      children.push({
        key: '岗位设置',
        label: '岗位设置',
        itemType: 'group',
        icon: (
          <TeamIcon
            share={{
              name: '岗位设置',
              typeName: TargetType.Station,
            }}
            size={18}
            fontSize={16}
          />
        ),
        menus: [
          {
            key: '新建|岗位',
            icon: <im.ImPlus />,
            label: '新建',
          },
        ],
        item: userCtrl.company,
        children: buildTargetTree(await userCtrl.company.getStations()),
      });
      children.push({
        key: '单位群组',
        label: '单位群组',
        itemType: 'group',
        icon: (
          <TeamIcon
            share={{
              name: '单位群组',
              typeName: TargetType.Cohort,
            }}
            size={18}
            fontSize={16}
          />
        ),
        menus: [
          {
            key: '新建|群组',
            icon: <im.ImPlus />,
            label: '新建',
          },
        ],
        item: userCtrl.company,
        children: buildTargetTree(await userCtrl.company.getCohorts()),
      });
    } else {
      children.push({
        key: '个人群组',
        label: '个人群组',
        itemType: 'group',
        icon: (
          <TeamIcon
            share={{
              name: '个人群组',
              typeName: TargetType.Cohort,
            }}
            size={18}
            fontSize={16}
          />
        ),
        menus: [
          {
            key: '新建|群组',
            icon: <im.ImPlus />,
            label: '新建',
          },
        ],
        item: userCtrl.user,
        children: buildTargetTree(await userCtrl.user.getCohorts()),
      });
    }
    setMenu({
      key: 'setting',
      label: '设置',
      itemType: 'group',
      icon: <SettingOutlined />,
      children: children,
    });
    if (reset && selectMenu.key != userCtrl.currentKey) {
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
    }
  };

  useEffect(() => {
    const id = emitter.subscribe(() => {
      refreshMenu(true);
    });
    return () => {
      emitter.unsubscribe(id);
    };
  }, []);
  return [menus, refreshMenu, selectMenu, setSelectMenu];
};

export default useMenuUpdate;
