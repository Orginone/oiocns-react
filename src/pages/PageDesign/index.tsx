import { MdImportantDevices } from 'react-icons/md';
import MainLayout from '@/components/MainLayout';
import setting from '@/ts/controller/setting';
import React, { useEffect, useState } from 'react';
import Content from './content';
import useMenuUpdate from './hooks/useMenuUpdate';
import { TopBarExtra } from '../Store/content';
import { Modal } from 'antd';

const PageSetting: React.FC<any> = () => {
  const [key, menus, refreshMenu, selectMenu, setSelectMenu] = useMenuUpdate();
  const [OpenKeys, setOpenKeys] = useState<string>('');
  useEffect(() => {
    refreshMenu();
  }, [setting.space.id]);

  if (!selectMenu) return <></>;

  return (
    <MainLayout
      title={{ label: '页面管理', icon: <MdImportantDevices size={15} /> }}
      selectMenu={selectMenu}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      onMenuClick={async (data, key) => {
        switch (key) {
          case '新建页面':
            Modal.confirm({
              content: '确定要新建页面吗?',
              onOk: async () => {
                setOpenKeys('openDesign');
              },
            });
            break;
          default:
            break;
        }
      }}
      siderMenuData={menus}>
      <Content selectMenu={selectMenu as any} />
    </MainLayout>
  );
};

export default PageSetting;
