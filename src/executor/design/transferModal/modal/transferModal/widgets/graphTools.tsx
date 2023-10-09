import { model } from '@/ts/base';
import { ITransfer } from '@/ts/core';
import { Button, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { EnvSelector } from '../../../';
import cls from '../index.module.less';

interface IProps {
  current: ITransfer;
  initStatus: 'Editable' | 'Viewable';
}

const GraphTools: React.FC<IProps> = ({ current, initStatus }) => {
  const [status, setStatus] = useState<model.GStatus>(initStatus);
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
        onClick={() => current.command.emitter('graph', 'executing')}>
        运行
      </Button>
      <Button onClick={() => current.command.emitter('tasks', 'open')}>运行记录</Button>
      <Button
        disabled={status != 'Editable'}
        onClick={() => current.command.emitter('tools', 'newEnvironment')}>
        新增环境
      </Button>
      <EnvSelector current={current} initStatus={initStatus} />
    </Space>
  );
};

export default GraphTools;
