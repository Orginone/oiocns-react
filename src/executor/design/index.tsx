import React from 'react';
import { schema } from '@/ts/base';
import { IEntity } from '@/ts/core';
import SpeciesModal from './speciesModal';
import WorkModal from './workModal';
import FormModal from './formModal';
import { TransferModal } from './transferModal';
import TemplateModal from './templateModal';
interface IProps {
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}

const OperateModal: React.FC<IProps> = ({ entity, finished }) => {
  switch (entity.typeName) {
    case '表单':
      return <FormModal finished={finished} current={entity as any} />;
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
};

export default OperateModal;
