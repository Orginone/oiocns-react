import React from 'react';
import ExecutorOpen from './open';
import { IDirectory } from '@/ts/core';
import orgCtrl from '@/ts/controller';
interface IProps {
  cmd: string;
  args: any[];
  finished: () => void;
}
const DataExecutor: React.FC<IProps> = ({ cmd, args, finished }) => {
  switch (cmd) {
    case 'open':
      if (args && args.length > 1) {
        return <ExecutorOpen typeName={args[0]} file={args[1]} finished={finished} />;
      }
      break;
    case 'refresh':
      (args[0] as IDirectory).loadContent(true).then(() => {
        orgCtrl.changCallback();
      });
      break;
  }
  finished();
  return <></>;
};

export default DataExecutor;
