import { IWork, IWorkTask } from '@/ts/core';
import React from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import TaskStart from '@/executor/tools/task/start';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
}

/** 办事-业务流程--发起 */
const WorkStartDo: React.FC<IProps> = ({ current, finished }) => {
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'子流程发起'}
      footer={[]}
      onCancel={finished}>
      <TaskStart current={current} finished={finished} />
    </FullScreenModal>
  );
};

export default WorkStartDo;
