import ImageView from './image';
import VideoView from './video';
import { IEntity, ISession, ISysFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import React from 'react';
import OfficeView from './office';
import SessionBody from './session';
import EntityInfo from '@/components/Common/EntityInfo';

const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

interface IOpenProps {
  entity: IEntity<schema.XEntity> | ISysFileInfo | ISession;
}
const EntityPreview: React.FC<IOpenProps> = (props: IOpenProps) => {
  if ('filedata' in props.entity) {
    const data = props.entity.filedata;
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
  if ('activity' in props.entity) {
    return <SessionBody chat={props.entity} />;
  }
  return <EntityInfo entity={props.entity} column={1} />;
};

export default EntityPreview;
