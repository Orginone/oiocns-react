import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Mapper } from './widgets/mapper';
import React from 'react';
import { FullModal } from '../..';
import { generateUuid } from '@/ts/base/common';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
  finished: () => void;
}

const MappingModal: React.FC<IProps> = ({ transfer, current, finished }) => {
  return (
    <FullModal title={'数据映射'} finished={finished}>
      <Mapper key={generateUuid()} transfer={transfer} current={current} />
    </FullModal>
  );
};

export { MappingModal };
