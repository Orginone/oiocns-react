import React from 'react';
import { schema } from '@/ts/base';
import { IBelong, IDirectory, IEntity } from '@/ts/core';
import SearchTarget from './searchTarget';
import JoinTarget from './joinTarget';
import SpeciesModal from './speciesModal';
import ApplicationModal from './applicationModal';
import orgCtrl from '@/ts/controller';
import LabelsModal from './labelsModal';
import IdentityModal from './identityModal';
import AuthorityModal from './authorityModal';
import StationModal from './stationModal';
import ReportModal from './reportModal';

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
    case 'settingAuth':
      return (
        <AuthorityModal
          current={((entity as IDirectory).target as IBelong).superAuth!}
          finished={reloadFinish}></AuthorityModal>
      );
    case 'open':
      switch (entity.typeName) {
        case '事项配置':
        case '实体配置':
          return <LabelsModal finished={finished} current={entity as any} />;
        case '应用':
          return <ApplicationModal finished={finished} current={entity as any} />;
        case '字典':
        case '分类':
          return <SpeciesModal finished={finished} current={entity as any} />;
        case '角色':
          return <IdentityModal finished={finished} identity={entity as any} />;
        case '岗位':
          return <StationModal finished={finished} current={entity as any} />;
        case '报表':
          return <ReportModal finished={finished} current={entity as any} />;
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
