import { TransferModal } from '@/executor/design/transferModal';
import { ITransfer } from '@/ts/core';
import React from 'react';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

const TransferView: React.FC<IProps> = ({ current, finished }) => {
  return (
    <TransferModal
      title={'数据迁移'}
      status={'Viewable'}
      event={'ViewRun'}
      current={current}
      finished={finished}
    />
  );
};

export default TransferView;
