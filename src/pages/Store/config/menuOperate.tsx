import storeCtrl from '@/ts/controller/store';
import { IFileSystemItem, ISpeciesItem } from '@/ts/core';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType } from './menuType';
import marketCtrl from '@/ts/controller/store/marketCtrl';
import setting from '@/ts/controller/setting';

/** 编译文件系统树 */
const buildFileSysTree = (targets: IFileSystemItem[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    if (item.target.isDirectory) {
      result.push({
        key: item.key,
        item: item,
        label: item.name,
        itemType: GroupMenuType.FileSystemItem,
        menus: loadFileSysItemMenus(item),
        icon: <im.ImFolder color="#c09553" />,
        expIcon: <im.ImFolderOpen color="#c09553" />,
        children: buildFileSysTree(item.children),
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
  if (item != storeCtrl.root && item != storeCtrl.home) {
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
export const getDataMenus = () => {
  return {
    key: '数据',
    label: '数据',
    itemType: GroupMenuType.Data,
    icon: <im.ImDatabase></im.ImDatabase>,
    item: storeCtrl.root,
    children: [],
  };
};

/** 获取资源菜单 */
export const getResourceMenus = () => {
  return {
    key: '资源',
    label: '资源',
    itemType: GroupMenuType.Resource,
    icon: <im.ImCloudDownload></im.ImCloudDownload>,
    item: storeCtrl.root,
    children: [],
  };
};

export const getCommonSpeciesMenus = () => {
  return {
    key: '我的常用',
    label: '我的常用',
    itemType: GroupMenuType.Common,
    icon: <im.ImHeart />,
    children: storeCtrl.caches || [],
  };
};

/** 获取应用程序菜单 */
export const getAppliactionMenus = () => {
  return {
    key: '应用',
    label: '应用',
    itemType: GroupMenuType.Application,
    icon: <im.ImWindows8 />,
    item: storeCtrl.root,
    children: [],
  };
};

/** 获取资产菜单 */
export const getAssetMenus = () => {
  return {
    key: '资产',
    label: '资产',
    itemType: GroupMenuType.Asset,
    icon: <im.ImCalculator />,
    item: storeCtrl.root,
    children: [],
  };
};

/** 获取文件系统菜单 */
export const getFileSystemMenus = () => {
  return {
    key: '文件',
    label: '文件',
    itemType: GroupMenuType.FileSystemItem,
    icon: <im.ImDrive />,
    item: storeCtrl.root,
    menus: loadFileSysItemMenus(storeCtrl.root),
    children: buildFileSysTree(storeCtrl.root.children),
  };
};

export const loadThingMenus = async () => {
  const root = await setting.space.loadSpeciesTree();
  for (const item of root) {
    if (item.target.code === 'thing') {
      return {
        children: buildSpeciesChildrenTree(item.children, GroupMenuType.Thing, ''),
        key: item.target.name,
        label: item.target.name,
        itemType: GroupMenuType.Thing,
        menus: loadSpeciesOperationMenus(item),
        item: item,
        icon: <im.ImCalculator />,
      };
    }
  }
};

export const loadAdminMenus = async () => {
  const anyThingMenus = await loadThingMenus();
  const children: MenuItemType[] = [
    // getCommonSpeciesMenus(),
    getAppliactionMenus(),
    getFileSystemMenus(),
    getResourceMenus(),
    getDataMenus(),
  ];
  if (anyThingMenus) {
    children.push(anyThingMenus);
  }
  return children;
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
  menuType?: string,
): MenuItemType[] => {
  if (parent.length > 0) {
    return parent.map((species) => {
      return {
        key: species.id,
        item: species,
        label: species.name,
        icon: <im.ImNewspaper />,
        itemType: itemType,
        menuType: menuType,
        menus: loadSpeciesOperationMenus(species),
        children: buildSpeciesChildrenTree(species.children, itemType, menuType),
      };
    });
  }
  return [];
};

/** 加载右侧菜单 */
export const loadSpeciesOperationMenus = (item: ISpeciesItem) => {
  // let isCommon = storeCtrl.caches.map((cache) => cache.key).includes(item.id);
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
