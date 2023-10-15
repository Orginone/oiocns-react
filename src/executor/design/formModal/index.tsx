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
      hideMaxed
      width={'80vw'}
      destroyOnClose
      onSave={async () => {
        await current.save();
        finished();
      }}
      title={current.name + '(配置)'}
      footer={[]}
      onCancel={finished}>
      <FormDesign current={current} />
    </FullScreenModal>
  );
};

export default FromModal;
