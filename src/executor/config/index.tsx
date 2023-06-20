import { TargetType } from '@/ts/core';
import React from 'react';
import EntityForm from './entityForm';
import OperateModal from './operateModal';

interface IProps {
  cmd: string;
  args: any[];
  finished: () => void;
}
const ConfigExecutor: React.FC<IProps> = ({ cmd, args, finished }) => {
  switch (cmd) {
    case 'open':
      switch (args[0].typeName) {
        case '应用':
        case '分类':
        case '字典':
        case '角色':
        case '岗位':
        case '事项配置':
        case '实体配置':
          return <OperateModal cmd={cmd} entity={args[0]} finished={finished} />;
        default: {
          if (Object.values(TargetType).includes(args[0].typeName as TargetType)) {
            if ('isMember' in args[0]) {
              cmd = 'remark';
              return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
            }
          }
        }
      }
      break;
    case 'settingAuth':
      return <OperateModal cmd={cmd} entity={args[0]} finished={finished} />;
    case 'update':
    case 'remark':
      switch (args[0].typeName) {
        case '目录':
          return <EntityForm cmd={cmd + 'Dir'} entity={args[0]} finished={finished} />;
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
          return <EntityForm cmd={cmd + 'Dict'} entity={args[0]} finished={finished} />;
        case '角色':
          return (
            <EntityForm cmd={cmd + 'Identity'} entity={args[0]} finished={finished} />
          );
        case '事项配置':
          return (
            <EntityForm cmd={cmd + 'WorkConfig'} entity={args[0]} finished={finished} />
          );
        case '实体配置':
          return (
            <EntityForm cmd={cmd + 'ThingConfig'} entity={args[0]} finished={finished} />
          );
        default: {
          if (Object.values(TargetType).includes(args[0].typeName as TargetType)) {
            return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
          }
        }
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
