import React, { useState } from 'react';
import storeCtrl from '@/ts/controller/store';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from './hooks/useMenuUpdate';
import { GroupMenuType } from './config/menuType';
import { IFileSystemItem } from '@/ts/core';
import Content, { TopBarExtra } from './content';
import { MenuItemType } from 'typings/globelType';
import FileSysOperate from './components/FileSysOperate';
import { getUuid } from '@/utils/tools';
import userCtrl from '@/ts/controller/setting';
/** 仓库模块 */
const Package: React.FC = () => {
  const [operateTarget, setOperateTarget] = useState<MenuItemType>();
  const [operateKey, setOperateKey] = useState<string>();
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [checkedList, setCheckedList] = useState<any[]>([]);
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        storeCtrl.currentKey = data.key;
        if (data.itemType === GroupMenuType.FileSystemItem) {
          const item = data.item as IFileSystemItem;
          if (item.children.length === 0 && (await item.loadChildren())) {
            refreshMenu();
          }
        }
        if (
          data.itemType === GroupMenuType.Thing ||
          data.itemType === GroupMenuType.Wel
        ) {
          storeCtrl.addCheckedSpeciesList([data.item], userCtrl.space.id);
        }

        setSelectMenu(data);
      }}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onMenuClick={async (data, key) => {
        setOperateKey(key);
        setOperateTarget(data);
      }}
      checkedList={checkedList}
      onTabChanged={(tabKey) => {
        storeCtrl.setTabIndex(tabKey);
        setCheckedList([]);
        refreshMenu();
      }}
      tabKey={storeCtrl.tabIndex}
      onCheckedChange={async (checks: any[]) => {
        if (
          checks &&
          (checks[0]?.itemType === GroupMenuType.Thing ||
            checks[0]?.itemType === GroupMenuType.Wel)
        ) {
          await storeCtrl.addCheckedSpeciesList(
            checks.map((cd) => cd.item),
            userCtrl.space.id,
          );
        }
        setCheckedList(checks);
        refreshMenu();
      }}
      siderMenuData={menus[0]?.menu}
      tabs={menus}>
      <FileSysOperate
        operateKey={operateKey}
        operateTarget={
          operateTarget?.itemType === GroupMenuType.FileSystemItem
            ? operateTarget.item
            : undefined
        }
        operateDone={() => {
          setOperateKey(undefined);
          setOperateTarget(undefined);
        }}
      />
      <Content
        key={checkedList.length}
        selectMenu={selectMenu}
        checkedList={checkedList}
      />
    </MainLayout>
  );
};

export default Package;
