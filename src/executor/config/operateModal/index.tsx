import { schema } from '@/ts/base';
import { IDirectory, IEntity } from '@/ts/core';
import SearchTarget from './searchTarget';
import React from 'react';
import orgCtrl from '@/ts/controller';
interface IProps {
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

const OperateModal: React.FC<IProps> = ({ cmd, entity, finished }) => {
  console.log(cmd, entity);
  const reloadFinish = () => {
    finished();
    orgCtrl.changCallback();
  };
  switch (cmd) {
    case 'pull':
      return (
        <SearchTarget
          current={(entity as IDirectory).target}
          finished={reloadFinish}></SearchTarget>
      );
    default:
      return <></>;
  }
};

export default OperateModal;
