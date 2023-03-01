import storeCtrl from '@/ts/controller/store';
import { IFileSystemItem } from '@/ts/core';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType } from './menuType';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';

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

/** 获取应用程序菜单 */
export const getAppliactionMenus = () => {
  return {
    key: '应用程序',
    label: '应用程序',
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

export const loadAnythingMenus = async () => {
  const root = await userCtrl.space.loadSpeciesTree();
  return root
    ? {
        children: buildSpeciesChildrenTree(
          root.children.filter((item) => item.name == '物' || item.name == '财'),
          GroupMenuType.Thing,
          'checkbox',
        ),
        key: '财物',
        label: '财物',
        itemType: GroupMenuType.Thing,
        item: root,
        icon: <im.ImNewspaper />,
      }
    : undefined;
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
export const loadSpeciesOperationMenus = (_: ISpeciesItem) => {
  const items: OperateMenuType[] = [
    // {
    //   key: '操作',
    //   label: '操作',
    //   icon: <im.ImPlus />,
    // },
  ];
  return items;
};
