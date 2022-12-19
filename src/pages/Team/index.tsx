import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting/userCtrl';
import { ISpeciesItem, ITarget } from '@/ts/core';
import TypeSetting from './TypeSetting';
import useMenuUpdate from './hooks/useMenuUpdate';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from './components/speciesModal';
import { GroupMenuType } from './config/menuType';
const Setting: React.FC<any> = () => {
  const [species, setSpecies] = useState<ISpeciesItem>();
  const [menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.itemType === GroupMenuType.Species) {
          setSpecies(data.item);
          return;
        }
        userCtrl.currentKey = data.key;
        const item = data.item as ITarget;
        if (item && !item.speciesTree) {
          await item.loadSpeciesTree();
          refreshMenu();
        }
        if (data.itemType === GroupMenuType.Agency) {
          if (item.subTeam.length === 0) {
            const subs = await item.loadSubTeam();
            if (subs.length > 0) {
              refreshMenu();
            }
          }
        }
        setSpecies(undefined);
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        if (key === '移除') {
          if (await (data.item as ISpeciesItem).delete()) {
            refreshMenu();
          }
        } else {
          setEditTarget(data.item);
          setOperateKeys(key.split('|'));
        }
      }}
      siderMenuData={menus}>
      {/** 组织模态框 */}
      <TeamModal
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
      {/** 分类模态框 */}
      <SpeciesModal
        title={operateKeys[0]}
        open={['新增', '修改'].includes(operateKeys[0])}
        handleCancel={function (): void {
          setOperateKeys(['']);
        }}
        handleOk={(newItem) => {
          if (newItem) {
            refreshMenu();
            setOperateKeys(['']);
          }
        }}
        targetId={(selectMenu.item as ITarget)?.id}
        current={species}
      />
      <TypeSetting selectMenu={selectMenu} species={species} />
    </MainLayout>
  );
};

export default Setting;
