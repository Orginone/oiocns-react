import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Mapper } from './widgets/mapper';
import React from 'react';
import { FullModal } from '../..';

interface IProps {
  transfer: ITransfer;
  current: model.Mapping;
  finished: () => void;
}

const MappingModal: React.FC<IProps> = ({ transfer, current, finished }) => {
  return (
    <FullModal
      title={'数据映射'}
      finished={finished}
      children={<Mapper transfer={transfer} current={current} />}
    />
  );
};

export { MappingModal };
