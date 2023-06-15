import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';
import DirectoryForm from './directoryForm';
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
  }
  finished();
  return <></>;
};

export default EntityForm;
