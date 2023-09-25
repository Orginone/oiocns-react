import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import React from 'react';
import { FullModal } from '../..';
import { Request } from './widgets/request';

interface IProps {
  transfer: ITransfer;
  current: model.Request;
  finished: () => void;
}

const RequestModal: React.FC<IProps> = ({ transfer, current, finished }) => {
  return (
    <FullModal
      title={'数据查看'}
      finished={finished}
      children={<Request transfer={transfer} current={current} />}
    />
  );
};

export { RequestModal };
