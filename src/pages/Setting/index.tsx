import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import orgCtrl from '@/ts/controller';
import { ICompany, ISpace, ITarget, TargetType } from '@/ts/core';
import Content from './content';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from './content/Standard/SpeciesForm/speciesModal';
import { GroupMenuType, MenuType } from './config/menuType';
import { Modal, message } from 'antd';
import { TopBarExtra } from '../Store/content';
import SearchCompany from '@/bizcomponents/SearchCompany';
import CreateTeamModal from '@/bizcomponents/GlobalComps/createTeam';
import { XTarget } from '@/ts/base/schema';
import { companyTypes } from '@/ts/core/enum';
import { useHistory } from 'react-router-dom';
import { ISpeciesItem } from '@/ts/core';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';
import DictModal from './content/Dict/dictModal';
import PropertyModal from './content/Property/modal';
import AuthorityModal from './content/Authority/modal';

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
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadSettingMenu,
  );
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  const [refreshKey, setRefreshKey] = useState<string>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [searchCallback, setSearchCallback] = useState<XTarget[]>();
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onSelect={async (data) => {
        switch (data.itemType) {
          case GroupMenuType.SpeciesGroup:
            await (data.item as ITarget).loadSpeciesTree();
            break;
          case GroupMenuType.DictGroup:
            await (data.item as ISpace).dict.loadDict();
            break;
        }
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '删除字典':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await data.item.belong.dict.deleteDict(data.item.dict.id)) {
                  setSelectMenu(selectMenu.parentMenu!);
                }
              },
            });
            break;
          case '删除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ITarget).delete()) {
                  setSelectMenu(selectMenu.parentMenu!);
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
                    // orgCtrl.company.quitGroup((data.item as ITarget).id);
                    break;
                  case TargetType.Cohort:
                    orgCtrl.user.quitCohorts((data.item as ITarget).id);
                    break;
                }
                setSelectMenu(selectMenu.parentMenu!);
              },
            });
            break;
          case '移除':
            Modal.confirm({
              content: '确定要删除吗?',
              onOk: async () => {
                if (await (data.item as ISpeciesItem).delete()) {
                  setSelectMenu(selectMenu.parentMenu!);
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
            history.push('/chat');
            break;
          default:
            if (key.startsWith('重载')) {
              const type = key.split('|')[1];
              switch (type) {
                case TargetType.Cohort:
                  data.item.getCohorts(true);
                  break;
                case TargetType.Department:
                  (data.item as ICompany).getDepartments(true);
                  break;
                case TargetType.Group:
                  (data.item as ICompany).getJoinedGroups(true);
                  break;
                case TargetType.Station:
                  (data.item as ICompany).getStations(true);
                  break;
              }
              orgCtrl.changCallback();
            } else {
              setEditTarget(data.item);
              setOperateKeys(key.split('|'));
            }
            break;
        }
      }}
      siderMenuData={rootMenu}>
      {/** 组织模态框 */}
      <TeamModal
        title={operateKeys[0]}
        open={['新建', '编辑'].includes(operateKeys[0])}
        handleCancel={function (): void {
          setOperateKeys(['']);
        }}
        handleOk={(newItem) => {
          if (newItem) {
            setSelectMenu(selectMenu);
            setOperateKeys(['']);
          }
        }}
        current={editTarget || orgCtrl.user}
        typeNames={operateKeys.slice(1)}
      />
      {/** 字典模态框 */}
      {(selectMenu.itemType == MenuType.Dict ||
        selectMenu.itemType == GroupMenuType.DictGroup) &&
        ['新增', '修改'].includes(operateKeys[0]) && (
          <DictModal
            title={operateKeys[0] + '字典'}
            space={
              selectMenu.itemType == MenuType.Dict
                ? selectMenu.item.belong
                : selectMenu.item
            }
            open={['新增', '修改'].includes(operateKeys[0])}
            handleCancel={() => setOperateKeys([''])}
            data={selectMenu.itemType == MenuType.Dict ? selectMenu.item.dict : undefined}
            handleOk={(success) => {
              if (success) {
                message.success('操作成功');
                setOperateKeys(['']);
              }
            }}
          />
        )}
      {/** 属性模态框 */}
      {selectMenu.itemType == MenuType.Property && '新增' == operateKeys[0] && (
        <PropertyModal
          space={selectMenu.item}
          data={undefined}
          open={'新增' == operateKeys[0]}
          handleCancel={() => {
            setOperateKeys(['']);
          }}
          handleOk={(success) => {
            if (success) {
              message.success('操作成功');
              setOperateKeys(['']);
            }
          }}
        />
      )}
      {/** 分类模态框 */}
      {selectMenu.itemType === MenuType.Species && (
        <SpeciesModal
          title={operateKeys[0]}
          open={['新增', '修改'].includes(operateKeys[0])}
          handleCancel={() => setOperateKeys([''])}
          handleOk={(newItem) => {
            if (newItem) {
              setSelectMenu(selectMenu);
              setOperateKeys(['']);
            }
          }}
          current={selectMenu.item}
        />
      )}
      {/** 权限模态框 */}
      {selectMenu.itemType == MenuType.Authority &&
        ['新增', '修改'].includes(operateKeys[0]) && (
          <AuthorityModal
            open={['新增', '修改'].includes(operateKeys[0])}
            current={selectMenu.item}
            title={operateKeys[0] + '权限'}
            handleCancel={() => setOperateKeys([''])}
            handleOk={(success) => {
              if (success) {
                setSelectMenu(selectMenu);
                setOperateKeys(['']);
              }
            }}
          />
        )}
      {/** 单位 */}
      <CreateTeamModal
        title={'新建单位'}
        open={showFormModal}
        handleCancel={function (): void {
          setShowFormModal(false);
        }}
        handleOk={(item) => {
          if (item) {
            setShowFormModal(false);
            setRefreshKey(key);
            setSelectMenu(selectMenu);
          }
        }}
        current={orgCtrl.user}
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
                await orgCtrl.user.applyJoinCompany(
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
