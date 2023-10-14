import React from 'react';
import FormDesign from '@/components/DataStandard/WorkForm/Design';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';

interface IProps {
  current: IForm;
  finished: () => void;
}
const FromModal: React.FC<IProps> = ({ current, finished }: IProps) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      destroyOnClose
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={finished}>
      <FormDesign current={current} />
    </FullScreenModal>
  );
};

export default FromModal;
