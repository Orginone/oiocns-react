import React from 'react';
import { schema } from '@/ts/base';
import { IBelong, IDirectory, IEntity } from '@/ts/core';
import SearchTarget from './searchTarget';
import JoinTarget from './joinTarget';
import SpeciesModal from './speciesModal';
import ApplicationModal from './applicationModal';
import orgCtrl from '@/ts/controller';
interface IProps {
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

const OperateModal: React.FC<IProps> = ({ cmd, entity, finished }) => {
  const reloadFinish = () => {
    finished();
    orgCtrl.changCallback();
  };
  switch (cmd) {
    case 'pull':
      return (
        <SearchTarget current={(entity as IDirectory).target} finished={reloadFinish} />
      );
    case 'open':
      switch (entity.typeName) {
        case '应用':
          return <ApplicationModal finished={finished} current={entity as any} />;
        case '字典':
        case '分类':
          return <SpeciesModal finished={finished} current={entity as any} />;
        default:
          return <></>;
      }
    default:
      if (cmd.startsWith('join')) {
        return (
          <JoinTarget
            cmd={cmd}
            current={(entity as IDirectory).target as IBelong}
            finished={finished}
          />
        );
      }
      return <></>;
  }
};

export default OperateModal;
