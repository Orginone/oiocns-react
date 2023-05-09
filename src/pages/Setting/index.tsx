import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { ITarget } from '@/ts/core';
import Content from './content';
import Operate from './operate';
import { Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import * as config from './config/menuOperate';

const TeamSetting: React.FC = () => {
  const history = useHistory();
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadSettingMenu,
  );
  const [operateKey, setOperateKey] = useState<string>('');
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
            setOperateKey(key);
            break;
        }
      }}
      siderMenuData={rootMenu}>
      {operateKey != '' ? (
        <Operate
          selectMenu={selectMenu}
          operateKey={operateKey}
          confrim={() => {
            setOperateKey('');
            setSelectMenu(selectMenu);
          }}
        />
      ) : (
        <></>
      )}
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default TeamSetting;
