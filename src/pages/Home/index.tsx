import React, { useEffect, useState } from 'react';
import MainLayout from './layout';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { MenuItemType } from 'typings/globelType';
import { command } from '@/ts/base';
/** 首页 */
const FileBrowser: React.FC = () => {
  const [menus, setMenus] = useState<MenuItemType>();
  useEffect(() => {
    config.loadBrowserMenu().then((res) => {
      setMenus(res as MenuItemType);
    });
  }, []);
  useEffect(() => {
    const id = command.subscribeByFlag('home', () => {
      config.loadBrowserMenu().then((res) => {
        setMenus({ ...res } as MenuItemType);
      });
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  if (menus) {
    return <Budget menus={menus} />;
  }
  return <></>;
};

const Budget: React.FC<{ menus: MenuItemType }> = ({ menus }) => {
  const [, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() => {
    return menus;
  });
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      previewFlag={'budget'}
      rootMenu={rootMenu}
      selectMenu={selectMenu}
      onSelect={async (data) => {
        if (data.item) {
          command.emitter('preview', 'budget', data.item);
        }
        setSelectMenu(data);
      }}
      siderMenuData={rootMenu}
    />
  );
};

export default FileBrowser;
