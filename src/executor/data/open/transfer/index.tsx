import TransferEditor from '@/executor/config/transferModal/linkEditor/graph';
import { ToolBar } from '@/executor/config/transferModal/linkEditor/tools';
import FullScreenModal from '@/executor/tools/fullScreen';
import { ITransfer } from '@/ts/core';
import React, { useEffect } from 'react';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

const TransferView: React.FC<IProps> = ({ current, finished }) => {
  useEffect(() => current.machine('View'));
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

export default TransferView;
