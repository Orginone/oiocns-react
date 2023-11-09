import FullScreenModal from '@/components/Common/fullScreen';
import React from 'react';

interface IProps {
  title: string;
  finished: () => void;
  children: React.ReactNode;
  fullScreen?: boolean;
}

const FullModal: React.FC<IProps> = ({
  title,
  finished,
  children,
  fullScreen = true,
}) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen={fullScreen}
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={title}
      onCancel={() => finished()}>
      {children}
    </FullScreenModal>
  );
};

export { FullModal };
