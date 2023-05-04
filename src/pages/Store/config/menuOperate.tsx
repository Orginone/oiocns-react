import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IconFont } from '@/components/IconFont';
import {
  IBelong,
  IFileSystemItem,
  IPerson,
  ISpeciesItem,
  ITarget,
  TargetType,
} from '@/ts/core';

/** 编译文件系统树 */
const buildFileSysTree = (targets: IFileSystemItem[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    if (item.metadata.isDirectory) {
      result.push({
        key: item.key,
        item: item,
        label: item.metadata.name,
        itemType: MenuType.FileSystemItem,
        menus: loadFileSysItemMenus(),
        icon: <im.ImFolder color="#c09553" />,
        expIcon: <im.ImFolderOpen color="#c09553" />,
        children: buildFileSysTree(item.children),
      });
    }
  }
  return result;
};

/** 加载文件系统操作菜单 */
export const loadFileSysItemMenus = (rightClick: boolean = false) => {
  const menus: OperateMenuType[] = [
    {
      key: '新建',
      label: '新建文件夹',
      icon: <im.ImFolderPlus />,
    },
    {
      key: '刷新',
      label: '刷新文件夹',
      icon: <im.ImSpinner9 />,
    },
    {
      key: '上传',
      label: '上传文件',
      icon: <im.ImUpload />,
    },
  ];
  if (rightClick) return menus;
  menus.push(
    {
      key: '重命名',
      label: '重命名',
      icon: <im.ImPen />,
    },
    {
      key: '移动',
      label: '移动到',
      icon: <im.ImRedo />,
    },
    {
      key: '复制',
      label: '复制到',
      icon: <im.ImFilesEmpty />,
    },
    {
      key: '删除',
      label: '彻底删除',
      icon: <fa.FaTrashAlt color="red" />,
    },
  );
  return menus;
};

/** 获取文件系统菜单 */
const getFileSystemMenus = (user: IPerson) => {
  return {
    key: '文件' + user.key,
    label: '文件',
    itemType: MenuType.FileSystem,
    icon: <im.ImDrive />,
    item: user.filesys,
    menus: loadFileSysItemMenus(),
    children: buildFileSysTree(
      (user.filesys?.children || []) as unknown as IFileSystemItem[],
    ),
  };
};

/** 获取财物菜单 */
const loadThingMenus = (target: ITarget) => {
  return {
    key: target.key + GroupMenuType.Things,
    label: GroupMenuType.Things,
    itemType: GroupMenuType.Things,
    menus: [],
    item: target,
    icon: <im.ImCalculator />,
    children: buildSpeciesTree(target.species),
  };
};

/** 编译组织分类树 */
const buildSpeciesTree = (parent: ISpeciesItem[]): MenuItemType[] => {
  if (parent.length > 0) {
    return parent.map((species) => {
      return {
        key: species.key,
        item: species,
        label: species.metadata.name,
        icon: <im.ImNewspaper />,
        itemType: MenuType.Species,
        menus: [],
        children: buildSpeciesTree(species.children),
      };
    });
  }
  return [];
};

/** 编译组织树 */
const buildTargetTree = (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    result.push({
      key: item.key,
      item: item,
      label: item.metadata.name,
      itemType: item.metadata.typeName,
      menus: [],
      icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
      children: [loadThingMenus(item)],
    });
  }
  return result;
};

/** 机构分组加载 */
const loadAgencyGroup = (
  space: IBelong,
  children: MenuItemType[],
  type: string,
  typeName: string,
) => {
  return {
    key: space.key + type,
    item: space,
    label: type,
    itemType: type,
    icon: <TeamIcon share={{ name: type, typeName: typeName }} size={18} fontSize={16} />,
    menus: [],
    children: children,
  };
};

/** 获取个人菜单 */
const getUserMenu = () => {
  return {
    key: orgCtrl.user.key,
    item: orgCtrl.user,
    label: orgCtrl.user.metadata.name,
    itemType: GroupMenuType.User,
    icon: <TeamIcon share={orgCtrl.user.share} size={18} fontSize={16} />,
    menus: [],
    children: [
      {
        key: orgCtrl.user.key + GroupMenuType.Asset,
        item: orgCtrl.user,
        label: GroupMenuType.Asset,
        itemType: GroupMenuType.Asset,
        icon: <im.ImNewspaper />,
        menus: [],
        children: [getFileSystemMenus(orgCtrl.user), loadThingMenus(orgCtrl.user)],
      },
      {
        key: orgCtrl.user.key + GroupMenuType.UserCohort,
        item: orgCtrl.user,
        label: GroupMenuType.UserCohort,
        itemType: GroupMenuType.UserCohort,
        icon: <im.ImNewspaper />,
        menus: [],
        children: buildTargetTree(orgCtrl.user.cohorts),
      },
    ],
  };
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push({
      key: company.key,
      item: company,
      label: company.metadata.name,
      itemType: GroupMenuType.Company,
      menus: [],
      icon: <TeamIcon share={company.share} size={18} fontSize={16} />,
      children: [
        {
          key: company.key + GroupMenuType.Asset,
          item: company,
          label: GroupMenuType.Asset,
          itemType: GroupMenuType.Asset,
          icon: <im.ImNewspaper />,
          menus: [],
          children: [loadThingMenus(company)],
        },
        loadAgencyGroup(
          company,
          buildTargetTree(company.departments),
          GroupMenuType.InnerAgency,
          TargetType.Department,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.groups),
          GroupMenuType.OutAgency,
          TargetType.Group,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.cohorts),
          GroupMenuType.CompanyCohort,
          TargetType.Cohort,
        ),
      ],
    });
  }
  return children;
};

/** 获取仓库模块菜单 */
export const loadStoreMenu = () => {
  return {
    key: '仓库',
    label: '仓库',
    itemType: 'group',
    icon: <IconFont type={'icon-store'} />,
    children: [getUserMenu(), ...getTeamMenu()],
  } as MenuItemType;
};
