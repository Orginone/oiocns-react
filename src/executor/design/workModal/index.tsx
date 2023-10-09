import React, { useState } from 'react';
import { IWork } from '@/ts/core';
import { message } from 'antd';
import FlowDesign from '@/components/Common/FlowDesign';
import FullScreenModal from '@/components/Common/fullScreen';

type IProps = {
  current: IWork;
  finished: () => void;
};

/*
  弹出框表格查询
*/
const ApplicationModal: React.FC<IProps> = ({ current, finished }) => {
  const [isSave, setIsSave] = useState<boolean>(false);

  return (
    <FullScreenModal
      open
      centered
      fullScreen
      destroyOnClose
      footer={[]}
      width="80vw"
      okText="发布"
      cancelText="取消"
      title={`事项[${current.name}]设计`}
      onSave={() => setIsSave(true)}
      onCancel={() => finished()}>
      <FlowDesign
        current={current}
        onSave={isSave}
        onSaveFinished={(success) => {
          if (success) {
            message.info('保存成功', 0.5);
            finished();
          }
          setIsSave(false);
        }}
      />
    </FullScreenModal>
  );
};

export default ApplicationModal;
