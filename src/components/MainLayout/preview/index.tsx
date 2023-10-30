import ImageView from './image';
import VideoView from './video';
import {
  IDirectory,
  IEntity,
  IForm,
  ISession,
  ISysFileInfo,
  ITarget,
  IWorkTask,
  TargetType,
} from '@/ts/core';
import { command, schema } from '@/ts/base';
import React, { useEffect, useState } from 'react';
import OfficeView from './office';
import SessionBody from './session';
import StorageBody from './storage';
import TaskBody from './task';
import JoinApply from './task/joinApply';
import EntityInfo from '@/components/Common/EntityInfo';
import WorkForm from '@/components/DataStandard/WorkForm';

const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

type EntityType =
  | IEntity<schema.XEntity>
  | ISysFileInfo
  | ISession
  | IWorkTask
  | IForm
  | ITarget
  | IDirectory
  | string
  | undefined;

interface IOpenProps {
  flag?: string;
  entity: EntityType;
}

/** 文件预览 */
const FilePreview: React.FC<{ file: ISysFileInfo }> = ({ file }) => {
  const data = file.filedata;
  if (data.contentType?.startsWith('image')) {
    return <ImageView share={data} />;
  }
  if (data.contentType?.startsWith('video') || videoExt.includes(data.extension ?? '-')) {
    return <VideoView share={data} />;
  }
  if (officeExt.includes(data.extension ?? '-')) {
    return <OfficeView share={data} />;
  }
  return <EntityInfo entity={file} column={1} />;
};

/** 实体预览 */
const EntityPreview: React.FC<IOpenProps> = (props: IOpenProps) => {
  if (!(props.flag && props.flag.length > 0)) return <></>;
  const [entity, setEntity] = useState<EntityType>(props.entity);
  useEffect(() => {
    const id = command.subscribe((type, flag, ...args: any[]) => {
      if (type != 'preview' || flag != props.flag) return;
      if (args && args.length > 0) {
        setEntity(args[0]);
      } else {
        setEntity(undefined);
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, [props.flag]);

  if (entity && typeof entity != 'string') {
    if ('filedata' in entity) {
      return <FilePreview file={entity} />;
    }
    if ('activity' in entity) {
      return <SessionBody target={entity.target} session={entity} />;
    }
    if ('session' in entity) {
      if (entity.typeName === TargetType.Storage) {
        return <StorageBody storage={entity as any} />;
      }
      return <SessionBody target={entity} session={entity.session} setting />;
    }
    if ('fields' in entity) {
      return <WorkForm form={entity} />;
    }
    if ('taskdata' in entity) {
      switch (entity.taskdata.taskType) {
        case '事项':
          return <TaskBody task={entity} />;
        case '加用户':
          return <JoinApply task={entity} />;
        default:
          return <></>;
      }
    }
    return <EntityInfo entity={entity} column={1} />;
  }
  return <></>;
};

export default EntityPreview;
