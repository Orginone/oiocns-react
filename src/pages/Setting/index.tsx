import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import userCtrl from '@/ts/controller/setting';
import { ICompany, ISpeciesItem, ITarget, TargetType } from '@/ts/core';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from './content/Standard/SpeciesForm/speciesModal';
import { GroupMenuType } from './config/menuType';
import { Modal, message } from 'antd';
import { TopBarExtra } from '../Store/content';
import { IconFont } from '@/components/IconFont';
import { SettingOutlined } from '@ant-design/icons';
import SearchCompany from '@/bizcomponents/SearchCompany';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import { XTarget } from '@/ts/base/schema';
import { MenuItemType } from 'typings/globelType';
import { companyTypes } from '@/ts/core/enum';
import chat from '@/ts/controller/chat';
import { useHistory } from 'react-router-dom';

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
  const history = useHistory();
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  const [refreshKey, setRefreshKey] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [searchCallback, setSearchCallback] = useState<XTarget[]>();
  if (!selectMenu) return <></>;

  return (
    <MainLayout
      headerMenu={
        {
          key: 'setting',
          label: '设置',
          itemType: 'setting',
          icon: <SettingOutlined />,
          children: [],
        } as unknown as MenuItemType
      }
      selectMenu={selectMenu}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onSelect={async (data) => {
        if (data.itemType === GroupMenuType.Agency) {
          await (data.item as ITarget).loadSubTeam();
          userCtrl.changCallback();
        }
        userCtrl.currentKey = data.key;
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '删除字典':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await data.belong.dict.deleteDict(data.item.id)) {
                  refreshMenu();
                }
              },
            });
            break;
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
          case '退出':
            Modal.confirm({
              content: '确定要退出吗?',
              onOk: async () => {
                let item = data.item as ITarget;
                switch (item.typeName) {
                  case TargetType.Group:
                    userCtrl.company.quitGroup((data.item as ITarget).id);
                    break;
                  case TargetType.Cohort:
                    userCtrl.user.quitCohorts((data.item as ITarget).id);
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
                  refreshMenu();
                }
              },
            });
            break;
          case '创建单位':
            setShowFormModal(true);
            break;
          case '加入单位':
            setShowModal(true);
            break;
          case '打开会话':
            chat.setCurrent(
              chat.findTargetChat(
                data.item.target,
                data.belong.id,
                data.belong.id != userCtrl.user.id ? data.belong.teamName : '我的',
                data.item.typeName,
              ),
            );
            history.push('/chat');
            break;
          default:
            if (key.startsWith('重载')) {
              const type = key.split('|')[1];
              switch (type) {
                case TargetType.Cohort:
                  data.belong.getCohorts(true);
                  break;
                case TargetType.Department:
                  (data.belong as ICompany).getDepartments(true);
                  break;
                case TargetType.Group:
                  (data.belong as ICompany).getJoinedGroups(true);
                  break;
                case TargetType.Station:
                  (data.belong as ICompany).getStations(true);
                  break;
              }
              userCtrl.changCallback();
            } else {
              setEditTarget(data.item);
              setOperateKeys(key.split('|'));
            }
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
        current={editTarget || userCtrl.user}
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
      {/** 单位 */}
      <CreateTeamModal
        title={'新建'}
        open={showFormModal}
        handleCancel={function (): void {
          setShowFormModal(false);
        }}
        handleOk={(item) => {
          if (item) {
            setShowFormModal(false);
            setRefreshKey(key);
            refreshMenu();
          }
        }}
        current={userCtrl.user}
        typeNames={companyTypes}
      />
      <Modal
        title="加入单位"
        width={670}
        destroyOnClose={true}
        open={showModal}
        bodyStyle={{ padding: 0 }}
        okText="确定"
        onOk={async () => {
          // 加入单位
          setShowModal(false);
          if (searchCallback && searchCallback.length > 0) {
            searchCallback.forEach(async (company) => {
              if (
                await userCtrl.user.applyJoinCompany(
                  company.id,
                  company.typeName as TargetType,
                )
              ) {
                message.success('已申请加入单位成功.');
              }
            });
          }
        }}
        onCancel={() => {
          setShowModal(false);
        }}>
        <SearchCompany
          searchCallback={setSearchCallback}
          searchType={TargetType.Company}
        />
      </Modal>
      <Content key={key} selectMenu={selectMenu} refreshKey={refreshKey} />
    </MainLayout>
  );
};

export default TeamSetting;
