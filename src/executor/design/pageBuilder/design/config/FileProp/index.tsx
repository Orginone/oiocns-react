import OpenFileDialog, { IFileDialogProps } from '@/components/OpenFileDialog';
import { schema } from '@/ts/base';
import { Tooltip } from 'antd';
import React, { ReactNode, useContext, useState } from 'react';
import { PageContext } from '../../../render/PageContext';
import { IExistTypeProps } from '../IExistTypeEditor';
import cls from './index.module.less';
import { CloseCircleOutlined } from '@ant-design/icons';
import { IFile } from '@/ts/core';
import { pick } from 'lodash';

export interface SEntity extends Pick<schema.XEntity, 'id' | 'name'> {}

export interface SProperty extends SEntity {
  valueType: string;
  unit?: string;
}

interface IProps extends Omit<IFileDialogProps, 'rootKey' | 'onCancel'> {
  children: ReactNode;
}

export const File: React.FC<IProps> = (props) => {
  const ctx = useContext(PageContext);
  const [center, setCenter] = useState(<></>);
  return (
    <>
      <div
        style={{ width: '100%' }}
        onClick={() => {
          setCenter(
            <OpenFileDialog
              {...props}
              rootKey={ctx.view.pageInfo.directory.spaceKey}
              onOk={(files) => {
                if (files.length > 0) {
                  props.onOk(files);
                }
                setCenter(<></>);
              }}
              onCancel={() => setCenter(<></>)}
            />,
          );
        }}>
        {props.children}
      </div>
      {center}
    </>
  );
};

export interface TextProps {
  value?: string;
  children?: ReactNode;
  width?: string | number;
  height?: string | number;
}

export const TipDesignText: React.FC<TextProps> = (props) => {
  return (
    <Tooltip title={props.value}>
      <div
        style={{ height: props.height, width: props.width ?? '100%' }}
        className={cls.designText}>
        <div className={cls.textOverflow}>{props.value}</div>
        <div className={cls.textChildren}>{props.children}</div>
      </div>
    </Tooltip>
  );
};

export const TipText: React.FC<{ value?: string }> = (props) => {
  return (
    <Tooltip title={props.value}>
      <div className={cls.viewText}>
        <div className={cls.textOverflow}>{props.value}</div>
      </div>
    </Tooltip>
  );
};

export const Delete: React.FC<IExistTypeProps<any>> = (props) => {
  return (
    <CloseCircleOutlined
      style={{
        position: 'absolute',
        visibility: props.value ? 'visible' : 'hidden',
        color: 'red',
        top: 6,
        right: 6,
      }}
      onClick={(e) => {
        e.stopPropagation();
        props.onChange(undefined);
      }}
    />
  );
};

interface IBase extends IExistTypeProps<any> {
  accepts: string[];
  showName: any;
  onOk: (fs: IFile[]) => void;
}

export const BaseFile: React.FC<IBase> = (props) => {
  return (
    <File onOk={props.onOk} accepts={props.accepts}>
      <TipDesignText value={props.showName}>
        <Delete {...props} />
      </TipDesignText>
    </File>
  );
};

export const Picture: React.FC<IExistTypeProps<SEntity>> = (props) => {
  return (
    <BaseFile
      {...props}
      accepts={['图片']}
      showName={props.value?.name ?? '绑定图片'}
      onOk={(fs) => props.onChange(pick(fs[0].metadata, 'id', 'name'))}
    />
  );
};

export const Work: React.FC<IExistTypeProps<SEntity>> = (props) => {
  return (
    <BaseFile
      {...props}
      accepts={['办事']}
      showName={props.value?.name ?? '绑定办事'}
      onOk={(fs) => props.onChange(pick(fs[0].metadata, 'id', 'name'))}
    />
  );
};

export const Form: React.FC<IExistTypeProps<SEntity>> = (props) => {
  return (
    <BaseFile
      {...props}
      accepts={['表单']}
      showName={props.value?.name ?? '绑定表单'}
      onOk={(fs) => props.onChange(pick(fs[0].metadata, 'id', 'name'))}
    />
  );
};
