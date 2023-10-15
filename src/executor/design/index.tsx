import React from 'react';
import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';
import SpeciesModal from './speciesModal';
import WorkModal from './workModal';
import LabelsModal from './labelsModal';
import ReportModal from './reportModal';
import FormModal from './formModal';
import { TransferModal } from './transferModal';
interface IProps {
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

// return <LabelsModal finished={finished} current={entity as any} />;
const OperateModal: React.FC<IProps> = ({ entity, finished }) => {
  switch (entity.typeName) {
    case '事项配置':
    case '实体配置':
    case '表单':
      return <FormModal finished={finished} current={entity as any} />;
    case '报表':
      return <ReportModal finished={finished} current={entity as any} />;
    case '迁移配置':
      return <TransferModal finished={finished} current={entity as any} />;
    case '办事':
      return <WorkModal finished={finished} current={entity as any} />;
    case '字典':
    case '分类':
      return <SpeciesModal finished={finished} current={entity as any} />;
    default:
      return <></>;
  }
};

export default OperateModal;
