import ImageView from './image';
import { IEntity } from '@/ts/core';
import { schema } from '@/ts/base';
import React from 'react';
import FormView from './form';

interface IOpenProps {
  cmd: string;
  entity: IEntity<schema.XEntity>;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
  switch (props.entity.typeName) {
    case '事项配置':
    case '实体配置':
      return <FormView form={props.entity as any} finished={props.finished} />;
  }
  if (props.entity.typeName.startsWith('image') && props.entity.share.avatar) {
    return <ImageView share={props.entity.share.avatar} finished={props.finished} />;
  }
  return <></>;
};

export default ExecutorOpen;
