import ImageView from './image';
import VideoView from './video';
import {
  IDirectory,
  IEntity,
  IForm,
  IMemeber,
  ISession,
  ISysFileInfo,
  ITarget,
  IWorkTask,
} from '@/ts/core';
import { command, schema } from '@/ts/base';
import React, { useEffect, useState } from 'react';
import OfficeView from './office';
import SessionBody from './session';
import TaskBody from './task';
import JoinApply from './task/joinApply';
import EntityInfo from '@/components/Common/EntityInfo';
import WorkForm from '@/components/DataStandard/WorkForm';
import Directory from '@/components/Directory';

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
  | IMemeber
  | undefined;

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
const EntityPreview: React.FC<{ flag?: string }> = ({ flag }) => {
  if (!(flag && flag.length > 0)) return <></>;
  const [entity, setEntity] = useState<EntityType>();
  useEffect(() => {
    const id = command.subscribe((type, flag, ...args: any[]) => {
      if (type != 'preview' || flag != flag) return;
      if (args && args.length > 0) {
        setEntity(args[0]);
      } else {
        setEntity(undefined);
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, [flag]);

  if (entity && typeof entity != 'string') {
    if ('filedata' in entity) {
      return <FilePreview key={entity.key} file={entity} />;
    }
    if ('activity' in entity) {
      return <SessionBody key={entity.key} target={entity.target} session={entity} />;
    }
    if ('session' in entity && entity.session) {
      return (
        <SessionBody
          setting
          key={entity.key}
          target={entity.session.target}
          session={entity.session}
        />
      );
    }
    if ('fields' in entity) {
      return <WorkForm key={entity.key} form={entity} />;
    }
    if ('taskdata' in entity) {
      switch (entity.taskdata.taskType) {
        case '事项':
          return <TaskBody key={entity.key} task={entity} />;
        case '加用户':
          return <JoinApply key={entity.key} task={entity} />;
        default:
          return <></>;
      }
    }
    if ('isContainer' in entity && entity.isContainer) {
      return <Directory key={entity.key} root={entity} />;
    }
    return <EntityInfo entity={entity} column={1} />;
  }
  return <></>;
};

export default EntityPreview;
