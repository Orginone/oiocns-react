import ImageView from './image';
import VideoView from './video';
import { IEntity, ISysFileInfo } from '@/ts/core';
import { command, schema } from '@/ts/base';
import React from 'react';
import FormView from './form';
import WorkStart from './work';
import OfficeView from './office';
import MarkdownView from "@/executor/data/open/markdown";

const officeExt = ['.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

interface IOpenProps {
  cmd: string;
  entity: IEntity<schema.XEntity> | ISysFileInfo | model.FileItemShare;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
  if ('size' in props.entity || 'filedata' in props.entity) {
    const data = 'size' in props.entity ? props.entity : props.entity.filedata;
    if (data.contentType?.startsWith('image') || data.thumbnail) {
      return <ImageView share={data} finished={props.finished} />;
    }
    if (
      data.contentType?.startsWith('video') ||
      videoExt.includes(data.extension ?? '-')
    ) {
      return <VideoView share={data} finished={props.finished} />;
    }
    if (data?.extension === '.md') {
      return <MarkdownView share={data} finished={props.finished}></MarkdownView>;
    }
    if (officeExt.includes(data.extension ?? '-')) {
      return <OfficeView share={data} finished={props.finished} />;
    }
  } else {
    switch (props.entity.typeName) {
      case '事项配置':
      case '实体配置':
        return <FormView form={props.entity as any} finished={props.finished} />;
      case '办事':
        return <WorkStart current={props.entity as any} finished={props.finished} />;
    }
    command.emitter('config', props.cmd, props.entity);
  }
  return <></>;
};

export default ExecutorOpen;
