import React from 'react';
import { IForm } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';
import ReportDesign from '@/components/Common/ReportDesign';
interface IProps {
  current: IForm;
  finished: () => void;
}
const ReportModal: React.FC<IProps> = ({ current, finished }: IProps) => {
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
      title={current.typeName + '管理'}
      footer={[]}
      onCancel={finished}>
      <ReportDesign current={current}></ReportDesign>
    </FullScreenModal>
  );
};

export default ReportModal;
