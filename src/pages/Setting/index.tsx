import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting';
import { ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import TransToDict from '@/pages/Setting/content/Standard/Dict/transToDict';
import SpeciesModal from './components/speciesModal';
import { GroupMenuType } from './config/menuType';
import { Modal } from 'antd';
import { TopBarExtra } from '../Store/content';
import { IconFont } from '@/components/IconFont';
import AuthorityModal from './content/Authority/AuthorityModal';
import { SettingOutlined } from '@ant-design/icons';
import thingCtrl from '@/ts/controller/thing';

export const targetsToTreeData = (targets: ITarget[]): any[] => {
  return targets.map((t) => {
    return {
      label: t.teamName,
      value: t.id,
      children: targetsToTreeData(t.subTeam),
    };
  });
};

const TeamSetting: React.FC = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);

  if (!selectMenu) return <></>;

  return (
    <MainLayout
      headerMenu={{
        key: 'setting',
        label: '设置',
        itemType: 'setting',
        icon: <SettingOutlined />,
        children: [],
      }}
      selectMenu={selectMenu}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onSelect={async (data) => {
        if (data.itemType === GroupMenuType.Agency) {
          const item = data.item as ITarget;
          if (data.itemType === GroupMenuType.Agency) {
            if (item.subTeam.length === 0) {
              await item.loadSubTeam();
            }
          }
        }
        userCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '删除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ITarget).delete()) {
                  await thingCtrl.loadSpeciesTree(true);
                  refreshMenu();
                }
              },
            });
            break;
          case '退出':
            Modal.confirm({
              content: '确定要退出吗?',
              onOk: async () => {
                let item = data.item as ITarget;
                switch (item.typeName) {
                  case TargetType.Group:
                   await userCtrl.company.quitGroup((data.item as ITarget).id);
                    break;
                  case TargetType.Cohort:
                  await userCtrl.user.quitCohorts((data.item as ITarget).id);
                    break;
                }
                refreshMenu();
              },
            });
            break;
          case '移除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ISpeciesItem).delete()) {
                  await thingCtrl.loadSpeciesTree(true);
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
      title={{ label: '设置', icon: <IconFont type={'icon-setting'} /> }}
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
      {selectMenu.itemType !== '权限' && (
        <SpeciesModal
          title={operateKeys[0]}
          open={['新增', '修改'].includes(operateKeys[0])}
          handleCancel={function (): void {
            setOperateKeys(['']);
          }}
          handleOk={async (newItem) => {
            if (newItem) {
              refreshMenu();
              setOperateKeys(['']);
            }
          }}
          targetId={(selectMenu.item as ITarget)?.id}
          current={selectMenu.item as ISpeciesItem}
        />
      )}
      {/** 权限模态框 */}
      {selectMenu.itemType == '权限' && (
        <AuthorityModal
          title={operateKeys[0] + selectMenu.itemType}
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
          current={selectMenu.item}
        />
      )}
      {/* 分类转字典 */}
      {
        <TransToDict
          open={['转为字典'].includes(operateKeys[0])}
          setOpen={() => setOperateKeys([''])}
          currentSpeciesItem={selectMenu.item as ISpeciesItem}></TransToDict>
      }
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default TeamSetting;
