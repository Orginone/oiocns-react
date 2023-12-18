import React from 'react';
import { IWorkTask } from '@/ts/core';
import FullScreenModal from '@/components/Common/fullScreen';
import Content from '@/executor/tools/task';

export interface TaskDetailType {
  current: IWorkTask;
  finished: () => void;
}

const TaskContent: React.FC<TaskDetailType> = ({ current, finished }) => {
  return (
    <>
      <FullScreenModal
        open
        centered
        fullScreen
        width={'80vw'}
        bodyHeight={'80vh'}
        destroyOnClose
        title={current.taskdata.taskType}
        footer={[]}
        onCancel={finished}>
        <Content current={current} finished={finished} />
      </FullScreenModal>
    </>
  );
};

export default TaskContent;
