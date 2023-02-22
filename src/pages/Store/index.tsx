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
  const [contentKey, setContentKey] = useState<string>();
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
            setContentKey(getUuid());
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
        setContentKey(getUuid());
      }}
      tabKey={storeCtrl.tabIndex}
      onCheckedChange={async (checkedList: any[]) => {
        if (
          checkedList[0]?.itemType === GroupMenuType.Thing ||
          checkedList[0]?.itemType === GroupMenuType.Wel
        ) {
          await storeCtrl.addCheckedSpeciesList(
            checkedList.map((cd) => cd.item),
            userCtrl.space.id,
          );
        }
        setCheckedList(checkedList);
        refreshMenu();
        setContentKey(getUuid());
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
      <Content key={contentKey} selectMenu={selectMenu} checkedList={checkedList} />
    </MainLayout>
  );
};

export default Package;
