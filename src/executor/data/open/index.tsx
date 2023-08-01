import ImageView from './image';
import VideoView from './video';
import { IEntity, ISysFileInfo } from '@/ts/core';
import { command, schema } from '@/ts/base';
import React from 'react';
import FormView from './form';
import WorkStart from './work';
import OfficeView from './office';
import MarkdownView from "@/executor/data/open/markdown";
<<<<<<< HEAD
import CodeEditor from './CodeEditor';
import MyMdEditor from './MdEditor';
=======
>>>>>>> upstream/dev

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
    // if (data?.extension === '.md') {
    //   return <MarkdownView share={data} finished={props.finished}></MarkdownView>;
    // }
    if (officeExt.includes(data.extension ?? '-')) {
      return <OfficeView share={data} finished={props.finished} />;
    }
    console.log(data);
    
    if (['.vue', '.tsx', '.jsx', '.js', '.json', '.html', '.java'].find((m) => m === data?.extension)){
      return (
        <CodeEditor
        isProject={false}
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
      )
    }
    if (props.entity.typeName.startsWith('text')) { //注释md文档
      return <MyMdEditor finished={props.finished} form={props.entity} />;
    }
  } else {
    switch (props.entity.typeName) {
      case '事项配置':
      case '实体配置':
        return <FormView form={props.entity as any} finished={props.finished} />;
      case '办事':
        return <WorkStart current={props.entity as any} finished={props.finished} />;
      case '目录':
        if(props.cmd === 'openFolderWithEditor'){
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
          )
        }
    }
    command.emitter('config', props.cmd, props.entity);
  }
  return <></>;
};

export default ExecutorOpen;
