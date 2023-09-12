import FullScreenModal from '@/executor/tools/fullScreen';
import { ITransfer } from '@/ts/core';
import React from 'react';
import LinkEditor from './graph';
import { ToolBar } from './tools';

export type Retention = 'runtime' | 'configuration';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

const LinkModal: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'链接配置'}
      onCancel={() => finished()}>
      <LinkEditor current={current} />
      <ToolBar current={current} />
    </FullScreenModal>
  );
};

export default LinkModal;
