import FullScreenModal from '@/executor/tools/fullScreen';
import useMenuUpdate from '@/hooks/useMenuUpdate';
import { IDirectory } from '@/ts/core';
import React, { useRef } from 'react';
import { loadDirs, loadMenu } from '..';
import MappingTable from './parts/table';
import { Controller } from '@/ts/controller';
import MainLayout from '@/components/MainLayout';

interface IProps {
  current: IDirectory;
  finished: () => void;
}

const MappingModal: React.FC<IProps> = ({ current, finished }) => {
  const ctrl = useRef(new Controller(''));
  const [_, root, selected, setSelected] = useMenuUpdate(
    () => loadDirs(current),
    ctrl.current,
  );

  if (!root || !selected) return <></>;
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'映射配置'}
      onCancel={() => finished()}>
      <MainLayout
        siderMenuData={root}
        selectMenu={selected}
        onSelect={(item) => {
          setSelected(item);
          ctrl.current.changCallback();
        }}>
        <MappingTable current={selected.item} ctrl={ctrl.current} />
      </MainLayout>
    </FullScreenModal>
  );
};

export default MappingModal;
