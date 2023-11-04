import { ITransfer } from '@/ts/core';
import React, { useEffect, useState } from 'react';
import { FullModal, Center, NodeForms } from '../../../common';
import Editor from './editor';
import Tools from './tools';
import Settings from './settings';
import Nodes from './nodes';
import Tasks from './tasks';
import { generateUuid } from '@/ts/base/common';
import { Spin } from 'antd';

interface IProps {
  current: ITransfer;
  finished: () => void;
}

export const TransferModal: React.FC<IProps> = ({ current, finished }) => {
  const [key, setKey] = useState(generateUuid());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    current.initializing().then(() => setLoading(false));
    const id = current.subscribe(() => setKey(generateUuid()));
    return () => {
      current.unsubscribe(id);
      current.update(current.metadata);
    };
  }, [current.metadata]);
  return (
    <FullModal key={key} title={'迁移配置'} finished={finished}>
      <Spin spinning={loading}>
        <Editor current={current} />
        <Tools current={current} />
        <Settings current={current} />
        <Nodes current={current} />
        <NodeForms current={current} />
        <Center current={current} />
        <Tasks current={current} />
      </Spin>
    </FullModal>
  );
};
