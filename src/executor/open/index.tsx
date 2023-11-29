import ImageView from './image';
import VideoView from './video';
import React from 'react';
import FormView from './form';
import WorkStart from './work';
import TaskContent from './task';
import OfficeView from './office';
import TransferView from './transfer';
import AudioPlayer from './audio';
import EntityPreview from './entity';
import CodeEditor from './codeeditor';
import EntityForm from '../operate/entityForm';
import { IEntity, ISysFileInfo, TargetType } from '@/ts/core';
import JoinApply from './task/joinApply';
import { model, schema } from '@/ts/base';
import TemplateView from './page';
const audioExt = ['.mp3', '.wav', '.ogg'];

const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];
const remarkTypes: any = { 分类: 'Species', 字典: 'Dict', 属性: 'Property', 目录: 'Dir' };

interface IOpenProps {
  cmd: string;
  entity:
    | IEntity<schema.XEntity>
    | ISysFileInfo
    | model.FileItemShare
    | schema.XEntity
    | undefined;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
  if (props.entity === undefined) return <></>;
  if ('size' in props.entity || 'filedata' in props.entity) {
    const data = 'size' in props.entity ? props.entity : props.entity.filedata;
    if (data.contentType?.startsWith('image')) {
      return <ImageView share={data} finished={props.finished} />;
    }
    if (
      data.contentType?.startsWith('video') ||
      videoExt.includes(data.extension ?? '-')
    ) {
      return <VideoView share={data} finished={props.finished} />;
    }
    if (officeExt.includes(data.extension ?? '-')) {
      return <OfficeView share={data} finished={props.finished} />;
    }
    if (
      data.contentType?.startsWith('audio') ||
      audioExt.includes(data.extension ?? '-')
    ) {
      const dir = 'filedata' in props.entity ? props.entity.directory : undefined;
      return <AudioPlayer finished={props.finished} directory={dir} share={data} />;
    }
    if (data.contentType?.startsWith('text')) {
      return <CodeEditor share={data} finished={props.finished} />;
    }
  } else if ('key' in props.entity) {
    switch (props.entity.typeName) {
      case '表单':
        return <FormView form={props.entity as any} finished={props.finished} />;
      case '迁移配置':
        return <TransferView current={props.entity as any} finished={props.finished} />;
      case '页面模板':
        return <TemplateView current={props.entity as any} finished={props.finished} />;
      case '办事':
      case '子流程':
        return (
          <WorkStart
            key={props.entity.key}
            current={props.entity as any}
            finished={props.finished}
          />
        );
      case '加用户':
        return (
          <>
            <JoinApply
              key={props.entity.key}
              current={props.entity as any}
              finished={props.finished}
            />
          </>
        );
      case '事项':
        return (
          <TaskContent
            key={props.entity.key}
            current={props.entity as any}
            finished={props.finished}
          />
        );
      default:
        if (remarkTypes[props.entity.typeName]) {
          return (
            <EntityForm
              cmd={`remark${remarkTypes[props.entity.typeName]}`}
              entity={props.entity}
              finished={props.finished}
            />
          );
        }
        if (Object.values(TargetType).includes(props.entity.typeName as TargetType)) {
          return (
            <EntityForm cmd="remark" entity={props.entity} finished={props.finished} />
          );
        }
    }
  } else {
    return <EntityPreview entity={props.entity} finished={props.finished} />;
  }
  return <></>;
};

export default ExecutorOpen;
