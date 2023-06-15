import { schema } from '@/ts/base';
import { IDirectory, IEntity, ITarget, TargetType } from '@/ts/core';
import DirectoryForm from './directoryForm';
import ApplicationForm from './ApplicationForm';
import SpeciesForm from './SpeciesForm';
import PropertyForm from './PropertyForm';
import TargetForm from './TargetForm';
import LabelsForm from './LabelsForm';
import React from 'react';
import orgCtrl from '@/ts/controller';
interface IProps {
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

const EntityForm: React.FC<IProps> = ({ cmd, entity, finished }) => {
  const reloadFinish = () => {
    finished();
    orgCtrl.changCallback();
  };
  switch (cmd) {
    case 'newDir':
    case 'updateDir':
    case 'remarkDir':
      return (
        <DirectoryForm formType={cmd} current={entity as any} finished={reloadFinish} />
      );
    case 'newApp':
    case 'updateApp':
    case 'remarkApp':
      return (
        <ApplicationForm formType={cmd} current={entity as any} finished={reloadFinish} />
      );
    case 'newSpecies':
    case 'updateSpecies':
    case 'remarkSpecies':
    case 'newDict':
    case 'updateDict':
    case 'remarkDict':
      return (
        <SpeciesForm
          formType={cmd.replace('Dict', '').replace('Species', '')}
          typeName={cmd.includes('Dict') ? '字典' : '分类'}
          current={entity as any}
          finished={reloadFinish}
        />
      );
    case 'newWorkConfig':
    case 'updateWorkConfig':
    case 'remarkWorkConfig':
    case 'newThingConfig':
    case 'updateThingConfig':
    case 'remarkThingConfig':
      return (
        <LabelsForm
          formType={cmd.replace('WorkConfig', '').replace('ThingConfig', '')}
          typeName={cmd.includes('WorkConfig') ? '事项配置' : '实体配置'}
          current={entity as any}
          finished={reloadFinish}
        />
      );
    case 'newProperty':
    case 'updateProperty':
    case 'remarkProperty':
      return (
        <PropertyForm formType={cmd} current={entity as any} finished={reloadFinish} />
      );
    default:
      const target = cmd.startsWith('new') ? (entity as IDirectory).target : entity;
      if (Object.values(TargetType).includes(target.typeName as TargetType)) {
        return (
          <TargetForm formType={cmd} target={target as ITarget} finished={reloadFinish} />
        );
      }
  }
  finished();
  return <></>;
};

export default EntityForm;
