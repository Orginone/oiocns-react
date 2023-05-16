import orgCtrl from '@/ts/controller';
import React from 'react';
import * as im from 'react-icons/im';
import * as fa from 'react-icons/fa';
import { MenuItemType, OperateMenuType } from 'typings/globelType';
import { GroupMenuType, MenuType } from './menuType';
import TeamIcon from '@/bizcomponents/GlobalComps/teamIcon';
import {
  ICommodity,
  IFileSystem,
  IFileSystemItem,
  IPropClass,
  ISpeciesItem,
  ITarget,
  IWork,
  IWorkForm,
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
        menus: loadFileSysItemMenus(),
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
    if (item.metadata.typeName === SpeciesType.WorkForm) {
      result.push(buildFormMenu(item as IWorkForm));
    } else {
      switch (item.metadata.typeName) {
        case SpeciesType.FileSystem:
          {
            const filesys = item as IFileSystem;
            result.push({
              key: item.key,
              item: filesys.home,
              label: item.metadata.name,
              icon: (
                <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />
              ),
              itemType: MenuType.FileSystemItem,
              menus: loadFileSysItemMenus(),
              tag: [item.metadata.typeName],
              children: buildFileSysTree(filesys.home ? filesys.home.children : []),
              beforeLoad: async () => {
                await filesys.home?.loadChildren();
              },
            });
          }
          break;
        case SpeciesType.Store:
        case SpeciesType.Market:
        case SpeciesType.WorkForm:
        case SpeciesType.AppModule:
        case SpeciesType.Commodity:
        case SpeciesType.Application:
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
            children: buildSpeciesTree(item.children),
            beforeLoad: async () => {
              switch (item.metadata.typeName) {
                case SpeciesType.Market:
                case SpeciesType.WorkItem:
                  await (item as IWork).loadWorkDefines();
                  break;
                case SpeciesType.Commodity:
                  await (item as ICommodity).loadForm();
                  break;
                case SpeciesType.Store:
                  await (item as IPropClass).loadPropertys();
                  break;
              }
            },
          });
          break;
      }
    }
  }
  return result;
};

/** 编译表单项菜单 */
const buildFormMenu = (form: IWorkForm): MenuItemType => {
  return {
    key: form.key,
    item: form,
    label: form.metadata.name,
    tag: [form.metadata.typeName],
    icon: <TeamIcon share={form.share} size={18} fontSize={16} />,
    itemType: MenuType.Species,
    children: form.forms.map((i) => {
      return {
        key: i.key,
        item: i,
        label: i.metadata.name,
        icon: <TeamIcon share={form.share} size={18} fontSize={16} />,
        itemType: MenuType.Form,
        beforeLoad: async () => {
          await i.loadAttributes();
        },
      } as MenuItemType;
    }),
    beforeLoad: async () => {
      await form.loadForms();
    },
  };
};

/** 编译组织树 */
const buildTargetTree = (targets: ITarget[]) => {
  const result: MenuItemType[] = [];
  for (const item of targets) {
    if (item.species.length > 0) {
      result.push({
        key: item.key,
        item: item,
        label: item.metadata.name,
        itemType: item.metadata.typeName,
        menus: [],
        tag: [item.metadata.typeName],
        icon: <TeamIcon notAvatar={true} share={item.share} size={18} fontSize={16} />,
        children: buildSpeciesTree(item.species),
      });
    }
  }
  return result;
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
      ...buildSpeciesTree(orgCtrl.user.species),
      ...buildTargetTree(orgCtrl.user.cohorts),
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
        ...buildSpeciesTree(company.species),
        ...buildTargetTree(company.targets.slice(1)),
      ],
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
