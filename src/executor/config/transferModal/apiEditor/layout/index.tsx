import FullScreenModal from '@/executor/tools/fullScreen';
import { IRequest } from '@/ts/core/thing/config';
import React from 'react';
import RequestLayout from './main';

interface IProps {
  current: IRequest;
  finished: () => void;
}

const RequestModal: React.FC<IProps> = ({ current, finished }) => {
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
      <RequestLayout current={current} />
    </FullScreenModal>
  );
};

export default RequestModal;
