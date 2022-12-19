import React from 'react';
import * as im from 'react-icons/im';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget, TargetType } from '@/ts/core';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { MenuItemType } from 'typings/globelType';

/** 加载分组菜单参数 */
interface groupMenuParams {
  item: ITarget;
  key: string;
  typeName: string;
  subTeam: ITarget[];
}
/** 分组类型 */
export enum GroupMenuType {
  'User' = '个人',
  'Agency' = '机构',
  'Cohort' = '群组',
  'Company' = '单位',
  'Station' = '岗位',
  'OutAgency'= '外部机构',
  'UserCohort'= '个人群组',
  'InnerAgency'= '内部机构',
  'StationSetting'= '岗位设置',
  'CompanyCohort'= '单位群组',
}

/** 转换类型 */
const parseGroupMenuType = (typeName: TargetType) => {
  switch(typeName) {
    case TargetType.Cohort:
      return GroupMenuType.Cohort;
    case TargetType.Station:
      return GroupMenuType.Station;
    default:
      return GroupMenuType.Agency;
  }
}

/** 编译组织树 */
export const buildTargetTree = (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.teamName,
      itemType: parseGroupMenuType(item.typeName),
      menus: loadTypeMenus(item),
      icon: <TeamIcon share={item.shareInfo} size={18} fontSize={16} />,
      children: buildTargetTree(item.subTeam),
    });
  }
  return result;
};

/** 获取空间菜单 */
export const getSpaceMenu = () => {
  let label = '个人信息';
  let itemType = GroupMenuType.User;
  if(userCtrl.isCompanySpace) {
    label = '单位信息';
    itemType = GroupMenuType.Company;
  }
  return {
    key: userCtrl.space.key,
    item: userCtrl.space,
    label: label,
    itemType: itemType,
    menus: loadTypeMenus(userCtrl.space),
    icon: <TeamIcon share={userCtrl.space.shareInfo} size={18} fontSize={16} />,
    children: [],
  };
}
/** 加载分组菜单 */
export const loadGroupMenus = (param: groupMenuParams) => {
  return {
    key: param.key,
    label: param.key,
    itemType: param.key,
    icon: (
      <TeamIcon
        share={{
          name: param.key,
          typeName: param.typeName,
        }}
        size={18}
        fontSize={16}
      />
    ),
    menus: [
      {
        key: '新建|' + param.typeName,
        icon: <im.ImPlus />,
        label: '新建',
      },
    ],
    item: param.item,
    children: buildTargetTree(param.subTeam),
  };
};

/** 加载类型更多操作 */
export const loadTypeMenus = (item: ITarget) => {
  const menus: any[] = [];
  if (item.subTeamTypes.length > 0) {
    menus.push({
      key: '新建|' + item.subTeamTypes.join('|'),
      icon: <im.ImPlus />,
      label: '新建',
    });
  }
  menus.push(
    {
      key: '编辑',
      icon: <im.ImPencil />,
      label: '编辑',
    },
    {
      key: '刷新',
      icon: <im.ImSpinner9 />,
      label: '刷新',
    },
  );
  if (item != userCtrl.user && item != userCtrl.company) {
    menus.push({
      key: '删除',
      icon: <im.ImBin />,
      label: '删除',
    });
  }
  return menus;
};
