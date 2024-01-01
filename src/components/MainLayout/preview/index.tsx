import ImageView from './image';
import VideoView from './video';
import {
  IApplication,
  IDirectory,
  IEntity,
  IForm,
  ISession,
  ISysFileInfo,
  ITarget,
  IWork,
  IWorkTask,
} from '@/ts/core';
import { command, schema } from '@/ts/base';
import React, { useEffect, useState } from 'react';
import OfficeView from './office';
import SessionBody from './session';
import TaskBody from '@/executor/tools/task';
import JoinApply from '@/executor/tools/task/joinApply';
import EntityInfo from '@/components/Common/EntityInfo';
import WorkForm from '@/components/DataStandard/WorkForm';
import Directory from '@/components/Directory';
import TaskApproval from '@/executor/tools/task/approval';
import TaskStart from '@/executor/tools/task/start';
import PreviewLayout from './layout';
import { IPageTemplate } from '@/ts/core/thing/standard/page';
import { ViewerHost } from '@/executor/open/page/view/ViewerHost';
import ViewerManager from '@/executor/open/page/view/ViewerManager';
import CohortActivity from './activity/cohort';
import FriendActivity from './activity/friends';

const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

type EntityType =
  | IEntity<schema.XEntity>
  | ISysFileInfo
  | ISession
  | IWorkTask
  | IForm
  | ITarget
  | IWork
  | IDirectory
  | IApplication
  | IPageTemplate
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
const EntityPreview: React.FC<{ flag?: string }> = (props) => {
  if (!(props.flag && props.flag.length > 0)) return <></>;
  const [entity, setEntity] = useState<EntityType>();
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
  }, [props]);

  const renderEntityBody = (entity: any, children?: React.ReactNode) => {
    return <PreviewLayout entity={entity}>{children && children}</PreviewLayout>;
  };

  if (typeof entity === 'string') {
    switch (entity) {
      case 'cohort':
        return <CohortActivity />;
      case 'friend':
        return <FriendActivity />;
    }
  }

  if (entity && typeof entity != 'string') {
    if ('filedata' in entity) {
      return renderEntityBody(entity, <FilePreview key={entity.key} file={entity} />);
    }
    if ('activity' in entity) {
      return <SessionBody key={entity.key} session={entity} />;
    }
    if ('fields' in entity) {
      return renderEntityBody(entity, <WorkForm key={entity.key} form={entity} />);
    }
    if ('taskdata' in entity) {
      switch (entity.taskdata.taskType) {
        case '事项':
          if (['子流程', '网关'].includes(entity.taskdata.approveType)) {
            return renderEntityBody(
              entity,
              <TaskStart key={entity.key} current={entity} />,
            );
          }
          return renderEntityBody(
            entity,
            <TaskBody key={entity.key} current={entity} finished={() => {}} />,
          );
        case '加用户':
          return renderEntityBody(
            entity,
            <>
              <JoinApply key={entity.key} current={entity} />
              <TaskApproval
                task={entity as any}
                finished={() => {
                  command.emitter('preview', 'work');
                }}
              />
            </>,
          );
        default:
          return <></>;
      }
    }
    if ('node' in entity) {
      return renderEntityBody(entity, <TaskStart key={entity.key} current={entity} />);
    }
    if ('session' in entity) {
      switch (props.flag) {
        case 'store':
          return renderEntityBody(
            entity,
            <Directory key={entity.key} root={entity.directory} />,
          );
        case 'relation':
          return <SessionBody key={entity.key} relation session={entity.session} />;
      }
    }
    if ('command' in entity) {
      return <ViewerHost ctx={{ view: new ViewerManager(entity) }} />;
    }
    if ('standard' in entity || 'works' in entity) {
      return renderEntityBody(entity, <Directory key={entity.key} root={entity} />);
    }
    return renderEntityBody(entity);
  }
  return <img src="/img/ysytBg.png" />;
};

export default EntityPreview;
