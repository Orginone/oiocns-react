import ImageView from './image';
import VideoView from './video';
import { IEntity, ISysFileInfo } from '@/ts/core';
import { command, model, schema } from '@/ts/base';
import React from 'react';
import FormView from './form';
import WorkStart from './work';
import OfficeView from './office';
import ReportView from './report';
import CodeEditor from './codeeditor';
import TransferView from './transfer';
import TemplateView from './page';

const officeExt = ['.md', '.pdf', '.xls', '.xlsx', '.doc', '.docx', '.ppt', '.pptx'];
const videoExt = ['.mp4', '.avi', '.mov', '.mpg', '.swf', '.flv', '.mpeg'];

interface IOpenProps {
  cmd: string;
  entity: IEntity<schema.XEntity> | ISysFileInfo | model.FileItemShare;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
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
  } else {
    switch (props.entity.typeName) {
      case '事项配置':
      case '实体配置':
        return <FormView form={props.entity as any} finished={props.finished} />;
      case '迁移配置':
        return <TransferView current={props.entity as any} finished={props.finished} />;
      case '页面模板':
        return <TemplateView current={props.entity as any} finished={props.finished} />;
      case '办事':
        return <WorkStart current={props.entity as any} finished={props.finished} />;
      case '报表':
        return <ReportView current={props.entity as any} finished={props.finished} />;
      case '目录':
        if (props.cmd === 'openFolderWithEditor') {
          return (
            <CodeEditor
              isProject={props.entity.typeName === '目录'}
              finished={props.finished}
              form={props.entity}
              supportFiles={[
                '.vue',
                '.tsx',
                '.jsx',
                '.js',
                '.json',
                '.html',
                '.java',
              ]}></CodeEditor>
          );
        }
        break;
    }
    command.emitter('config', props.cmd, props.entity);
  }
  return <></>;
};

export default ExecutorOpen;
