import { TransferRunning } from '@/executor/design/transferModal';
import { ITransfer } from '@/ts/core';
import React from 'react';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

const TransferView: React.FC<IProps> = ({ current, finished }) => {
  return <TransferRunning current={current} finished={finished} />;
};

export default TransferView;
