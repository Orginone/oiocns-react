import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Content from './content';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';
import { IAuthority } from '@/ts/core';
import FullScreenModal from '@/executor/tools/fullScreen';
import CreateAuthority from './createAuthority';

interface IProps {
  current: IAuthority;
  finished: () => void;
}

const AuthorityModal: React.FC<IProps> = (props) => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() =>
    config.loadSettingMenu(props.current),
  );
  const [operateKey, setOperateKey] = useState<string>('');
  if (!selectMenu || !rootMenu) return <></>;
  const loadAuthorityModal = () => {
    return operateKey.includes('权限') ? (
      <CreateAuthority
        open
        title={operateKey}
        current={selectMenu.item}
        handleCancel={() => {
          setOperateKey('');
        }}
        handleOk={() => {
          setOperateKey('');
          setSelectMenu(selectMenu);
        }}
      />
    ) : (
      <></>
    );
  };
  return (
    <FullScreenModal
      open
      onCancel={props.finished}
      width="80vw"
      bodyHeight="60vh"
      title="权限设置"
      destroyOnClose
      footer={[]}>
      <MainLayout
        notExitIcon
        selectMenu={selectMenu}
        onSelect={(data) => {
          setSelectMenu(data);
        }}
        onMenuClick={async (_data, key) => {
          setOperateKey(key);
        }}
        siderMenuData={rootMenu}>
        <Content key={key} current={selectMenu.item} />
      </MainLayout>
      {loadAuthorityModal()}
    </FullScreenModal>
  );
};

export default AuthorityModal;
