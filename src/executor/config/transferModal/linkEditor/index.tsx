import FullScreenModal from '@/executor/tools/fullScreen';
import { ITransfer } from '@/ts/core';
import React, { useEffect } from 'react';
import TransferEditor from './graph';
import { ToolBar } from './tools';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

const TransferModal: React.FC<IProps> = ({ current, finished }) => {
  useEffect(() => current.machine('Edit'));
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
      <TransferEditor current={current} />
      <ToolBar current={current} />
    </FullScreenModal>
  );
};

export default TransferModal;
