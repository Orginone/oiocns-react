import { IWork, IWorkTask } from '@/ts/core';
import React, { useEffect, useState } from 'react';
import FullScreenModal from '@/components/Common/fullScreen';
import MultitabTable from '@/executor/tools/task/multitabTable';

import { model } from '@/ts/base';

interface IProps {
  current: IWork | IWorkTask;
  finished?: () => void;
  data?: model.InstanceDataModel;
}

/** 办事-业务流程--发起 */
const TabTable: React.FC<IProps> = ({ current, finished, data }) => {
  const [activeKey, setActiveKey] = useState(1);
  const title = current.name;
  return (
    <FullScreenModal
      open
      centered
      fullScreen
      width={'80vw'}
      bodyHeight={'80vh'}
      destroyOnClose
      title={title}
      footer={[]}
      onCancel={finished}>
      <MultitabTable
        current={current}
        finished={finished}
        data={data}
        activeKey={activeKey}
      />
    </FullScreenModal>
  );
};

export default TabTable;
