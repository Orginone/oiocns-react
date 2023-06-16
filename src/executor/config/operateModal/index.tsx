import { schema } from '@/ts/base';
import { IBelong, IDirectory, IEntity } from '@/ts/core';
import SearchTarget from './searchTarget';
import JoinTarget from './joinTarget';
import React from 'react';
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
