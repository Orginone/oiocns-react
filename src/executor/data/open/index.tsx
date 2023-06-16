import ImageView from './image';
import orgCtrl from '@/ts/controller';
import { IFileInfo, TargetType } from '@/ts/core';
import { schema } from '@/ts/base';
import React from 'react';

interface IOpenProps {
  file: IFileInfo<schema.XEntity>;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
  const dirTyps = ['目录', ...Object.values(TargetType)];
  if (dirTyps.includes(props.file.typeName)) {
    orgCtrl.currentKey = props.file.key;
    orgCtrl.changCallback();
  }
  if (props.file.typeName.startsWith('image') && props.file.share.avatar) {
    return <ImageView share={props.file.share.avatar} finished={props.finished} />;
  }
  props.finished();
  return <></>;
};

export default ExecutorOpen;
