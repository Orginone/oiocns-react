import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import orgCtrl from '@/ts/controller';
import { ITarget, TargetType, companyTypes } from '@/ts/core';
import Content from './content';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from '@/bizcomponents/GlobalComps/createSpecies';
import AuthorityModal from '@/bizcomponents/GlobalComps/createAuthority';
import DictModal from '@/bizcomponents/GlobalComps/createDict';
import { GroupMenuType, MenuType } from './config/menuType';
import { Modal, message } from 'antd';
import SearchCompany from '@/bizcomponents/SearchCompany';
import { XTarget } from '@/ts/base/schema';
import { useHistory } from 'react-router-dom';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';

const TeamSetting: React.FC = () => {
  const history = useHistory();
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadSettingMenu,
  );
  const [editTarget, setEditTarget] = useState<ITarget>();
  const [operateKeys, setOperateKeys] = useState<string[]>(['']);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [searchCallback, setSearchCallback] = useState<XTarget[]>();
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.onClick) {
          await data.onClick();
        }
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '回退':
            if (selectMenu.parentMenu) {
              setSelectMenu(selectMenu.parentMenu);
            }
            break;
          case '刷新':
            setSelectMenu(selectMenu);
            break;
          case '退出':
            Modal.confirm({
              content: '确定要退出吗?',
              onOk: async () => {
                let item = data.item as ITarget;
                await item.exit();
                setSelectMenu(selectMenu.parentMenu!);
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
            setEditTarget(data.item);
            setOperateKeys(key.split('|'));
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
              selectMenu.itemType == GroupMenuType.DictGroup ? selectMenu.item : undefined
            }
            open={['新增', '修改'].includes(operateKeys[0])}
            handleCancel={() => setOperateKeys([''])}
            dict={selectMenu.itemType == MenuType.Dict ? selectMenu.item : undefined}
            handleOk={() => {
              setOperateKeys(['']);
              setSelectMenu(selectMenu);
            }}
          />
        )}
      {/** 分类模态框 */}
      {operateKeys.length > 1 && operateKeys[1] === '类别' && (
        <SpeciesModal
          title={operateKeys[0]}
          open={true}
          handleCancel={() => setOperateKeys([''])}
          handleOk={(newItem) => {
            if (newItem) {
              setOperateKeys(['']);
              setSelectMenu(selectMenu);
            }
          }}
          current={selectMenu.item}
          species={selectMenu.itemType === MenuType.Species ? selectMenu.item : undefined}
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
      <TeamModal
        title={'新建单位'}
        open={showFormModal}
        handleCancel={function (): void {
          setShowFormModal(false);
        }}
        handleOk={(item) => {
          if (item) {
            setShowFormModal(false);
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
          await orgCtrl.user.applyJoin(searchCallback || []);
          message.success('已申请加入单位成功.');
        }}
        onCancel={() => {
          setShowModal(false);
        }}>
        <SearchCompany
          searchCallback={setSearchCallback}
          searchType={TargetType.Company}
        />
      </Modal>
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default TeamSetting;
