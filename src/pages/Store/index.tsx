import React from 'react';
import Content from './content';
import MainLayout from '@/components/MainLayout';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
/** 文件浏览器 */
const FileBrowser: React.FC = () => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(
    config.loadBrowserMenu,
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      rightShow
      leftShow={false}
      previewFlag={'store'}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}>
      <Content key={key} current={selectMenu.item} />
    </MainLayout>
  );
};

export default FileBrowser;
