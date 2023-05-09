import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import orgCtrl from '@/ts/controller';
import { ITarget, TargetType } from '@/ts/core';
import Content from './content';
import TeamModal from '@/bizcomponents/GlobalComps/createTeam';
import SpeciesModal from '@/bizcomponents/GlobalComps/createSpecies';
import AuthorityModal from '@/bizcomponents/GlobalComps/createAuthority';
import DictModal from '@/bizcomponents/GlobalComps/createDict';
import { GroupMenuType, MenuType } from './config/menuType';
import { Modal, message } from 'antd';
import SearchTarget from '@/bizcomponents/SearchCompany';
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
  const [operateKey, setOperateKey] = useState<string>('');
  const [searchCallback, setSearchCallback] = useState<XTarget[]>();
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={(data) => {
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
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
          case '打开会话':
            history.push('/chat');
            break;
          default:
            setEditTarget(data.item);
            setOperateKey(key);
            break;
        }
      }}
      siderMenuData={rootMenu}>
      {/** 组织模态框 */}
      <TeamModal
        isEdit={operateKey.includes('编辑')}
        title={operateKey.split('|')[0]}
        open={operateKey.includes('用户')}
        handleCancel={() => setOperateKey('')}
        handleOk={(newItem) => {
          if (newItem) {
            setOperateKey('');
            setSelectMenu(selectMenu);
          }
        }}
        current={editTarget || orgCtrl.user}
        typeNames={operateKey.split('|')}
      />
      {/** 字典模态框 */}
      <DictModal
        title={operateKey}
        space={
          selectMenu.itemType == GroupMenuType.DictGroup ? selectMenu.item : undefined
        }
        open={operateKey.includes('字典')}
        handleCancel={() => setOperateKey('')}
        dict={selectMenu.itemType == MenuType.Dict ? selectMenu.item : undefined}
        handleOk={(success) => {
          if (success) {
            setOperateKey('');
            setSelectMenu(selectMenu);
          }
        }}
      />
      {/** 分类模态框 */}
      <SpeciesModal
        title={operateKey}
        open={operateKey.includes('类别')}
        handleCancel={() => setOperateKey('')}
        handleOk={(newItem) => {
          if (newItem) {
            setOperateKey('');
            setSelectMenu(selectMenu);
          }
        }}
        current={selectMenu.item}
        species={selectMenu.itemType === MenuType.Species ? selectMenu.item : undefined}
      />
      {/** 权限模态框 */}
      <AuthorityModal
        title={operateKey}
        open={operateKey.includes('权限')}
        current={selectMenu.item}
        handleCancel={() => setOperateKey('')}
        handleOk={(success) => {
          if (success) {
            setOperateKey('');
            setSelectMenu(selectMenu);
          }
        }}
      />
      <Modal
        title={'搜索' + operateKey.split('|')[1]}
        open={operateKey.includes('加入')}
        width={670}
        destroyOnClose={true}
        bodyStyle={{ padding: 0 }}
        okText="确定"
        onOk={async () => {
          setOperateKey('');
          await orgCtrl.user.applyJoin(searchCallback || []);
          message.success('已申请加入成功.');
        }}
        onCancel={() => setOperateKey('')}>
        <SearchTarget
          searchCallback={setSearchCallback}
          searchType={
            operateKey.includes('单位') ? TargetType.Company : TargetType.Cohort
          }
        />
      </Modal>
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default TeamSetting;
