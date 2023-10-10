import React from 'react';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { Empty } from 'antd';
/** 文件浏览器 */
const FileBrowser: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadBrowserMenu,
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <div style={{ height: '100%', width: '100%' }}>
        <Empty style={{ marginTop: 150 }} key={key} />
      </div>
    </MainLayout>
  );
};

export default FileBrowser;
