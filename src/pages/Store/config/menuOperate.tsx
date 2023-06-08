import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/entityIcon';
import {
  IBelong,
  IFileSystem,
  IFileSystemItem,
  ISpeciesItem,
  IThingClass,
  SpeciesType,
} from '@/ts/core';
import OrgIcons from '@/bizcomponents/GlobalComps/orgIcons';

/** 编译文件系统树 */
const buildFileSysTree = (targets: IFileSystemItem[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    if (item.metadata.isDirectory) {
      result.push({
        key: item.key,
        item: item,
        label: item.metadata.name,
        tag: ['目录'],
        itemType: MenuType.FileSystemItem,
        menus: loadFileSysItemMenus(item),
        icon: <im.ImFolder color="#c09553" />,
        expIcon: <im.ImFolderOpen color="#c09553" />,
        children: buildFileSysTree(item.children),
        beforeLoad: async () => {
          await item.loadChildren();
        },
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
  if (rightClick || !item.hasOperateAuth(false)) return menus;
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

/** 编译组织分类树 */
const buildThingTree = (species: ISpeciesItem[]): MenuItemType[] => {
  const result: MenuItemType[] = [];
  for (const item of species) {
    switch (item.typeName) {
      case SpeciesType.Thing:
        {
          result.push({
            key: item.key,
            item: item,
            label: item.name,
            icon: (
              <TeamIcon
                notAvatar={true}
                entityId={item.id}
                typeName={item.typeName}
                size={18}
              />
            ),
            itemType: MenuType.Species,
            menus: [],
            tag: [item.typeName],
            children: [
              ...buildThingMenus(item as IThingClass),
              ...buildThingTree(item.children),
            ],
            beforeLoad: async () => {
              switch (item.typeName) {
                case SpeciesType.Thing:
                  await (item as IThingClass).loadForms();
                  break;
              }
            },
          });
        }
        break;
    }
  }
  return result;
};

/** 加载实体类菜单 */
const buildThingMenus = (thing: IThingClass) => {
  const children: MenuItemType[] = [];
  if (thing.typeName === SpeciesType.Thing) {
    thing.forms.forEach((form) => {
      children.push({
        key: form.key,
        item: form,
        label: form.name,
        icon: <TeamIcon entityId={form.id} typeName={form.typeName} size={18} />,
        itemType: MenuType.Form,
        beforeLoad: async () => {
          await form.loadAttributes();
        },
        children: [],
      });
    });
  }
  return children;
};

/** 加载文件系统 */
const buildFileSystem = (filesys: IFileSystem) => {
  return {
    key: filesys.key,
    item: filesys.home,
    label: '文件存储',
    icon: <im.ImDrawer fontSize={22} />,
    expIcon: <im.ImDrawer2 fontSize={22} />,
    itemType: MenuType.FileSystemItem,
    menus: loadFileSysItemMenus(filesys.home),
    tag: ['根目录'],
    children: buildFileSysTree(filesys.home.children),
    beforeLoad: async () => {
      await filesys.home?.loadChildren();
    },
  };
};

const loadChildren = (team: IBelong) => {
  const things: ISpeciesItem[] = [];
  for (const s of team.species) {
    switch (s.typeName) {
      case SpeciesType.Thing:
        things.push(s);
        break;
    }
  }
  return [buildFileSystem(team.filesys), ...buildThingTree(things)];
};
/** 获取个人菜单 */
const getUserMenu = () => {
  return {
    key: orgCtrl.user.key,
    item: orgCtrl.user,
    label: orgCtrl.user.name,
    itemType: GroupMenuType.User,
    icon: (
      <TeamIcon entityId={orgCtrl.user.id} typeName={orgCtrl.user.typeName} size={18} />
    ),
    menus: [],
    children: loadChildren(orgCtrl.user),
  };
};

/** 获取组织菜单 */
const getTeamMenu = () => {
  const children: MenuItemType[] = [];
  for (const company of orgCtrl.user.companys) {
    children.push({
      key: company.key,
      item: company,
      label: company.name,
      itemType: GroupMenuType.Company,
      menus: [],
      icon: <TeamIcon entityId={company.id} typeName={company.typeName} size={18} />,
      children: loadChildren(company),
    });
  }
  return children;
};

/** 获取存储模块菜单 */
export const loadStoreMenu = () => {
  return {
    key: '存储',
    label: '存储',
    itemType: 'group',
    icon: <OrgIcons store />,
    children: [getUserMenu(), ...getTeamMenu()],
  } as MenuItemType;
};
