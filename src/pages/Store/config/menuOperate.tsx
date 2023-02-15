import storeCtrl from '@/ts/controller/store';
import { IFileSystemItem } from '@/ts/core';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType } from './menuType';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem } from '@/ts/core/target/species/ispecies';
import { kernel } from '@/ts/base';
import { SpeciesItem } from '@/ts/core/target/species/species';

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
    key: '文件系统',
    label: '文件系统',
    itemType: GroupMenuType.FileSystemItem,
    icon: <im.ImDrive />,
    item: storeCtrl.root,
    menus: loadFileSysItemMenus(storeCtrl.root),
    children: buildFileSysTree(storeCtrl.root.children),
  };
};

/** 获取物菜单 */
export const getThingMenus = async () => {
  const root = await userCtrl.space.loadSpeciesTree();
  const species =
    root && root.children ? root.children.filter((item) => item.name == '物')[0] : null;
  return species
    ? buildSpeciesTree(species)
    : {
        children: [],
        key: '物',
        label: '物',
        itemType: GroupMenuType.Thing,
        item: userCtrl.space,
        icon: <im.ImNewspaper />,
      };
};

/** 编译分类树 */
export const buildSpeciesTree = (species: ISpeciesItem): MenuItemType => {
  const result: MenuItemType = {
    key: species.id,
    item: species,
    label: species.name,
    icon: <im.ImNewspaper />,
    itemType: GroupMenuType.Thing,
    // menus: loadSpeciesMenus(species),
    children: species.children?.map((i) => buildSpeciesTree(i)) ?? [],
  };
  return result;
};

/** 加载右侧菜单 */
export const loadSpeciesMenus = (item: ISpeciesItem) => {
  const items: any[] = [];
  return items;
};
