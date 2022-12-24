import docsCtrl from '@/ts/controller/store/docsCtrl';
import { IFileSystemItem } from '@/ts/core';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType } from './menuType';

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
      key: '上传',
      label: '上传多个文件',
      icon: <im.ImUpload />,
    },
    {
      key: '刷新',
      label: '刷新文件夹',
      icon: <im.ImSpinner9 />,
    },
  ];
  if (rightClick) return menus;
  if (item != docsCtrl.root && item != docsCtrl.home) {
    menus.push(
      {
        key: '重命名',
        label: '重命名文件夹',
        icon: <im.ImPen />,
      },
      {
        key: '移动',
        label: '移动到文件夹',
        icon: <im.ImRedo />,
      },
      {
        key: '复制',
        label: '复制到文件夹',
        icon: <im.ImFilesEmpty />,
      },
      {
        key: '删除',
        label: '删除文件夹',
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
    item: docsCtrl.root,
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
    item: docsCtrl.root,
    menus: loadFileSysItemMenus(docsCtrl.root),
    children: buildFileSysTree(docsCtrl.root.children),
  };
};
