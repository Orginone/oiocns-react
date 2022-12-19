import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ITarget, TargetType } from '@/ts/core';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import useMenuUpdate from './hooks/useMenuUpdate';
import CompanySetting from './componments/Company';
import StationSetting from './componments/Station';
import AgencySetting from './componments/Agency';
import CohortSetting from './componments/Cohort';
import PersonSetting from './componments/Person';
const Setting: React.FC<any> = () => {
  const [menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [edit, setEdit] = useState<ITarget>();
  const [activeModal, setActiveModal] = useState<string[]>(['']); // 模态框
  const getBody = () => {
    switch (selectMenu.itemType) {
      case TargetType.Person:
        return <PersonSetting />;
      case TargetType.Company:
      case TargetType.Hospital:
      case TargetType.University:
        return <CompanySetting />;
      case TargetType.Group:
      case TargetType.College:
      case TargetType.Office:
      case TargetType.Section:
      case TargetType.Research:
      case TargetType.Laboratory:
      case TargetType.Department:
        return <AgencySetting current={selectMenu.item} />;
      case TargetType.Station:
        return <StationSetting current={selectMenu.item} />;
      case TargetType.JobCohort:
      case TargetType.Cohort:
        return <CohortSetting current={selectMenu.item} />;
      default:
        return <></>;
    }
  };

  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
        userCtrl.currentKey = data.key;
        if (data.itemType as TargetType) {
          const item = data.item as ITarget;
          if (item && item.subTeam.length === 0) {
            if ((await item.loadSubTeam()).length > 0) {
              refreshMenu();
            }
          }
        }
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
