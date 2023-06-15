import { IDirectory, TargetType } from '@/ts/core';
import React from 'react';
import orgCtrl from '@/ts/controller';
import EntityForm from './entityForm';
interface IProps {
  cmd: string;
  args: any[];
  finished: () => void;
}
const ConfigExecutor: React.FC<IProps> = ({ cmd, args, finished }) => {
  switch (cmd) {
    case 'open':
      if (['目录', Object.values(TargetType)].includes(args[0].typeName)) {
        orgCtrl.currentKey = args[0].key;
        orgCtrl.changCallback();
      }
      break;
    case 'newDir':
      return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
    case 'update':
    case 'remark':
      switch (args[0].typeName) {
        case '目录':
          return <EntityForm cmd={cmd + 'Dir'} entity={args[0]} finished={finished} />;
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

export default ConfigExecutor;
