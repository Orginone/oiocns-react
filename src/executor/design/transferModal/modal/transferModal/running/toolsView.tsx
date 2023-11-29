import { ITransfer } from '@/ts/core';
import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import cls from './../index.module.less';

interface IProps {
  current: ITransfer;
}

export const ToolViews: React.FC<IProps> = ({ current }) => {
  const [status, setStatus] = useState(current.status);
  useEffect(() => {
    const id = current.command.subscribe((type, cmd, args) => {
      if (type == 'graph' && cmd == 'status') {
        setStatus(args);
      }
    });
    return () => {
      current.command.unsubscribe(id);
    };
  });
  return (
    <Space className={cls.tools}>
      <Button onClick={() => current.command.emitter('graph', 'center')}>中心</Button>
      <Button
        disabled={status == 'Running'}
        onClick={() => current.execute('Viewable', 'Run')}>
        运行
      </Button>
    </Space>
  );
};
