import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IFileSystemItem, TargetType } from '@/ts/core';
import { ISpace, ISpeciesItem, ITarget } from '@/ts/core';
import { IconFont } from '@/components/IconFont';

/** 编译文件系统树 */
const buildFileSysTree = (targets: IFileSystemItem[], user: ISpace) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    if (item.target.isDirectory) {
      result.push({
        key: item.fullKey,
        item: item,
        label: item.name,
        itemType: MenuType.FileSystemItem,
        menus: loadFileSysItemMenus(item),
        icon: <im.ImFolder color="#c09553" />,
        expIcon: <im.ImFolderOpen color="#c09553" />,
        children: buildFileSysTree(item.children, user),
      });
    }
  }
  return result;
};

/** 加载文件系统操作菜单 */
export const loadFileSysItemMenus = (
  item: IFileSystemItem,
  rightClick: boolean = false,
) => {
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
  if (item != orgCtrl.user.root && item != orgCtrl.user.home) {
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
  }
  return menus;
};

/** 获取数据菜单 */
const getDataMenus = (user: ISpace) => {
  return {
    key: '数据' + user.id,
    label: '数据',
    itemType: MenuType.Data,
    icon: <im.ImDatabase></im.ImDatabase>,
    item: orgCtrl.user.root,
    children: [],
  };
};

/** 获取资源菜单 */
const getResourceMenus = (user: ISpace) => {
  return {
    key: '资源' + user.id,
    label: '资源',
    itemType: MenuType.Resource,
    icon: <im.ImCloudDownload></im.ImCloudDownload>,
    item: orgCtrl.user.root,
    children: [],
  };
};

/** 获取应用程序菜单 */
const getAppliactionMenus = (user: ISpace) => {
  return {
    key: '应用' + user.id,
    label: '应用',
    itemType: MenuType.Application,
    icon: <im.ImWindows8 />,
    item: orgCtrl.user.root,
    children: [],
  };
};

/** 获取文件系统菜单 */
const getFileSystemMenus = (user: ISpace) => {
  return {
    key: '文件' + user.id,
    label: '文件',
    itemType: MenuType.FileSystemItem,
    icon: <im.ImDrive />,
    item: user.root,
    menus: loadFileSysItemMenus(user.root),
    children: buildFileSysTree(user.root.children, user),
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

/** 加载右侧菜单 */
const loadSpeciesOperationMenus = (item: ISpeciesItem) => {
  const items: OperateMenuType[] = [
    {
      key: '创建实体',
      label: '创建实体',
      icon: <im.ImFolderPlus />,
    },
  ];
  // if (isCommon) {
  //   items.push({
  //     key: '取消常用',
  //     label: '取消常用',
  //     icon: <im.ImHeartBroken />,
  //   });
  // } else {
  //   items.push({
  //     key: '设为常用',
  //     label: '设为常用',
  //     icon: <im.ImHeart />,
  //   });
  // }
  return items;
};

/** 编译组织分类树 */
const buildSpeciesTree = (parent: ISpeciesItem[]): MenuItemType[] => {
  if (parent.length > 0) {
    return parent.map((species) => {
      return {
        key: species.key,
        item: species,
        label: species.name,
        icon: <im.ImNewspaper />,
        itemType: MenuType.Species,
        menus: loadSpeciesOperationMenus(species),
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
      label: item.teamName,
      itemType: item.typeName,
      menus: [],
      icon: <TeamIcon notAvatar={true} share={item.shareInfo} size={18} fontSize={16} />,
      children: [loadThingMenus(item), ...buildTargetTree(item.subTeam)],
    });
  }
  return result;
};

/** 机构分组加载 */
const loadAgencyGroup = (
  space: ISpace,
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
const getUserMenu = async () => {
  return {
    key: orgCtrl.user.key,
    item: orgCtrl.user,
    label: orgCtrl.user.teamName,
    itemType: GroupMenuType.User,
    icon: <TeamIcon share={orgCtrl.user.shareInfo} size={18} fontSize={16} />,
    menus: [],
    children: [
      {
        key: orgCtrl.user.key + GroupMenuType.Asset,
        item: orgCtrl.user,
        label: GroupMenuType.Asset,
        itemType: GroupMenuType.Asset,
        icon: <im.ImNewspaper />,
        menus: [],
        children: [
          getAppliactionMenus(orgCtrl.user),
          getFileSystemMenus(orgCtrl.user),
          getResourceMenus(orgCtrl.user),
          getDataMenus(orgCtrl.user),
          loadThingMenus(orgCtrl.user),
        ],
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
const getTeamMenu = async () => {
  const children: MenuItemType[] = [];
  for (const company of await orgCtrl.user.getJoinedCompanys()) {
    children.push({
      key: company.key,
      item: company,
      label: company.teamName,
      itemType: GroupMenuType.Company,
      menus: [],
      icon: <TeamIcon share={company.shareInfo} size={18} fontSize={16} />,
      children: [
        {
          key: company.key + GroupMenuType.Asset,
          item: company,
          label: GroupMenuType.Asset,
          itemType: GroupMenuType.Asset,
          icon: <im.ImNewspaper />,
          menus: [],
          children: [
            getAppliactionMenus(company),
            getFileSystemMenus(company),
            getResourceMenus(company),
            getDataMenus(company),
            loadThingMenus(company),
          ],
        },
        loadAgencyGroup(
          company,
          buildTargetTree(company.subTeam),
          GroupMenuType.InnerAgency,
          TargetType.Department,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.joinedGroup),
          GroupMenuType.OutAgency,
          TargetType.Group,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.stations),
          GroupMenuType.Station,
          TargetType.Station,
        ),
        loadAgencyGroup(
          company,
          buildTargetTree(company.workings),
          GroupMenuType.Working,
          TargetType.Working,
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
export const loadStoreMenu = async () => {
  return {
    key: '仓库',
    label: '仓库',
    itemType: 'group',
    icon: <IconFont type={'icon-store'} />,
    children: [await getUserMenu(), ...(await getTeamMenu())],
  };
};
