import { IWork, IWorkTask } from '@/ts/core';
import React, { useEffect, useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
// import TaskStart from '@/executor/tools/task/start';
import MultitabTable from '@/executor/tools/task//multitabTable'
import { model } from '@/ts/base';
// 卡片渲染
interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
  data?: model.InstanceDataModel;
}

/** 办事-业务流程--发起 */
const WorkStartDo: React.FC<IProps> = ({ current, finished, data }) => {
  const [activeKey, setActiveKey] = useState(1)
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={'发起流程'}
      footer={[]}
      onCancel={finished}>
      {/* <TaskStart current={current} finished={finished} data={data} /> */}
      <MultitabTable current={current} finished={finished} data={data} activeKey={activeKey}/>
    </FullScreenModal>
  );
};

export default WorkStartDo;
