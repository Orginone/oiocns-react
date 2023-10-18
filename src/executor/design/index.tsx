import React from 'react';
import { schema } from '@/ts/base';
import { IBelong, IDirectory, IEntity } from '@/ts/core';
import PullMember from '../operate/pullMember';
import JoinTarget from '../operate/joinTarget';
import SpeciesModal from './speciesModal';
import WorkModal from './workModal';
import orgCtrl from '@/ts/controller';
import LabelsModal from './labelsModal';
import ReportModal from './reportModal';
import { TransferModal } from './transferModal';
import TemplateModal from './templateModal';
interface IProps {
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

const OperateModal: React.FC<IProps> = ({ cmd, entity, finished }) => {
  const reloadFinish = (ok: boolean) => {
    finished();
    if (ok) {
      orgCtrl.changCallback();
    }
  };
  switch (cmd) {
    case 'pull':
      return (
        <PullMember current={(entity as IDirectory).target} finished={reloadFinish} />
      );
    case 'design':
      switch (entity.typeName) {
        case '事项配置':
        case '实体配置':
          return <LabelsModal finished={finished} current={entity as any} />;
        case '报表':
          return <ReportModal finished={finished} current={entity as any} />;
        case '迁移配置':
          return <TransferModal finished={finished} current={entity as any} />;
        case '页面模板':
          return <TemplateModal finished={finished} current={entity as any} />;
        case '办事':
          return <WorkModal finished={finished} current={entity as any} />;
        case '字典':
        case '分类':
          return <SpeciesModal finished={finished} current={entity as any} />;
        default:
          return <></>;
      }
    default:
      if (cmd.startsWith('join')) {
        var target = entity as IBelong;
        if (entity.typeName === '目录') {
          target = (entity as IDirectory).target as IBelong;
        }
        return <JoinTarget cmd={cmd} current={target} finished={finished} />;
      }
      return <></>;
  }
};

export default OperateModal;
