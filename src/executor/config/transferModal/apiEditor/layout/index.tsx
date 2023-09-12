import FullScreenModal from '@/executor/tools/fullScreen';
import React from 'react';
import RequestLayout from './main';
import { ITransfer } from '@/ts/core';
import { model } from '@/ts/base';

interface IProps {
  transfer: ITransfer;
  current: model.RequestNode;
  finished: () => void;
}

const RequestModal: React.FC<IProps> = ({ transfer, current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'请求配置'}
      onCancel={() => finished()}>
      <RequestLayout transfer={transfer} current={current} />
    </FullScreenModal>
  );
};

export default RequestModal;
