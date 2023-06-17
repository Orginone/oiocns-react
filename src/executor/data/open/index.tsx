import ImageView from './image';
import { IFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import React from 'react';

interface IOpenProps {
  cmd: string;
  file: IFileInfo<schema.XEntity>;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
  if (props.file.typeName.startsWith('image') && props.file.share.avatar) {
    return <ImageView share={props.file.share.avatar} finished={props.finished} />;
  }
  return <></>;
};

export default ExecutorOpen;
