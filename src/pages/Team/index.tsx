import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget, TargetType } from '@/ts/core';
import TypeSetting from './TypeSetting';
import useMenuUpdate from './hooks/useMenuUpdate';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
const Setting: React.FC<any> = () => {
  const [menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        userCtrl.currentKey = data.key;
        if (data.itemType as TargetType) {
          const item = data.item as ITarget;
          if (item.subTeam.length === 0) {
            const subs = await item.loadSubTeam();
            if (subs.length > 0) {
              refreshMenu();
            }
          }
        }
        setSelectMenu(data);
      }}
      onMenuClick={async (item, key) => {
        setEditTarget(item.item);
        setOperateKeys(key.split('|'));
      }}
      siderMenuData={menus}>
      <CreateTeamModal
        title={operateKeys[0]}
        open={['新建', '编辑'].includes(operateKeys[0])}
        handleCancel={function (): void {
          setOperateKeys(['']);
        }}
        handleOk={(newItem) => {
          if (newItem) {
            refreshMenu();
            setOperateKeys(['']);
          }
        }}
        current={editTarget || userCtrl.space}
        typeNames={operateKeys.slice(1)}
      />
      <TypeSetting selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default Setting;
