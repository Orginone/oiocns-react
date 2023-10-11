import ImageView from './image';
import VideoView from './video';
import { IEntity, ISession, ISysFileInfo, IWorkTask } from '@/ts/core';
import { command, schema } from '@/ts/base';
import React, { useEffect, useState } from 'react';
import OfficeView from './office';
import SessionBody from './session';
import TaskBody from './task';
import JoinApply from './task/joinApply';
import EntityInfo from '@/components/Common/EntityInfo';

const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

interface IOpenProps {
  entity:
    | IEntity<schema.XEntity>
    | ISysFileInfo
    | ISession
    | IWorkTask
    | string
    | undefined;
}
const EntityPreview: React.FC<IOpenProps> = (props: IOpenProps) => {
  const [entity, setEntity] = useState(props.entity);
  useEffect(() => {
    const id = command.subscribe((type, _, ...args: any[]) => {
      if (type != 'preview') return;
      if (args && args.length > 0) {
        setEntity(args[0]);
      } else {
        setEntity(undefined);
      }
    });
    return () => {
      command.unsubscribe(id);
    };
  }, []);
  if (entity && typeof entity != 'string') {
    if ('filedata' in entity) {
      const data = entity.filedata;
      if (data.contentType?.startsWith('image')) {
        return <ImageView share={data} />;
      }
      if (
        data.contentType?.startsWith('video') ||
        videoExt.includes(data.extension ?? '-')
      ) {
        return <VideoView share={data} />;
      }
      if (officeExt.includes(data.extension ?? '-')) {
        return <OfficeView share={data} />;
      }
    }
    if ('activity' in entity) {
      return <SessionBody chat={entity} />;
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
