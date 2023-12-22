import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import orgCtrl from '@/ts/controller';
import React from 'react';
import OrgIcons from '@/components/Common/GlobalComps/orgIcons';
import { loadFileMenus } from '@/executor/fileOperate';

/** 获取常用菜单 */
const getCommons = async () => {
  const commons = await orgCtrl.loadCommons();
  const typeCommons: any = {};
  commons.forEach((item) => {
    typeCommons[item.typeName] = typeCommons[item.typeName] || [];
    typeCommons[item.typeName].push(item);
  });
  return {
    key: 'common',
    label: '常用目录',
    itemType: '常用',
    children: Object.keys(typeCommons).map((typeName) => {
      return {
        key: typeName,
        label: typeName,
        itemType: typeName,
        type: 'group',
        children: typeCommons[typeName].map((item: any) => {
          return {
            key: item.key,
            item: item,
            label: item.name,
            itemType: item.typeName,
            menus: loadFileMenus(item),
            tag: [item.typeName],
            icon: <EntityIcon entity={item.metadata} size={18} />,
          };
        }),
      };
    }),
  };
};

/** 获取群动态 */
const getCohortActivitys = () => {
  return {
    key: 'cohort',
    item: 'cohort',
    label: '工作动态',
    itemType: '动态',
  };
};

/** 获取好友动态 */
const getFriendActivitys = () => {
  return {
    key: 'friend',
    item: 'friend',
    label: '同事交流',
    itemType: '动态',
  };
};

/** 加载数据模块菜单 */
export const loadBrowserMenu = async () => {
  return {
    key: 'disk',
    label: '首页',
    itemType: 'Tab',
    item: 'disk',
    icon: <OrgIcons home />,
    children: [await getCommons(), getCohortActivitys(), getFriendActivitys()],
  };
};
