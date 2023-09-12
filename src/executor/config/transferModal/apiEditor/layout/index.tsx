import FullScreenModal from '@/executor/tools/fullScreen';
import React from 'react';
import RequestLayout from './main';
import { ILink } from '@/ts/core/thing/link';
import { model } from '@/ts/base';

interface IProps {
  current: ILink;
  node: model.RequestNode;
  finished: () => void;
}

const RequestModal: React.FC<IProps> = ({ current, node, finished }) => {
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
      <RequestLayout current={current} node={node} />
    </FullScreenModal>
  );
};

export default RequestModal;
