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
      if (args && args.length > 0) {
        return <ExecutorOpen file={args[0]} finished={finished} />;
      }
      break;
    case 'refresh':
      (args[0] as IDirectory).loadContent(true).then(() => {
        orgCtrl.changCallback();
      });
      break;
    case 'delete':
      if ('delete' in args[0]) {
        args[0].delete().then((success: boolean) => {
          if (success) {
            orgCtrl.changCallback();
          }
        });
      }
      break;
  }
  finished();
  return <></>;
};

export default DataExecutor;
