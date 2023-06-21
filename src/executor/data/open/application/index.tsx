import React from 'react';
import FullScreenModal from '@/executor/tools/fullScreen';
import { IApplication } from '@/ts/core';
import EntityIcon from '@/components/Common/GlobalComps/entityIcon';
import MainLayout from '@/components/MainLayout';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import Directory from '@/components/Directory';
import { loadAppMenu } from './config';

interface IProps {
  current: IApplication;
  finished: () => void;
}

/** 应用查看 */
const FormView: React.FC<IProps> = ({ current, finished }) => {
  const [key, rootMenu, selectMenu, setSelectMenu] = useMenuUpdate(() =>
    loadAppMenu(current),
  );
  if (!selectMenu || !rootMenu) return <></>;
  return (
    <FullScreenModal
      centered
      open={true}
      fullScreen
      width={'80vw'}
      title={current.name}
      bodyHeight={'80vh'}
      icon={<EntityIcon entityId={current.id} />}
      destroyOnClose
      onCancel={() => finished()}>
      <MainLayout
        notExitIcon
        menusHeight={'calc(100vh - 168px)'}
        selectMenu={selectMenu}
        onSelect={async (data) => {
          setSelectMenu(data);
        }}
        siderMenuData={rootMenu}>
        <Directory key={key} current={selectMenu.item} mode={1} />
      </MainLayout>
    </FullScreenModal>
  );
};

export default FormView;
