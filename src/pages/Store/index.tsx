import React from 'react';
import MainLayout from '@/components/MainLayout';
import Content, { TopBarExtra } from './content';
import * as config from './config/menuOperate';
import useMenuUpdate from '@/hooks/useMenuUpdate';
/** 存储模块 */
const Package: React.FC = () => {
  // const [operateTarget, setOperateTarget] = useState<MenuItemType>();
  // const [operateKey, setOperateKey] = useState<string>();
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(config.loadStoreMenu);
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <MainLayout
      selectMenu={selectMenu}
      onSelect={async (data) => {
        setSelectMenu(data);
      }}
      rightBar={<TopBarExtra key={key} selectMenu={selectMenu} />}
      onMenuClick={async (data, key) => {
        // setOperateKey(key);
        // setOperateTarget(data);
      }}
      siderMenuData={rootMenu}>
      {/* <FileSysOperate
        operateKey={operateKey}
        operateTarget={
          operateTarget?.itemType === MenuType.FileSystemItem
            ? operateTarget.item
            : undefined
        }
        operateDone={() => {
          setOperateKey(undefined);
          setOperateTarget(undefined);
        }}
      /> */}
      <Content key={key} selectMenu={selectMenu} />
    </MainLayout>
  );
};

export default Package;
