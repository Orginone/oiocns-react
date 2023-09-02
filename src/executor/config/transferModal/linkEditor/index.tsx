import FullScreenModal from '@/executor/tools/fullScreen';
import { ILink } from '@/ts/core/thing/config';
import React from 'react';
import LinkEditor from './widgets/editor';

// 运行状态
export enum Retention {
  Runtime,
  Configuration,
}
interface IProps {
  current: ILink;
  finished: () => void;
  retention?: Retention;
}

const LinkModal: React.FC<IProps> = ({
  current,
  finished,
  retention = Retention.Configuration,
}) => {
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
      <LinkEditor current={current} retention={retention} />
    </FullScreenModal>
  );
};

export default LinkModal;
