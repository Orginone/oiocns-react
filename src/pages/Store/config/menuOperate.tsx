import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType } from './menuType';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import { IFileSystemItem } from '@/ts/core/target/store/ifilesys';
import { ISpace, ISpeciesItem } from '@/ts/core';

/** 编译文件系统树 */
const buildFileSysTree = (targets: IFileSystemItem[], user: ISpace) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    if (item.target.isDirectory) {
      result.push({
        key: item.key + user.id,
        item: item,
        label: item.name,
        belong: user,
        itemType: GroupMenuType.FileSystemItem,
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
export const getDataMenus = (user: ISpace) => {
  return {
    key: '数据' + user.id,
    label: '数据',
    itemType: GroupMenuType.Data,
    icon: <im.ImDatabase></im.ImDatabase>,
    item: orgCtrl.user.root,
    children: [],
  };
};

/** 获取资源菜单 */
export const getResourceMenus = (user: ISpace) => {
  return {
    key: '资源' + user.id,
    label: '资源',
    itemType: GroupMenuType.Resource,
    icon: <im.ImCloudDownload></im.ImCloudDownload>,
    item: orgCtrl.user.root,
    children: [],
  };
};

export const getCommonSpeciesMenus = (user: ISpace) => {
  return {
    key: '我的常用' + user.id,
    label: '我的常用',
    itemType: GroupMenuType.Common,
    icon: <im.ImHeart />,
    children: [],
  };
};

/** 获取应用程序菜单 */
export const getAppliactionMenus = (user: ISpace) => {
  return {
    key: '应用' + user.id,
    label: '应用',
    itemType: GroupMenuType.Application,
    icon: <im.ImWindows8 />,
    item: orgCtrl.user.root,
    children: [],
  };
};

/** 获取资产菜单 */
export const getAssetMenus = (user: ISpace) => {
  return {
    key: '资产' + user.id,
    label: '资产',
    itemType: GroupMenuType.Asset,
    icon: <im.ImCalculator />,
    item: orgCtrl.user.root,
    children: [],
  };
};

/** 获取文件系统菜单 */
export const getFileSystemMenus = (user: ISpace) => {
  return {
    key: '文件' + user.id,
    label: '文件',
    itemType: GroupMenuType.FileSystemItem,
    icon: <im.ImDrive />,
    item: user.root,
    menus: loadFileSysItemMenus(user.root),
    children: buildFileSysTree(user.root.children, user),
  };
};

export const loadThingMenus = async (user: ISpace) => {
  const root = await user.loadSpeciesTree();
  for (const item of root) {
    if (item.target.code === 'thing') {
      return {
        children: buildSpeciesChildrenTree(item.children, GroupMenuType.Thing, user),
        key: item.target.name + user.id,
        label: item.target.name,
        itemType: GroupMenuType.Thing,
        menus: loadSpeciesOperationMenus(item),
        item: item,
        icon: <im.ImCalculator />,
      };
    }
  }
};

export const loadAdminMenus = async (user: ISpace) => {
  const children: MenuItemType[] = [
    getAppliactionMenus(user),
    getFileSystemMenus(user),
    getResourceMenus(user),
    getDataMenus(user),
  ];
  const anyThingMenus = await loadThingMenus(user);
  if (anyThingMenus) {
    children.push(anyThingMenus);
  }
  return {
    key: user.key,
    item: user,
    label: user.teamName,
    itemType: user.typeName,
    // menus: await loadTypeMenus(user),
    icon: <TeamIcon share={user.shareInfo} size={18} fontSize={16} />,
    children: children,
  };
};

export const loadMarketMenus = async () => {
  const markets = await marketCtrl.target.getJoinMarkets();
  return [
    {
      key: '管理的商店',
      label: '管理的商店',
      icon: <im.ImNewspaper />,
      itemType: '管理的商店',
      menus: [
        {
          key: '创建商店',
          label: '创建商店',
          icon: <im.ImFolderPlus />,
        },
      ],
      children: markets
        .filter((i) => i.target.belongId === marketCtrl.target.id)
        .map((item) => {
          return {
            key: item.target.name,
            label: item.target.name,
            itemType: GroupMenuType.Thing,
            menus: [
              {
                key: '编辑信息',
                label: '编辑信息',
                icon: <im.ImFolderPlus />,
              },
              {
                key: '删除商店',
                label: '删除商店',
                icon: <im.ImFolderPlus />,
              },
            ],
            item: item,
            children: [],
            icon: <im.ImCalculator />,
          };
        }),
    },
    {
      key: '加入的商店',
      label: '加入的商店',
      icon: <im.ImNewspaper />,
      itemType: '加入的商店',
      menus: [
        {
          key: '加入商店',
          label: '加入商店',
          icon: <im.ImFolderPlus />,
        },
      ],
      children: markets
        .filter((i) => i.target.belongId != marketCtrl.target.id)
        .map((item) => {
          return {
            key: item.target.name,
            label: item.target.name,
            itemType: GroupMenuType.Thing,
            menus: [
              {
                key: '编辑信息',
                label: '编辑信息',
                icon: <im.ImFolderPlus />,
              },
              {
                key: '删除商店',
                label: '删除商店',
                icon: <im.ImFolderPlus />,
              },
            ],
            children: [],
            item: item,
            icon: <im.ImCalculator />,
          };
        }),
    },
  ];
};

const buildSpeciesChildrenTree = (
  parent: ISpeciesItem[],
  itemType: string,
  user: ISpace,
  menuType?: string,
): MenuItemType[] => {
  if (parent.length > 0) {
    return parent.map((species) => {
      return {
        key: species.id + user.id,
        item: species,
        label: species.name,
        icon: <im.ImNewspaper />,
        itemType: itemType,
        menuType: menuType,
        menus: loadSpeciesOperationMenus(species),
        children: buildSpeciesChildrenTree(species.children, itemType, user, menuType),
      };
    });
  }
  return [];
};

/** 加载右侧菜单 */
export const loadSpeciesOperationMenus = (item: ISpeciesItem) => {
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
