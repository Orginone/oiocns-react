import { TargetType } from '@/ts/core';
import { message } from 'antd';
import React from 'react';

import EntityForm from './entityForm';
import OperateModal from './operateModal';
import SettingAuth from './settingModal/settingAuth';
import SettingStation from './settingModal/settingStation';
import SettingIdentity from './settingModal/settingIdentity';

const entityMap: any = {
  目录: 'Dir',
  应用: 'App',
  模块: 'Module',
  属性: 'Property',
  分类: 'Species',
  字典: 'Dict',
  角色: 'Identity',
  岗位: 'Station',
  办事: 'Work',
  报表: 'Report',
  迁移配置: 'TransferConfig',
  事项配置: 'WorkConfig',
  实体配置: 'ThingConfig',
  页面模板: 'PageTemplate'
};

interface IProps {
  cmd: string;
  args: any[];
  finished: () => void;
}
const ConfigExecutor: React.FC<IProps> = ({ cmd, args, finished }) => {
  switch (cmd) {
    case 'open':
      if (Object.keys(entityMap).includes(args[0].typeName)) {
        return <OperateModal cmd={cmd} entity={args[0]} finished={finished} />;
      }
      if (Object.values(TargetType).includes(args[0].typeName as TargetType)) {
        if ('isMember' in args[0]) {
          cmd = 'remark';
          return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
        }
      }
      message.warn('不支持的类型');
      break;
    case 'settingAuth':
      return <SettingAuth space={args[0].target} finished={finished} />;
    case 'settingIdentity':
      return <SettingIdentity target={args[0].target} finished={finished} />;
    case 'settingStation':
      return <SettingStation company={args[0].target} finished={finished} />;
    case 'update':
    case 'remark':
      if ('attributes' in args[0]) {
        return <EntityForm cmd={cmd + 'Form'} entity={args[0]} finished={finished} />;
      }
      if (Object.keys(entityMap).includes(args[0].typeName)) {
        return (
          <EntityForm
            cmd={cmd + entityMap[args[0].typeName]}
            entity={args[0]}
            finished={finished}
          />
        );
      }
      if (Object.values(TargetType).includes(args[0].typeName as TargetType)) {
        return <EntityForm cmd={cmd} entity={args[0]} finished={finished} />;
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
