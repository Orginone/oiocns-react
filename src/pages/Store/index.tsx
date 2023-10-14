import React from 'react';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import Directory from '@/components/Directory';
/** 文件浏览器 */
const FileBrowser: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadBrowserMenu,
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      previewFlag={'store'}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Directory key={key} current={selectMenu.item} previewFlag={'store'} />
    </MainLayout>
  );
};

export default FileBrowser;
