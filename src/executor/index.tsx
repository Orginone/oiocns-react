import { command } from '@/ts/base';
import DataExecutor from './data';
import ConfigExecutor from './config';
import React, { useEffect, useState } from 'react';

const Executor: React.FC = () => {
  const [type, setType] = useState<string>('');
  const [cmd, setCmd] = useState<string>('');
  const [args, setArgs] = useState<any[]>([]);
  useEffect(() => {
    const id = command.subscribe((type, cmd, ...args) => {
      console.log(type, cmd, args);
      setType(type);
      setCmd(cmd);
      setArgs(args);
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  const finished = () => {
    setType('');
    setCmd('');
    setArgs([]);
  };
  switch (type) {
    case 'data':
      return <DataExecutor cmd={cmd} args={args} finished={finished} />;
    case 'config':
      return <ConfigExecutor cmd={cmd} args={args} finished={finished} />;
    default:
      return <></>;
  }
};

export default Executor;
