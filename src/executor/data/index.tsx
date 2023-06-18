import React from 'react';
import ExecutorOpen from './open';
interface IProps {
  cmd: string;
  args: any[];
  finished: () => void;
}
const DataExecutor: React.FC<IProps> = ({ cmd, args, finished }) => {
  switch (cmd) {
    case 'open':
    case 'remark':
      if (args && args.length > 0) {
        return <ExecutorOpen cmd={cmd} entity={args[0]} finished={finished} />;
      }
      break;
  }
  return <></>;
};

export default DataExecutor;
