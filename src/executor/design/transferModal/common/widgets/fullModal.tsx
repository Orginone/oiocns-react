import FullScreenModal from '@/components/Common/fullScreen';
import React from 'react';

interface IProps {
  title: string;
  finished: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
  onSave?: () => void;
}

const FullModal: React.FC<IProps> = (props) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen={props.fullScreen ?? true}
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={props.title}
      onSave={props.onSave}
      onCancel={() => props.finished()}>
      {props.children}
    </FullScreenModal>
  );
};

export { FullModal };
