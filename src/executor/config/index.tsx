import { IDirectory, ITarget, TargetType } from '@/ts/core';
import React from 'react';
import orgCtrl from '@/ts/controller';
import EntityForm from './entityForm';
import OperateModal from './operateModal';
import { IMemeber } from '@/ts/core';

interface IProps {
  cmd: string;
  args: any[];
  finished: () => void;
}
const ConfigExecutor: React.FC<IProps> = ({ cmd, args, finished }) => {
  const openDir = () => {
    let dir: IDirectory = args[0];
    if ('targets' in args[0]) {
      dir = (args[0] as ITarget).directory;
    }
    dir.loadContent().then(() => {
      orgCtrl.currentKey = dir.key;
      orgCtrl.changCallback();
    });
    finished();
    return <></>;
  };
  switch (cmd) {
    case 'open':
    case 'update':
    case 'remark':
      switch (args[0].typeName) {
        case '目录':
          if (cmd === 'open') {
            return openDir();
          } else {
            return <EntityForm cmd={cmd + 'Dir'} entity={args[0]} finished={finished} />;
          }
        case '应用':
          return <EntityForm cmd={cmd + 'App'} entity={args[0]} finished={finished} />;
        case '属性':
          return (
            <EntityForm cmd={cmd + 'Property'} entity={args[0]} finished={finished} />
          );
        case '分类':
          return (
            <EntityForm cmd={cmd + 'Species'} entity={args[0]} finished={finished} />
          );
        case '字典':
          if (cmd === 'open') {
            return <OperateModal cmd={cmd} entity={args[0]} finished={finished} />;
          }
          return <EntityForm cmd={cmd + 'Dict'} entity={args[0]} finished={finished} />;
        default: {
          if (Object.values(TargetType).includes(args[0].typeName as TargetType)) {
            if (cmd === 'open') {
              if ('isMember' in args[0]) {
                cmd = 'remark';
              } else {
                return openDir();
              }
            }
            return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
          }
        }
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
    case 'remove':
      if ('isMember' in args[0]) {
        const member = args[0] as IMemeber;
        member.directory.target
          .removeMembers([member.metadata])
          .then((success: boolean) => {
            if (success) {
              orgCtrl.changCallback();
            }
          });
      }
      break;
    default:
      if (cmd === 'pull' || cmd.startsWith('join')) {
        return <OperateModal cmd={cmd} entity={args[0]} finished={finished} />;
      }
      return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
  }
  return <></>;
};

export default ConfigExecutor;
