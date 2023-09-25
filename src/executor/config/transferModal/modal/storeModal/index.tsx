import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import React from 'react';
import { DataTables } from './widgets/dataTables';
import { FullModal } from '../..';

interface IProps {
  transfer: ITransfer;
  current: model.Store;
  finished: () => void;
}

const StoreModal: React.FC<IProps> = ({ transfer, current, finished }) => {
  return (
    <FullModal
      title={'数据查看'}
      finished={finished}
      children={<DataTables transfer={transfer} current={current} />}
    />
  );
};

export { StoreModal };
