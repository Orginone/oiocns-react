import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget, TargetType } from '@/ts/core';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import useMenuUpdate from './hooks/useMenuUpdate';
import CompanySetting from './componments/Company';
import { MenuItemType } from 'typings/globelType';
const Setting: React.FC<any> = () => {
  const [menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [edit, setEdit] = useState<ITarget>();
  const [activeModal, setActiveModal] = useState<string[]>(['']); // 模态框
  const getTargetOfMenu = (menu: MenuItemType) => {
    if (menu.item) {
      const item = menu.item as ITarget;
      if (item && item.id?.length > 0) {
        return item;
      }
    }
  };
  const getBody = () => {
    const current = getTargetOfMenu(selectMenu);
    if (current) {
      switch (current.typeName) {
        case TargetType.Company:
        case TargetType.Hospital:
        case TargetType.University:
          return <CompanySetting />;
      }
    }
    return <></>;
  };

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        userCtrl.currentKey = data.key;
        const item = getTargetOfMenu(data);
        if (item && item.subTeam.length === 0) {
          await item.loadSubTeam();
          refreshMenu();
        }
        setSelectMenu(data);
      }}
      onMenuClick={(item, key) => {
        setEdit(item.item);
        setActiveModal(key.split('|'));
      }}
      siderMenuData={menus}>
      <CreateTeamModal
        title={activeModal[0]}
        open={['新建', '编辑'].includes(activeModal[0])}
        handleCancel={function (): void {
          setActiveModal(['']);
        }}
        handleOk={(newItem) => {
          if (newItem) {
            refreshMenu();
            setActiveModal(['']);
          }
        }}
        current={edit || userCtrl.space}
        typeNames={activeModal.slice(1)}
      />
      {getBody()}
    </MainLayout>
  );
};

export default Setting;
