import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import {
  IBelong,
  IFileSystem,
  IFileSystemItem,
  IPropClass,
  ISpeciesItem,
  IWorkThing,
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
      key: '下载文件',
      label: '下载文件',
      icon: <im.ImDownload />,
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
const buildSpeciesTree = (species: ISpeciesItem[]): MenuItemType[] => {
  const result: MenuItemType[] = [];
  for (const item of species) {
    switch (item.metadata.typeName) {
      case SpeciesType.Store:
      case SpeciesType.Market:
      case SpeciesType.WorkThing:
      case SpeciesType.Application:
        {
          const children: MenuItemType[] = [];
          if (item.metadata.typeName === SpeciesType.WorkThing) {
            children.push(
              ...(item as IWorkThing).forms.map((i) => {
                return {
                  key: i.key,
                  item: i,
                  label: i.metadata.name,
                  icon: <TeamIcon share={item.share} size={18} fontSize={16} />,
                  itemType: MenuType.Form,
                  beforeLoad: async () => {
                    await i.loadAttributes();
                  },
                  children: [],
                };
              }),
            );
          }
          result.push({
            key: item.key,
            item: item,
            label: item.metadata.name,
            icon: (
              <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />
            ),
            itemType: MenuType.Species,
            menus: [],
            tag: [item.metadata.typeName],
            children: [...children, ...buildSpeciesTree(item.children)],
            beforeLoad: async () => {
              switch (item.metadata.typeName) {
                case SpeciesType.WorkThing:
                  await (item as IWorkThing).loadForms();
                  break;
                case SpeciesType.Store:
                  await (item as IPropClass).loadPropertys();
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

/** 加载文件系统 */
const buileFileSystem = (filesys: IFileSystem) => {
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
  const species: ISpeciesItem[] = [];
  for (const t of team.targets) {
    if (t.space === team.space) {
      for (const s of t.species) {
        switch (s.metadata.typeName) {
          case SpeciesType.Store:
          case SpeciesType.Market:
          case SpeciesType.Application:
            species.push(s);
            break;
        }
      }
    }
  }
  return [buileFileSystem(team.filesys), ...buildSpeciesTree(species)];
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
      label: company.metadata.name,
      itemType: GroupMenuType.Company,
      menus: [],
      icon: <TeamIcon share={company.share} size={18} fontSize={16} />,
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
