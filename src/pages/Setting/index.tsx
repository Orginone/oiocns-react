import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem, ITarget } from '@/ts/core';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from './components/speciesModal';
import { GroupMenuType } from './config/menuType';
import { Modal } from 'antd';

const TeamSetting: React.FC = () => {
  const [species, setSpecies] = useState<ISpeciesItem>();
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.itemType === GroupMenuType.Species) {
          setSpecies(data.item);
        } else {
          setSpecies(undefined);
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
        }
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '删除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ITarget).delete()) {
                  refreshMenu();
                }
              },
            });
            break;
          case '移除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ISpeciesItem).delete()) {
                  refreshMenu();
                }
              },
            });
            break;
          default:
            setEditTarget(data.item);
            setOperateKeys(key.split('|'));
            break;
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
      <Content key={key} selectMenu={selectMenu} species={species} />
    </MainLayout>
  );
};

export default TeamSetting;
