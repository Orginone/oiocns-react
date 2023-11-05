import { ITransfer } from '@/ts/core';
import React, { useEffect, useState } from 'react';
import { Center, FullModal } from '../../../common';
import { GraphView } from './graphView';
import { ToolViews } from './toolsView';
import { generateUuid } from '@/ts/base/common';
import { Spin } from 'antd';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

export const TransferRunning: React.FC<IProps> = ({ current, finished }) => {
  const [key, setKey] = useState(generateUuid());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    current.initializing().then(() => setLoading(false));
    const id = current.subscribe(() => setKey(generateUuid()));
    return () => {
      current.unsubscribe(id);
    };
  }, [current.metadata]);
  return (
    <FullModal key={key} title={'迁移运行'} finished={finished}>
      <Spin spinning={loading}>
        <GraphView current={current} />
        <ToolViews current={current} />
        <Center current={current} />
      </Spin>
    </FullModal>
  );
};
