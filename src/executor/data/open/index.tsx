import ImageView from './image';
import { IEntity, ISysFileInfo } from '@/ts/core';
import { schema } from '@/ts/base';
import React from 'react';
import FormView from './form';
import WorkStart from './work';
import OfficeView from './office';
import { message } from 'antd';

interface IOpenProps {
  cmd: string;
  entity: IEntity<schema.XEntity> | ISysFileInfo;
  finished: () => void;
}
const ExecutorOpen: React.FC<IOpenProps> = (props: IOpenProps) => {
  switch (props.entity.typeName) {
    case '事项配置':
    case '实体配置':
      return <FormView form={props.entity as any} finished={props.finished} />;
    case '办事':
      return <WorkStart current={props.entity as any} finished={props.finished} />;
  }
  if ('filedata' in props.entity) {
    const data = props.entity.filedata;
    if (data.contentType?.startsWith('image')) {
      return <ImageView share={data} finished={props.finished} />;
    }
    switch (data?.extension) {
      case '.docx':
      case '.csv':
      case '.mp4':
      case '.webm':
        return <OfficeView share={data} finished={props.finished} />;
    }
  }
  message.warning('暂不支持打开该类型');
  return <></>;
};

export default ExecutorOpen;
